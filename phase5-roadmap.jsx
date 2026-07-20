/* Phase 5 — The roadmap. One area, one tiny practice, one reframe.
   Lowest wheel domain pre-selected; practices suggested for that domain but
   all shown; the reframe carried forward and editable; one humanity-layer line. */
(function () {
  "use strict";
  var useEffect = React.useEffect, h = React.createElement;

  function lowestDomainKey(wheel, domains) {
    var scored = domains
      .filter(function (d) { return typeof (wheel[d.key] || {}).score === "number"; })
      .map(function (d) { return { key: d.key, score: wheel[d.key].score }; })
      .sort(function (a, b) { return a.score - b.score; });
    return scored.length ? scored[0].key : domains[0].key;
  }
  function domainName(key) {
    var d = window.AweData.DOMAINS.filter(function (x) { return x.key === key; })[0];
    return d ? d.name : key;
  }

  function Phase5Roadmap(props) {
    var Nav = window.AweUI.Nav, Reveal = window.AweUI.Reveal;
    var domains = window.AweData.DOMAINS;
    var practices = window.AweData.PRACTICES;
    var data = props.data;
    var wheel = data.wheel || {};
    var lowest = lowestDomainKey(wheel, domains);

    // Seed defaults once.
    useEffect(function () {
      var patch = {};
      if (!data.focusDomain) patch.focusDomain = lowest;
      if (!data.keptReframe && data.reframe && data.reframe.alsoTrue) patch.keptReframe = data.reframe.alsoTrue;
      if (Object.keys(patch).length) props.merge(patch);
      // eslint-disable-next-line
    }, []);

    var focus = data.focusDomain || lowest;
    var suggested = window.AweData.DOMAIN_PRACTICES[focus] || [];

    function pickDomain(key) { props.merge({ focusDomain: key }); }

    function pickPractice(p) {
      if (p.key === "custom") {
        props.merge({ practiceKey: "custom", practiceLabel: data.practiceCustom || "", practiceDesc: "" });
      } else {
        props.merge({ practiceKey: p.key, practiceLabel: p.title, practiceDesc: p.desc });
      }
    }
    function setCustom(v) {
      props.merge({ practiceCustom: v, practiceLabel: v, practiceDesc: "", practiceKey: "custom" });
    }

    var practiceReady = data.practiceKey && (data.practiceKey !== "custom" || (data.practiceCustom || "").trim());
    var canContinue = !!focus && !!practiceReady;

    // Step 1 — area cards
    var domainCards = domains.map(function (d) {
      var sel = focus === d.key;
      return h("button", {
        key: d.key, className: "card" + (sel ? " selected" : ""),
        "aria-pressed": sel, onClick: function () { pickDomain(d.key); },
        style: { marginBottom: 10 }
      },
        h("span", { className: "card-title", style: { fontSize: 21 } }, d.name),
        h("span", { className: "card-desc" }, d.clarifier));
    });

    // Step 2 — practice cards
    var practiceCards = practices.map(function (p) {
      var sel = data.practiceKey === p.key;
      var fit = suggested.indexOf(p.key) !== -1;
      return h("div", { key: p.key, style: { marginBottom: 10 } },
        h("button", {
          className: "card" + (sel ? " selected" : ""),
          "aria-pressed": sel, onClick: function () { pickPractice(p); }
        },
          fit ? h("span", { className: "card-tag" }, "Good fit") : null,
          h("span", { className: "card-title" }, p.title),
          h("span", { className: "card-desc" }, p.desc)),
        (p.key === "custom" && sel) ? h("input", {
          className: "field", type: "text",
          style: { fontSize: 20, marginTop: 12 },
          value: data.practiceCustom || "",
          placeholder: "One small action, with a frequency.",
          "aria-label": "Your own practice",
          onChange: function (e) { setCustom(e.target.value); }
        }) : null
      );
    });

    var humanity = window.AweData.HUMANITY_LAYER[focus];
    var kept = data.keptReframe != null ? data.keptReframe : (data.reframe && data.reframe.alsoTrue) || "";

    return h(React.Fragment, null,
      h("div", { className: "stage" },
        h("div", { className: "stage-inner" },
          h(Reveal, null,
            h("h1", { className: "headline", style: { marginBottom: 12 } },
              "One area. One tiny practice. One reframe. That’s the whole plan.")),

          // Step 1
          h(Reveal, { delay: 100, className: "block", style: { marginTop: 64 } },
            h("p", { className: "smallcaps", style: { marginBottom: 12 } }, "Step one · Pick your area"),
            h("p", { className: "field-help", style: { marginBottom: 20 } },
              "We’ve pre-selected " + domainName(lowest) + " — your lowest score. Change it if your gut disagrees. One is enough."),
            domainCards),

          // Step 2
          h("div", { className: "block" },
            h("p", { className: "smallcaps", style: { marginBottom: 12 } }, "Step two · Pick one tiny practice"),
            h("p", { className: "field-help", style: { marginBottom: 20 } },
              "Pick the one you’d actually do this week. Small is the point."),
            practiceCards),

          // Step 3
          h("div", { className: "block" },
            h("p", { className: "smallcaps", style: { marginBottom: 12 } }, "Step three · Your reframe"),
            h("p", { className: "field-help", style: { marginBottom: 14 } },
              "The reframe you’ll carry. Edit it down to the line you want to keep."),
            h("textarea", {
              className: "boxed rose", style: { minHeight: 110 },
              value: kept,
              "aria-label": "The reframe you'll carry",
              onChange: function (e) { props.merge({ keptReframe: e.target.value }); }
            })),

          // Humanity layer + closing
          humanity ? h("p", { className: "emph-italic", style: { fontSize: 22, lineHeight: 1.5, marginTop: 40, maxWidth: "56ch" } }, humanity) : null,
          h("p", { className: "headline", style: { fontSize: "clamp(22px, 3vw, 30px)", marginTop: 40 } },
            "You can have it all — just not all at the same time. This is a direction, not a decathlon.")
        )
      ),
      h(Nav, {
        onBack: props.back,
        onContinue: props.next,
        continueDisabled: !canContinue,
        continueLabel: "See my page"
      })
    );
  }

  window.Phase5Roadmap = Phase5Roadmap;
})();
