/* The Awe Finder — app shell.
   State machine across seven phases, localStorage save-and-return, the top
   progress line, the returning-user prompt, and shared UI (window.AweUI)
   that every phase consumes. Mounts to #root. */
(function () {
  "use strict";
  var useState = React.useState, useEffect = React.useEffect, useRef = React.useRef, h = React.createElement;
  var KEY = window.AweData.STORAGE_KEY;

  // ------------------------------------------------------------------
  // Shared UI, published for the phase components.
  // ------------------------------------------------------------------

  function Nav(props) {
    return h("nav", { className: "nav print-hide" },
      props.hideBack
        ? h("span", { className: "nav-spacer" })
        : h("button", { className: "btn-ghost", onClick: props.onBack }, props.backLabel || "Back"),
      h("span", { className: "nav-spacer" }),
      props.onContinue
        ? h("button", {
            className: "btn",
            onClick: props.onContinue,
            disabled: !!props.continueDisabled
          }, props.continueLabel || "Continue")
        : null
    );
  }

  // Range slider whose gold fill fraction is driven by --fill.
  function Slider(props) {
    var min = props.min != null ? props.min : 0;
    var max = props.max != null ? props.max : 10;
    var val = props.value != null ? props.value : min;
    var frac = ((val - min) / (max - min)) * 100;
    return h("input", {
      type: "range",
      className: "slider" + (props.unset ? " unset" : ""),
      min: min, max: max, step: props.step || 1,
      value: val,
      "aria-label": props.ariaLabel,
      style: { "--fill": frac + "%" },
      onChange: function (e) { props.onChange(Number(e.target.value)); }
    });
  }

  // A block that fades+rises in, with an optional stagger delay (ms).
  function Reveal(props) {
    return h("div", {
      className: "reveal " + (props.className || ""),
      style: Object.assign({ animationDelay: (props.delay || 0) + "ms" }, props.style || {})
    }, props.children);
  }

  window.AweUI = { Nav: Nav, Slider: Slider, Reveal: Reveal, h: h };

  // ------------------------------------------------------------------
  // State
  // ------------------------------------------------------------------

  var PHASES = ["primer", "identity", "wheel", "time", "reframe", "roadmap", "artifact"];

  function freshData() {
    return {
      phase: "primer",
      identity: [],
      wheel: {},        // key -> { score, why }
      timeNow: {},      // bucketKey -> 0..60
      timeWant: {},
      reframe: { situation: "", story: "", alsoTrue: "" },
      focusDomain: null,
      practiceKey: null,
      practiceCustom: "",
      practiceLabel: "",
      practiceDesc: "",
      keptReframe: ""
    };
  }

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      return Object.assign(freshData(), parsed);
    } catch (e) { return null; }
  }

  function save(data) {
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) {}
  }

  function hasProgress(data) {
    if (!data) return false;
    if (data.phase && data.phase !== "primer") return true;
    if ((data.identity || []).length > 0) return true;
    return false;
  }

  // ------------------------------------------------------------------
  // App
  // ------------------------------------------------------------------

  function App() {
    var _saved = useRef(load());
    var _d = useState(function () { return _saved.current || freshData(); });
    var data = _d[0], setData = _d[1];
    var _wb = useState(function () { return hasProgress(_saved.current); });
    var showWelcomeBack = _wb[0], setShowWelcomeBack = _wb[1];

    // Persist on every change.
    useEffect(function () { save(data); }, [data]);

    function merge(partial) {
      setData(function (d) { return Object.assign({}, d, partial); });
    }
    function goTo(phase) {
      window.scrollTo(0, 0);
      merge({ phase: phase });
    }
    function next() {
      var i = PHASES.indexOf(data.phase);
      if (i < PHASES.length - 1) goTo(PHASES[i + 1]);
    }
    function back() {
      var i = PHASES.indexOf(data.phase);
      if (i > 0) goTo(PHASES[i - 1]);
    }

    function startOver() {
      if (window.confirm("Start over? This clears your saved answers on this device.")) {
        try { localStorage.removeItem(KEY); } catch (e) {}
        setData(freshData());
        setShowWelcomeBack(false);
        window.scrollTo(0, 0);
      }
    }

    // Progress line: fraction of phases advanced.
    var idx = Math.max(0, PHASES.indexOf(data.phase));
    var progress = idx / (PHASES.length - 1);

    if (showWelcomeBack) {
      return h(WelcomeBack, {
        onContinue: function () { setShowWelcomeBack(false); },
        onStartOver: startOver
      });
    }

    var phaseProps = {
      data: data,
      merge: merge,
      next: next,
      back: back,
      startOver: startOver
    };

    var current;
    switch (data.phase) {
      case "identity": current = h(window.Phase1Identity, phaseProps); break;
      case "wheel":    current = h(window.Phase2Wheel, phaseProps); break;
      case "time":     current = h(window.Phase3Time, phaseProps); break;
      case "reframe":  current = h(window.Phase4Reframe, phaseProps); break;
      case "roadmap":  current = h(window.Phase5Roadmap, phaseProps); break;
      case "artifact": current = h(window.Phase6Artifact, phaseProps); break;
      default:         current = h(window.Phase0Primer, phaseProps); break;
    }

    return h(React.Fragment, null,
      h("div", { className: "progress-line", style: { width: (progress * 100) + "%" } }),
      current
    );
  }

  function WelcomeBack(props) {
    return h("div", { className: "welcome-back" },
      h(Reveal, null,
        h("p", { className: "eyebrow", style: { marginBottom: 20 } }, "THE AWE FINDER"),
        h("p", { className: "headline italic", style: { marginBottom: 8 } }, "Welcome back."),
        h("p", { className: "body-copy", style: { margin: "0 auto 34px" } }, "Pick up where you left off?"),
        h("div", { style: { display: "flex", gap: 16, justifyContent: "center", alignItems: "center", flexWrap: "wrap" } },
          h("button", { className: "btn", onClick: props.onContinue }, "Continue"),
          h("button", { className: "btn-ghost", onClick: props.onStartOver }, "Start over")
        )
      )
    );
  }

  var root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(h(App));
})();
