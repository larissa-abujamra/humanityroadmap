// Screens 1-2: Welcome, Framing
// Exposes: WelcomeScreen, FramingScreen

const { useState, useEffect, useRef } = React;

function WelcomeScreen({ onBegin }) {
  return (
    <>
      <div className="beam"></div>
      <div className="stage">
        <div className="center-col">
          <div className="smallcaps fade-in" style={{ animationDelay: "200ms", marginBottom: 28 }}>
            The Humanity Roadmap
          </div>
          <h1 className="display fade-up" style={{ fontSize: "clamp(26px, 3.9vw, 46px)", fontStyle: "italic", margin: "0 0 28px", lineHeight: 1.35, animationDelay: "600ms" }}>
            <span style={{ display: "block" }}>The machine cannot do this part.</span>
          </h1>
          
          <div className="fade-up" style={{ animationDelay: "2400ms" }}>
            <button className="btn" onClick={onBegin}>Begin</button>
          </div>
          <div className="fade-up" style={{ animationDelay: "3400ms", marginTop: 64 }}>
            <p className="faint" style={{ fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase" }}>
              Allow yourself ~15 minutes. Or come back when you have it.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

function QualityArc() {
  // Seven names laid along a gentle arc.
  // Use SVG to position along a path.
  const W = 1120;
  const H = 300;
  const yBase = H - 52;
  const yCtrl = 92; // shallower arc → more even horizontal gaps for long labels
  // arc path (a gentle horizon)
  const d = `M 20 ${yBase} Q ${W / 2} ${yCtrl} ${W - 20} ${yBase}`;
  // sample points along the quadratic curve
  const pointAt = (t) => {
    const x0 = 20, y0 = yBase;
    const x1 = W / 2, y1 = yCtrl;
    const x2 = W - 20, y2 = yBase;
    const x = (1-t)*(1-t)*x0 + 2*(1-t)*t*x1 + t*t*x2;
    const y = (1-t)*(1-t)*y0 + 2*(1-t)*t*y1 + t*t*y2;
    return { x, y };
  };
  return (
    <div style={{ width: "100%", maxWidth: 1040, margin: "12px auto 0", position: "relative" }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block", overflow: "visible" }}>
        <defs>
          {window.QUALITIES.map((q) => (
            <radialGradient id={`g-${q.key}`} key={q.key} cx="50%" cy="50%" r="50%">
              <stop offset="0%"  stopColor={q.hex} stopOpacity="0.6" />
              <stop offset="60%" stopColor={q.hex} stopOpacity="0.18" />
              <stop offset="100%" stopColor={q.hex} stopOpacity="0" />
            </radialGradient>
          ))}
        </defs>
        {/* faint arc rule */}
        <path d={d} fill="none" stroke="rgba(140,123,98,0.22)" strokeWidth="1" strokeDasharray="2 5" className="fade-in" style={{ animationDelay: "300ms" }} />
        {window.QUALITIES.map((q, i) => {
          const t = (i + 0.5) / window.QUALITIES.length;
          const { x, y } = pointAt(t);
          return (
            <g key={q.key} className="fade-up-slow" style={{ animationDelay: `${600 + i * 280}ms` }}>
              <circle cx={x} cy={y - 8} r="40" fill={`url(#g-${q.key})`} />
              <text x={x} y={y + 10} textAnchor="middle"
                fontFamily="Cormorant Garamond, serif"
                fontSize="27" fontStyle="italic"
                fill="#2C2416" letterSpacing="0.01em">
                {q.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function FramingScreen({ onContinue }) {
  return (
    <div className="stage" style={{ paddingTop: 96 }}>
      <div className="center-col">
        <div className="smallcaps fade-in" style={{ marginBottom: 22 }}>
          What this is for
        </div>
        <h2 className="display fade-up" style={{ fontSize: "clamp(28px, 4.2vw, 44px)", fontStyle: "italic", margin: "0 0 28px", animationDelay: "400ms" }}>
          Seven qualities. 
        </h2>
        <p className="fade-up" style={{ fontSize: 18, color: "var(--ink-soft)", maxWidth: 580, margin: "0 auto", lineHeight: 1.7, animationDelay: "1000ms" }}>
          They get stronger with use. They get quieter without it. None of these are a personality you have or don't.
          They're elements you can choose to give time to. This year is an invitation to tend a few of them on purpose —
          not all of them, and not perfectly. Just deliberately.
        </p>
      </div>

      <div className="fade-in" style={{ animationDelay: "1800ms", width: "100%", marginTop: 48 }}>
        <QualityArc />
      </div>

      <div className="fade-up" style={{ animationDelay: "3400ms", marginTop: 32 }}>
        <button className="btn" onClick={onContinue}>I'm ready</button>
      </div>
    </div>
  );
}

Object.assign(window, { WelcomeScreen, FramingScreen });
