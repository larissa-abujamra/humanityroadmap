/* Phase 6 — The artifact. A single print-optimized page revealed top to bottom.
   The AI reflection is generated in parallel with the reveal and never blocks;
   ai.js races a 15s timeout and falls back to a deterministic reflection. */
(function () {
  "use strict";
  var useState = React.useState, useEffect = React.useEffect, useRef = React.useRef, h = React.createElement;

  function todayLong() {
    try {
      return new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    } catch (e) {
      return "";
    }
  }
  function trimEndPunct(s) { return (s || "").replace(/[.!?\s]+$/, ""); }

  function Phase6Artifact(props) {
    var Reveal = window.AweUI.Reveal;
    var data = props.data;
    var domains = window.AweData.DOMAINS;

    var _r = useState(null), reflection = _r[0], setReflection = _r[1];
    var kicked = useRef(false);

    // Kick off generation once, in parallel with the reveal.
    useEffect(function () {
      if (kicked.current) return;
      kicked.current = true;
      var alive = true;
      window.AweAI.generateReflection(data).then(function (r) {
        if (alive) setReflection(r);
      });
      return function () { alive = false; };
      // eslint-disable-next-line
    }, []);

    var focusKey = data.focusDomain;
    var focusName = (domains.filter(function (d) { return d.key === focusKey; })[0] || {}).name || "";
    var humanity = window.AweData.HUMANITY_LAYER[focusKey] || "";
    var kept = data.keptReframe != null && data.keptReframe.trim()
      ? data.keptReframe : (data.reframe && data.reframe.alsoTrue) || "";
    var iamLine = (data.identity || []).join("  ·  ");

    function wheelValues() {
      var v = {};
      domains.forEach(function (d) {
        var s = (data.wheel[d.key] || {}).score;
        v[d.key] = typeof s === "number" ? s : null;
      });
      return v;
    }

    return h(React.Fragment, null,
      h("div", { className: "stage" },
        h("div", { className: "artifact" },

          h(Reveal, { delay: 0 },
            h("p", { className: "smallcaps", style: { textAlign: "center", marginBottom: 40 } },
              "THE AWE FINDER · " + todayLong())),

          h(Reveal, { delay: 200, className: "block", style: { marginBottom: 56 } },
            h("p", { className: "artifact-iam" }, iamLine)),

          h(Reveal, { delay: 400 },
            h(window.WheelChart, { values: wheelValues(), size: 380, focusKey: focusKey })),

          h(Reveal, { delay: 650, className: "block", style: { marginTop: 48, textAlign: "center" } },
            h("p", { className: "smallcaps", style: { marginBottom: 14 } }, "This season I’m tending"),
            h("p", { className: "artifact-focus-name", style: { marginBottom: 16 } }, focusName),
            humanity ? h("p", { className: "emph-italic", style: { fontSize: 20, lineHeight: 1.5, maxWidth: "48ch", margin: "0 auto 20px" } }, humanity) : null,
            h("p", { className: "body-copy ink", style: { margin: "0 auto", maxWidth: "48ch" } },
              h("strong", { style: { fontWeight: 500 } }, data.practiceLabel || ""),
              data.practiceDesc ? h("span", null, " — " + data.practiceDesc) : null)
          ),

          kept ? h(Reveal, { delay: 850, className: "block", style: { marginTop: 12 } },
            h("p", { className: "pullquote" }, "What’s also true: " + trimEndPunct(kept) + ".")) : null,

          h(Reveal, { delay: 1050, className: "block", style: { textAlign: "center" } },
            reflection
              ? h(React.Fragment, null,
                  h("p", { className: "reflection-text" }, reflection.text),
                  reflection.offline ? h("p", { className: "offline-mark" }, "offline reflection") : null)
              : h("p", { className: "reflection-text" }, h("span", { className: "shimmer" }, "· · ·"))
          ),

          h(Reveal, { delay: 1200 },
            h("p", { className: "smallcaps", style: { textAlign: "center", marginTop: 56 } }, "Be honest, not impressive"))
        )
      ),

      // Screen-only controls
      h("div", { className: "nav print-hide" },
        h("button", { className: "btn-ghost", onClick: props.startOver }, "Start over"),
        h("span", { className: "nav-spacer" }),
        h("button", { className: "btn", onClick: function () { window.print(); } }, "Print my page"))
    );
  }

  window.Phase6Artifact = Phase6Artifact;
})();
