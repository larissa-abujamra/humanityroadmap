/* Phase 3 — Time & intention audit. Two passes over the same seven buckets
   (actual week, then wanted week), independent 0–60 sliders with a running
   total, then a gap reveal with paired bars and a dynamic connection line. */
(function () {
  "use strict";
  var useState = React.useState, h = React.createElement;

  function total(map) {
    return window.AweData.TIME_BUCKETS.reduce(function (s, b) {
      return s + Number((map || {})[b.key] || 0);
    }, 0);
  }

  function Pass(props) {
    var Slider = window.AweUI.Slider, Reveal = window.AweUI.Reveal;
    var buckets = window.AweData.TIME_BUCKETS;
    var vals = props.values || {};
    var sum = total(vals);

    return h("div", { className: "stage" },
      h("div", { className: "stage-inner" },
        h(Reveal, null,
          h("h1", { className: "headline", style: { marginBottom: 16 } }, props.headline),
          h("p", { className: "field-help", style: { fontSize: 16, marginBottom: 40 } }, props.instruction)
        ),
        buckets.map(function (b) {
          var v = Number(vals[b.key] || 0);
          return h("div", { className: "domain-row", key: b.key, style: { marginBottom: 22 } },
            h("div", { className: "domain-head" },
              h("span", { className: "domain-name", style: { fontSize: 22 } },
                b.name,
                b.clarifier ? h("span", { className: "domain-clar", style: { display: "inline", marginLeft: 8, fontSize: 13 } }, "— " + b.clarifier) : null),
              h("span", { className: "domain-value", style: { fontSize: 22 } }, v)
            ),
            h(Slider, {
              value: v, min: 0, max: 60,
              ariaLabel: b.name + " share of the week",
              onChange: function (nv) { props.onChange(b.key, nv); }
            })
          );
        }),
        h("p", { className: "smallcaps", style: { marginTop: 28 } }, "Running total · " + sum)
      )
    );
  }

  function Phase3Time(props) {
    var Nav = window.AweUI.Nav, Reveal = window.AweUI.Reveal;
    var buckets = window.AweData.TIME_BUCKETS;
    var domains = window.AweData.DOMAINS;
    var _s = useState("pass1"), screen = _s[0], setScreen = _s[1];

    var timeNow = props.data.timeNow || {};
    var timeWant = props.data.timeWant || {};

    function setNow(k, v) { props.merge({ timeNow: Object.assign({}, timeNow, mapVal(k, v)) }); }
    function setWant(k, v) { props.merge({ timeWant: Object.assign({}, timeWant, mapVal(k, v)) }); }
    function mapVal(k, v) { var o = {}; o[k] = v; return o; }

    function goto(s) { window.scrollTo(0, 0); setScreen(s); }

    // ---- Pass 1 ----
    if (screen === "pass1") {
      return h(React.Fragment, null,
        h(Pass, {
          headline: "Where does a typical week actually go?",
          instruction: "Rough percentages are fine — go with your gut, not your calendar.",
          values: timeNow, onChange: setNow
        }),
        h(Nav, {
          onBack: props.back,
          onContinue: function () { goto("pass2"); },
          continueDisabled: total(timeNow) < 60,
          continueLabel: "Continue"
        })
      );
    }

    // ---- Pass 2 ----
    if (screen === "pass2") {
      return h(React.Fragment, null,
        h(Pass, {
          headline: "And if the week were yours to design?",
          instruction: "Same buckets. Where would the time go? Don’t be reasonable — be honest.",
          values: timeWant, onChange: setWant
        }),
        h(Nav, {
          onBack: function () { goto("pass1"); },
          onContinue: function () { goto("reveal"); },
          continueDisabled: total(timeWant) < 60,
          continueLabel: "See the gap"
        })
      );
    }

    // ---- Gap reveal ----
    var gaps = window.AweAI.computeGaps(props.data); // sorted by |gap| desc
    var byKey = {}; gaps.forEach(function (g) { byKey[g.key] = g; });
    var emphKeys = gaps.slice(0, 2).map(function (g) { return g.key; });
    var maxVal = Math.max.apply(null, gaps.map(function (g) { return Math.max(g.actual, g.wanted); }).concat([1]));

    // Dynamic connection line from lowest wheel domain -> mapped bucket in top gaps.
    var connection = buildConnection(props.data, byKey, emphKeys, domains);

    var bars = buckets.map(function (b) {
      var g = byKey[b.key] || { actual: 0, wanted: 0 };
      var emph = emphKeys.indexOf(b.key) !== -1;
      return h("div", { className: "bar-row" + (emph ? " emph" : ""), key: b.key },
        h("div", { className: "bar-label" },
          h("span", null, b.name),
          h("span", null, "have " + g.actual + "% · want " + g.wanted + "%")),
        h("div", { className: "bar-track" },
          h("div", { className: "bar actual", style: { width: (g.actual / maxVal * 100) + "%" } })),
        h("div", { className: "bar-track" },
          h("div", { className: "bar wanted", style: { width: (g.wanted / maxVal * 100) + "%" } }))
      );
    });

    return h(React.Fragment, null,
      h("div", { className: "stage" },
        h("div", { className: "stage-inner" },
          h(Reveal, null,
            h("p", { className: "smallcaps", style: { marginBottom: 24 } }, "Actual · Wanted"),
            h("div", { style: { marginBottom: 44 } }, bars),
            h("h2", { className: "headline", style: { fontSize: "clamp(24px, 3.2vw, 34px)", marginBottom: 16 } },
              "Time is the one asset you can’t earn back."),
            h("p", { className: "body-copy", style: { marginBottom: 18 } },
              "The gap you’re looking at is the distance between the week you have and the week you’d choose."),
            h("p", { className: "emph-italic", style: { fontSize: 20, lineHeight: 1.5 } }, connection)
          )
        )
      ),
      h(Nav, {
        onBack: function () { goto("pass2"); },
        onContinue: props.next,
        continueLabel: "Continue"
      })
    );
  }

  function buildConnection(data, byKey, emphKeys, domains) {
    var wheel = data.wheel || {};
    // lowest-scored wheel domain
    var scored = domains
      .filter(function (d) { return typeof (wheel[d.key] || {}).score === "number"; })
      .map(function (d) { return { key: d.key, name: d.name, score: wheel[d.key].score }; })
      .sort(function (a, b) { return a.score - b.score; });
    var fallback = "Look at your biggest gap. It usually points at the same place your wheel does.";
    if (!scored.length) return fallback;

    var map = window.AweData.DOMAIN_BUCKET_MAP;
    var buckets = window.AweData.TIME_BUCKETS;
    function bucketName(key) {
      var b = buckets.filter(function (x) { return x.key === key; })[0];
      return b ? b.name.toLowerCase() : key;
    }
    // Find the lowest domain that maps to a bucket among the top gaps.
    for (var i = 0; i < scored.length; i++) {
      var mapped = map[scored[i].key];
      if (!mapped) continue;
      for (var j = 0; j < mapped.length; j++) {
        if (emphKeys.indexOf(mapped[j]) !== -1) {
          return "You rated " + scored[i].name + " lowest on your wheel — and “" +
            bucketName(mapped[j]) + "” is one of your biggest gaps. Those two facts are related.";
        }
      }
    }
    return fallback;
  }

  window.Phase3Time = Phase3Time;
})();
