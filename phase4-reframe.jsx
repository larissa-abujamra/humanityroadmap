/* Phase 4 — The reframe. Same facts, two stories. A worked example in the
   exact two-column layout the user is about to fill, then their turn.
   This is the one screen where the rose accent leads. */
(function () {
  "use strict";
  var h = React.createElement;

  function Phase4Reframe(props) {
    var Nav = window.AweUI.Nav, Reveal = window.AweUI.Reveal;
    var rf = props.data.reframe || { situation: "", story: "", alsoTrue: "" };

    function set(field, value) {
      props.merge({ reframe: Object.assign({}, rf, mk(field, value)) });
    }
    function mk(f, v) { var o = {}; o[f] = v; return o; }

    var canContinue = rf.situation.trim() && rf.story.trim() && rf.alsoTrue.trim();

    return h(React.Fragment, null,
      h("div", { className: "stage" },
        h("div", { className: "stage-inner" },
          h(Reveal, null,
            h("h1", { className: "headline", style: { marginBottom: 20 } }, "Same facts. Two stories."),
            h("p", { className: "body-copy", style: { marginBottom: 44 } },
              "Every hard situation has two layers: what happened, and the story you tell yourself about it. The facts are fixed. The story is yours to write. This isn’t about pretending things are fine — it’s about noticing the other things that are also true.")
          ),

          // Worked example
          h(Reveal, { delay: 120, className: "block" },
            h("p", { className: "smallcaps", style: { marginBottom: 16 } }, "An example"),
            h("div", { className: "example-frame", style: { marginBottom: 24 } },
              h("p", { className: "col-label" }, "The situation"),
              h("p", { className: "example-line" }, "I didn’t get the promotion.")),
            h("div", { className: "two-col" },
              h("div", { className: "example-frame" },
                h("p", { className: "col-label" }, "The story I’m telling myself"),
                h("p", { className: "example-line soft" }, "I’m falling behind. Maybe I’m not as good as I thought.")),
              h("div", { className: "example-frame", style: { borderColor: "var(--blush)" } },
                h("p", { className: "col-label rose" }, "What’s also true"),
                h("p", { className: "example-line" }, "My work was strong enough to be considered. I now know exactly where the gap is. And I get to ask whether I even want that job."))
            )
          ),

          // User's turn
          h(Reveal, { delay: 200 },
            h("div", { className: "block" },
              h("p", { className: "field-help", style: { marginBottom: 10 } },
                "Name one situation that’s weighing on you right now. Just the facts, one sentence."),
              h("input", {
                className: "field", type: "text",
                value: rf.situation,
                placeholder: "e.g., We’re arguing more than we used to.",
                "aria-label": "The situation, one sentence",
                onChange: function (e) { set("situation", e.target.value); }
              })
            ),
            h("div", { className: "two-col" },
              h("div", null,
                h("p", { className: "col-label" }, "The story I’m telling myself"),
                h("p", { className: "field-help", style: { marginBottom: 10 } },
                  "Write it the way it sounds in your head at 2am. Don’t clean it up."),
                h("textarea", {
                  className: "boxed",
                  value: rf.story,
                  "aria-label": "The story I'm telling myself",
                  onChange: function (e) { set("story", e.target.value); }
                })),
              h("div", null,
                h("p", { className: "col-label rose" }, "What’s also true"),
                h("p", { className: "field-help", style: { marginBottom: 10 } },
                  "Facts count. Doors that opened count. What a kind, honest friend would point out counts. Write at least two things."),
                h("textarea", {
                  className: "boxed rose",
                  value: rf.alsoTrue,
                  "aria-label": "What's also true",
                  onChange: function (e) { set("alsoTrue", e.target.value); }
                }))
            )
          )
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

  window.Phase4Reframe = Phase4Reframe;
})();
