/* Phase 1 — Who are you? Identity, not résumé.
   "I am ___" statements committed to a deletable list, a soft 60s timer,
   and a non-blocking role-word nudge. Continue after 3+ entries. */
(function () {
  "use strict";
  var useState = React.useState, useRef = React.useRef, h = React.createElement;

  var EXAMPLE = "I am curious · I am someone who laughs at the wrong moments · I am a good listener · I am tired lately · I am still figuring it out";

  function hasRoleWord(text) {
    var t = " " + text.toLowerCase() + " ";
    return window.AweData.ROLE_WORDS.some(function (w) {
      return new RegExp("\\b" + w + "\\b").test(t);
    });
  }

  function Phase1Identity(props) {
    var Nav = window.AweUI.Nav, Reveal = window.AweUI.Reveal;
    var entries = props.data.identity || [];
    var _t = useState(""), text = _t[0], setText = _t[1];
    var _r = useState(false), running = _r[0], setRunning = _r[1];
    var _d = useState(false), timerDone = _d[0], setTimerDone = _d[1];
    var started = useRef(false);
    var inputRef = useRef(null);

    function startTimer() {
      if (started.current) return;
      started.current = true;
      setRunning(true);
      setTimeout(function () { setTimerDone(true); }, 60000);
    }

    function onType(v) {
      setText(v);
      if (v && !started.current) startTimer();
    }

    function commit() {
      var body = text.trim();
      if (!body) return;
      var entry = "I am " + body;
      props.merge({ identity: entries.concat([entry]) });
      setText("");
      if (inputRef.current) inputRef.current.focus();
    }

    function removeAt(i) {
      props.merge({ identity: entries.filter(function (_, j) { return j !== i; }) });
    }

    function onKeyDown(e) {
      if (e.key === "Enter") { e.preventDefault(); commit(); }
    }

    var showNudge = hasRoleWord(text);
    var canContinue = entries.length >= 3;

    return h(React.Fragment, null,
      h("div", { className: "stage" },
        h("div", { className: "stage-inner" },
          h(Reveal, null,
            h("h1", { className: "headline", style: { marginBottom: 20 } }, "Who are you?"),
            h("p", { className: "field-help", style: { fontSize: 16, marginBottom: 22 } },
              "Answer in short “I am ___” statements. Add as many as come to mind — aim for at least five. One rule: no jobs, titles, or family roles. Not what you do. Who you are."),
            h("p", { className: "example-row", style: { marginBottom: 34 } }, EXAMPLE)
          ),

          // Committed entries
          entries.length > 0 && h("div", { className: "chip-list", style: { marginBottom: 30 } },
            entries.map(function (e, i) {
              return h("div", { className: "chip", key: i },
                h("span", null, e),
                h("button", {
                  className: "chip-remove",
                  onClick: function () { removeAt(i); },
                  "aria-label": "Remove " + e
                }, "remove"));
            })
          ),

          // Input with fixed prefix
          h("div", { className: "prefix-input" },
            h("span", { className: "prefix", "aria-hidden": "true" }, "I am"),
            h("input", {
              ref: inputRef,
              className: "field",
              type: "text",
              value: text,
              placeholder: "curious",
              "aria-label": "I am…",
              onChange: function (e) { onType(e.target.value); },
              onKeyDown: onKeyDown
            }),
            h("button", { className: "btn-ghost", onClick: commit, style: { flex: "none" } }, "Add")
          ),
          showNudge && h("p", { className: "field-hint" }, "That’s what you do. Try who you are."),

          // Soft timer
          h("div", { style: { marginTop: 30, display: "flex", alignItems: "center", gap: 14 } },
            h("div", { className: "soft-timer" + (running ? " run" : "") },
              h("div", { className: "fill" })),
            timerDone && h("span", { className: "field-help", style: { fontStyle: "italic", fontSize: 13 } },
              "Time’s soft. Keep going as long as you like.")
          ),

          h("p", { className: "smallcaps", style: { marginTop: 24 } },
            entries.length + (entries.length === 1 ? " statement" : " statements"))
        )
      ),
      h(Nav, {
        onBack: props.back,
        onContinue: props.next,
        continueDisabled: !canContinue,
        continueLabel: "Continue"
      })
    );
  }

  window.Phase1Identity = Phase1Identity;
})();
