/* The Awe Finder — AI personalization.
   Builds the reflection prompt, calls the preserved window.claude.complete wiring,
   races it against a 15s timeout, and falls back to a deterministic template that
   still stitches in the user's own words. The app must never break on this. */
(function () {
  "use strict";

  var TIMEOUT_MS = 15000;

  function firstNonEmpty(list) {
    for (var i = 0; i < (list || []).length; i++) {
      if (list[i] && list[i].trim()) return list[i].trim();
    }
    return "";
  }

  // Strip a leading "I am " so a phrase reads naturally mid-sentence.
  function stripIAm(s) {
    return (s || "").replace(/^\s*i\s*am\s+/i, "").trim();
  }

  function domainName(key) {
    var d = (window.AweData.DOMAINS || []).filter(function (x) { return x.key === key; })[0];
    return d ? d.name : key;
  }

  // Compact the full answer object into the JSON payload the model receives.
  function buildData(answers) {
    var a = answers || {};
    var wheel = a.wheel || {};
    var scores = {};
    (window.AweData.DOMAINS || []).forEach(function (d) {
      var r = wheel[d.key] || {};
      scores[d.name] = {
        score: typeof r.score === "number" ? r.score : null,
        why: (r.why || "").trim() || null
      };
    });

    // Top time gaps: |wanted - actual| across normalized passes.
    var gaps = computeGaps(a);

    return {
      i_am: (a.identity || []).slice(),
      wheel_scores: scores,
      top_time_gaps: gaps.slice(0, 3).map(function (g) {
        return { bucket: g.name, has_percent: g.actual, wants_percent: g.wanted };
      }),
      situation: (a.reframe && a.reframe.situation) || "",
      story_i_tell_myself: (a.reframe && a.reframe.story) || "",
      whats_also_true: (a.reframe && a.reframe.alsoTrue) || "",
      focus_domain: domainName(a.focusDomain),
      chosen_practice: a.practiceLabel || ""
    };
  }

  // Normalize each pass to 100 and rank buckets by absolute gap. Shared with Phase 3 UI.
  function computeGaps(answers) {
    var a = answers || {};
    var buckets = window.AweData.TIME_BUCKETS || [];
    var now = a.timeNow || {};
    var want = a.timeWant || {};
    function norm(src) {
      var total = 0;
      buckets.forEach(function (b) { total += Number(src[b.key] || 0); });
      var out = {};
      buckets.forEach(function (b) {
        out[b.key] = total > 0 ? Math.round((Number(src[b.key] || 0) / total) * 100) : 0;
      });
      return out;
    }
    var na = norm(now), nw = norm(want);
    return buckets.map(function (b) {
      return {
        key: b.key,
        name: b.name,
        actual: na[b.key],
        wanted: nw[b.key],
        gap: nw[b.key] - na[b.key]
      };
    }).sort(function (x, y) { return Math.abs(y.gap) - Math.abs(x.gap); });
  }

  function buildReflectionPrompt(answers) {
    var payload = buildData(answers);
    return [
      "You are writing a short personal reflection for the closing page of a self-reflection tool.",
      "The reader has just finished mapping how they are living against how they want to live.",
      "",
      "Here is everything they told the tool, as JSON:",
      JSON.stringify(payload, null, 2),
      "",
      "Write a reflection back to them with these rules, and nothing else:",
      "- 3 to 5 sentences. Plain text only. No JSON, no markdown, no lists, no preamble, no sign-off.",
      "- Second person. Warm, direct, specific. Not an advice column. No clichés, no wellness-speak.",
      "- Weave in at least two of their exact phrases — favor their 'i_am' words and their 'whats_also_true' reframe.",
      "- Name their focus domain and their chosen practice so the reflection is clearly theirs.",
      "- Do not congratulate them or tell them what to do. Reflect what is true in what they wrote."
    ].join("\n");
  }

  // Deterministic fallback assembled from the user's own words.
  function fallbackReflection(answers) {
    var a = answers || {};
    var iam = stripIAm(firstNonEmpty(a.identity));
    var focus = domainName(a.focusDomain);
    var practice = (a.practiceLabel || "your practice").trim();
    var alsoTrue = (a.reframe && a.reframe.alsoTrue || "").trim();

    var parts = [];
    if (iam) {
      parts.push("You started by saying you are " + iam + ", and that is a good place to build from.");
    } else {
      parts.push("You showed up honestly, and that is a good place to build from.");
    }
    parts.push("The area you chose to tend is " + focus + ", and the practice you picked — " + practice + " — is small enough to actually keep.");
    if (alsoTrue) {
      parts.push("Hold onto the thing you noticed was also true: " + trimEndPunct(alsoTrue) + ".");
    }
    parts.push("None of this asks you to become someone else. It asks you to give your attention to what already matters to you, a little more deliberately, starting this week.");
    return parts.join(" ");
  }

  function trimEndPunct(s) {
    return (s || "").replace(/[.!?\s]+$/, "");
  }

  // Returns { text, offline: boolean }. Never throws.
  function generateReflection(answers) {
    var prompt = buildReflectionPrompt(answers);

    var apiCall = new Promise(function (resolve, reject) {
      if (!(window.claude && typeof window.claude.complete === "function")) {
        reject(new Error("API wiring unavailable"));
        return;
      }
      window.claude.complete(prompt).then(resolve, reject);
    });

    var timeout = new Promise(function (_, reject) {
      setTimeout(function () { reject(new Error("timeout")); }, TIMEOUT_MS);
    });

    return Promise.race([apiCall, timeout]).then(function (text) {
      var clean = (text || "").trim();
      if (!clean) throw new Error("empty");
      return { text: clean, offline: false };
    }).catch(function (err) {
      console.warn("[Awe Finder] reflection fallback:", err && err.message);
      return { text: fallbackReflection(answers), offline: true };
    });
  }

  window.AweAI = {
    buildReflectionPrompt: buildReflectionPrompt,
    generateReflection: generateReflection,
    computeGaps: computeGaps
  };
})();
