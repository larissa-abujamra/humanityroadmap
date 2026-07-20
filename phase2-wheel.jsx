/* Phase 2 — The Wheel of Life. Nine sliders + the live radar (signature
   element), then a quiet reveal of the completed wheel and the two lowest areas. */
(function () {
  "use strict";
  var useState = React.useState, h = React.createElement;

  function lowestTwo(wheel, domains) {
    var scored = domains
      .filter(function (d) { return typeof (wheel[d.key] || {}).score === "number"; })
      .map(function (d) { return { name: d.name, key: d.key, score: wheel[d.key].score }; })
      .sort(function (a, b) { return a.score - b.score; });
    return scored.slice(0, 2);
  }

  function Phase2Wheel(props) {
    var Nav = window.AweUI.Nav, Slider = window.AweUI.Slider, Reveal = window.AweUI.Reveal;
    var domains = window.AweData.DOMAINS;
    var wheel = props.data.wheel || {};
    var _s = useState("rate"), screen = _s[0], setScreen = _s[1];

    function values() {
      var v = {};
      domains.forEach(function (d) {
        var r = wheel[d.key];
        v[d.key] = r && typeof r.score === "number" ? r.score : null;
      });
      return v;
    }

    function setScore(key, score) {
      var next = Object.assign({}, wheel);
      next[key] = Object.assign({}, next[key], { score: score });
      props.merge({ wheel: next });
    }
    function setWhy(key, why) {
      var next = Object.assign({}, wheel);
      next[key] = Object.assign({ score: null }, next[key], { why: why });
      props.merge({ wheel: next });
    }

    var allSet = domains.every(function (d) {
      return typeof (wheel[d.key] || {}).score === "number";
    });

    // ---- Reveal screen ----
    if (screen === "reveal") {
      var low = lowestTwo(wheel, domains);
      var lowLine = low.length === 2
        ? "Your lowest areas right now: " + low[0].name + " and " + low[1].name + ". That’s not a verdict — it’s a map. We’ll come back to them."
        : "That’s not a verdict — it’s a map. We’ll come back to it.";
      return h(React.Fragment, null,
        h("div", { className: "stage" },
          h("div", { className: "stage-inner" },
            h(Reveal, null,
              h("h1", { className: "headline", style: { textAlign: "center", marginBottom: 28 } }, "Here’s your wheel."),
              h(window.WheelChart, { values: values(), size: 460 }),
              h("p", { className: "body-copy", style: { margin: "34px auto 0", textAlign: "center" } }, lowLine)
            )
          )
        ),
        h(Nav, {
          onBack: function () { setScreen("rate"); },
          onContinue: props.next,
          continueLabel: "Continue"
        })
      );
    }

    // ---- Rating screen ----
    var rows = domains.map(function (d) {
      var r = wheel[d.key] || {};
      var isSet = typeof r.score === "number";
      return h("div", { className: "domain-row", key: d.key },
        h("div", { className: "domain-head" },
          h("span", { className: "domain-name" }, d.name),
          h("span", { className: "domain-value" + (isSet ? "" : " unset") }, isSet ? r.score : "—")
        ),
        h("p", { className: "domain-clar" }, d.clarifier),
        h(Slider, {
          value: isSet ? r.score : 5,
          min: 0, max: 10,
          unset: !isSet,
          ariaLabel: d.name + " satisfaction, 0 to 10",
          onChange: function (v) { setScore(d.key, v); }
        }),
        h("input", {
          className: "field",
          type: "text",
          style: { fontSize: 18, marginTop: 6 },
          value: r.why || "",
          placeholder: "One line: why that number?",
          "aria-label": d.name + " — why that number (optional)",
          onChange: function (e) { setWhy(d.key, e.target.value); }
        })
      );
    });

    return h(React.Fragment, null,
      h("div", { className: "stage" },
        h("div", { className: "stage-inner wide" },
          h("p", { className: "body-copy ink", style: { fontSize: 19, marginBottom: 48, maxWidth: "56ch" } },
            "Rate your satisfaction with each area of your life right now, 0 to 10. Not where you think you should be — where you actually are."),
          h("div", { className: "wheel-layout" },
            h("div", null, rows),
            h("div", { className: "wheel-sticky wheel-chart-col" },
              h(window.WheelChart, { values: values(), size: 440 }))
          )
        )
      ),
      h(Nav, {
        onBack: props.back,
        onContinue: function () { window.scrollTo(0, 0); setScreen("reveal"); },
        continueDisabled: !allSet,
        continueLabel: "See my wheel"
      })
    );
  }

  window.Phase2Wheel = Phase2Wheel;
})();
