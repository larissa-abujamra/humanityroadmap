/* Phase 0 — Primer. Two short screens: Welcome, then Why this works. */
(function () {
  "use strict";
  var useState = React.useState, h = React.createElement;

  function Phase0Primer(props) {
    var _s = useState("a"), screen = _s[0], setScreen = _s[1];
    var Nav = window.AweUI.Nav, Reveal = window.AweUI.Reveal;

    if (screen === "a") {
      return h(React.Fragment, null,
        h("div", { className: "stage" },
          h("div", { className: "stage-inner" },
            h(Reveal, null,
              h("p", { className: "eyebrow", style: { marginBottom: 28 } }, "THE AWE FINDER"),
              h("h1", { className: "headline italic", style: { marginBottom: 32 } },
                "See how you’re living. Decide what you want more of. Leave with one small, real change."),
              h("p", { className: "body-copy", style: { fontSize: 18 } },
                "A guided reflection in five short parts. It takes about 30 minutes. Your answers save automatically, so you can leave and come back — and no one sees them but you.")
            )
          )
        ),
        h(Nav, { hideBack: true, onContinue: function () { setScreen("b"); }, continueLabel: "Begin" })
      );
    }

    var blocks = [
      "Machines can now write, plan, and produce faster than any of us. What they can’t do is live your life. The qualities that make a life feel good — attention, connection, wonder — aren’t traits you have or don’t. They’re practices. They get stronger when you use them.",
      "One of them is awe. In studies, people who regularly recall beautiful moments — not just happy ones — show richer perception, better memory, and more mindfulness. Awe works like a muscle: the more you look for it, the more you find.",
      "Here’s what’s ahead: a quick exercise about who you are, a satisfaction check across nine areas of your life, a look at where your time actually goes, one reframe, and one commitment. At the end, you’ll get a one-page summary to print and keep."
    ];

    return h(React.Fragment, null,
      h("div", { className: "stage" },
        h("div", { className: "stage-inner" },
          h("div", { className: "stack-lg" },
            blocks.map(function (b, i) {
              return h(Reveal, { key: i, delay: i * 220 },
                h("p", { className: "emph-italic", style: { fontSize: 21, lineHeight: 1.5 } }, b));
            }),
            h(Reveal, { delay: blocks.length * 220 },
              h("p", { className: "headline", style: { fontSize: "clamp(22px, 3vw, 30px)", marginTop: 12 } },
                "One ask before you start: be honest, not impressive."))
          )
        )
      ),
      h(Nav, {
        onBack: function () { setScreen("a"); },
        onContinue: props.next,
        continueLabel: "I’m ready"
      })
    );
  }

  window.Phase0Primer = Phase0Primer;
})();
