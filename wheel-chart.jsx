/* The Awe Finder — Wheel of Life radar (the signature element).
   Fine gold strokes on paper: hairline rings, thin spokes, small-caps rim
   labels, and the user's shape as a gold stroke with a translucent blush fill.
   Gilded thread on paper, not a dashboard. Reused at two scales. */
(function () {
  "use strict";
  var useState = React.useState, useEffect = React.useEffect, useRef = React.useRef;

  var prefersReduced = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

  // Tween the drawn values toward the real ratings so each spoke fills (~600ms).
  function useAnimatedValues(targets, keys) {
    var initial = {};
    keys.forEach(function (k) { initial[k] = targets[k] || 0; });
    var ref = useRef(false);
    var _s = useState(initial), disp = _s[0], setDisp = _s[1];
    var raf = useRef(null);

    useEffect(function () {
      if (!ref.current) { ref.current = true; setDisp(readTargets()); return; }
      if (prefersReduced) { setDisp(readTargets()); return; }

      var from = {}; keys.forEach(function (k) { from[k] = (disp[k] || 0); });
      var to = readTargets();
      var start = performance.now();
      var dur = 600;

      function frame(now) {
        var t = Math.min(1, (now - start) / dur);
        var e = 1 - Math.pow(1 - t, 3); // ease-out cubic
        var next = {};
        keys.forEach(function (k) { next[k] = from[k] + (to[k] - from[k]) * e; });
        setDisp(next);
        if (t < 1) raf.current = requestAnimationFrame(frame);
      }
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(frame);
      return function () { cancelAnimationFrame(raf.current); };

      function readTargets() {
        var o = {}; keys.forEach(function (k) { o[k] = targets[k] || 0; }); return o;
      }
      // eslint-disable-next-line
    }, [keys.map(function (k) { return targets[k]; }).join(",")]);

    return disp;
  }

  // values: { domainKey: score 0..10 | null }.  focusKey: highlight one rim label in rose.
  function WheelChart(props) {
    var domains = window.AweData.DOMAINS;
    var keys = domains.map(function (d) { return d.key; });
    var size = props.size || 520;
    var values = props.values || {};

    var numeric = {};
    keys.forEach(function (k) {
      numeric[k] = typeof values[k] === "number" ? values[k] : 0;
    });
    var disp = useAnimatedValues(numeric, keys);

    // Geometry in a padded viewBox so rim labels never clip. Padding, label
    // radius and font all scale with size so the wheel looks right at 520 and 380.
    var box = size;
    var pad = size * 0.21;
    var cx = box / 2, cy = box / 2;
    var maxR = box / 2 - pad;
    var labelR = maxR + size * 0.03;
    var labelFont = size * 0.02;
    var lineH = labelFont * 1.15;
    var rings = [0.25, 0.5, 0.75, 1];

    // Split a domain name into at most two balanced lines so wide labels fit.
    function wrap(name) {
      var words = name.split(" ");
      if (words.length < 2) return [name];
      var mid = Math.ceil(words.length / 2);
      return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
    }

    function angleFor(i) { return (-90 + i * (360 / keys.length)) * (Math.PI / 180); }
    function point(i, frac) {
      var a = angleFor(i);
      return [cx + Math.cos(a) * maxR * frac, cy + Math.sin(a) * maxR * frac];
    }

    // User shape polygon from displayed (animated) values.
    var shapePts = keys.map(function (k, i) {
      var p = point(i, (disp[k] || 0) / 10);
      return p[0].toFixed(1) + "," + p[1].toFixed(1);
    }).join(" ");

    var anyRating = keys.some(function (k) { return typeof values[k] === "number"; });

    return (
      React.createElement("div", { className: "wheel-wrap" },
        React.createElement("div", { className: "wheel", style: { width: "100%", maxWidth: size } },
          React.createElement("svg", {
            viewBox: "0 0 " + box + " " + box,
            role: "img",
            "aria-label": "Wheel of Life radar chart across nine areas"
          },
            // concentric rings
            rings.map(function (r, ri) {
              var pts = keys.map(function (k, i) {
                var p = point(i, r);
                return p[0].toFixed(1) + "," + p[1].toFixed(1);
              }).join(" ");
              return React.createElement("polygon", { key: "ring" + ri, className: "wheel-ring", points: pts });
            }),
            // spokes
            keys.map(function (k, i) {
              var p = point(i, 1);
              return React.createElement("line", {
                key: "spoke" + i, className: "wheel-spoke",
                x1: cx, y1: cy, x2: p[0], y2: p[1]
              });
            }),
            // user shape (only once at least one rating exists)
            anyRating && React.createElement("polygon", { className: "wheel-shape", points: shapePts }),
            anyRating && keys.map(function (k, i) {
              if (typeof values[k] !== "number") return null;
              var p = point(i, (disp[k] || 0) / 10);
              return React.createElement("circle", {
                key: "dot" + i, className: "wheel-dot",
                cx: p[0], cy: p[1], r: 2.4
              });
            }),
            // rim labels (wrapped to <= 2 lines, vertically centered on the axis)
            keys.map(function (k, i) {
              var a = angleFor(i);
              var lx = cx + Math.cos(a) * labelR;
              var ly = cy + Math.sin(a) * labelR;
              var cos = Math.cos(a);
              var anchor = Math.abs(cos) < 0.3 ? "middle" : (cos > 0 ? "start" : "end");
              var isFocus = props.focusKey === k;
              var lines = wrap(domains[i].name);
              var y0 = ly - (lines.length - 1) * lineH / 2;
              return React.createElement("text", {
                key: "lbl" + i,
                x: lx.toFixed(1), y: y0.toFixed(1),
                className: "wheel-axis-label" + (isFocus ? " focus" : ""),
                style: { fontSize: labelFont.toFixed(1) + "px" },
                textAnchor: anchor,
                dominantBaseline: "middle"
              }, lines.map(function (ln, li) {
                return React.createElement("tspan", {
                  key: li, x: lx.toFixed(1), dy: li === 0 ? 0 : lineH.toFixed(1)
                }, ln);
              }));
            })
          )
        )
      )
    );
  }

  window.WheelChart = WheelChart;
})();
