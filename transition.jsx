// Screen 4: The Transition Moment — protected, ~9s.
// A single amber line drawn slowly across a near-white field.
// Exposes: TransitionScreen

const { useEffect: useEffectT, useState: useStateT } = React;

function TransitionScreen({ onComplete, durationMs = 9000 }) {
  const [showFirst, setShowFirst] = useStateT(false);
  const [showSecond, setShowSecond] = useStateT(false);

  useEffectT(() => {
    const t1 = setTimeout(() => setShowFirst(true), durationMs * 0.30);
    const t2 = setTimeout(() => setShowSecond(true), durationMs * 0.65);
    const t3 = setTimeout(onComplete, durationMs);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [durationMs, onComplete]);

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "#FCFAF4",
      zIndex: 50,
      overflow: "hidden",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "0 24px",
    }}>
      <style>{`
        @keyframes amberDraw {
          0%   { transform: scaleX(0); opacity: 0; }
          10%  { opacity: 1; }
          100% { transform: scaleX(1); opacity: 1; }
        }
        @keyframes amberLinger {
          0% { opacity: 1; }
          100% { opacity: 0.85; }
        }
        @keyframes softFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      {/* Single amber line — drawn slowly from left to right */}
      <div style={{
        position: "absolute",
        top: "50%",
        left: "8vw",
        right: "8vw",
        height: 1.5,
        marginTop: -1,
        transformOrigin: "left center",
        background: "linear-gradient(90deg, rgba(201,169,110,0) 0%, rgba(201,169,110,0.95) 18%, rgba(212,194,122,1) 50%, rgba(201,169,110,0.95) 82%, rgba(201,169,110,0) 100%)",
        boxShadow: "0 0 18px rgba(201,169,110,0.45), 0 0 48px rgba(201,169,110,0.22)",
        animation: `amberDraw ${durationMs * 0.85}ms cubic-bezier(.45,.05,.35,1) forwards`,
      }} />

      {/* Text */}
      <div style={{ position: "relative", zIndex: 2, textAlign: "center", maxWidth: 600, marginBottom: "16vh" }}>
        {showFirst && (
          <p key="first"
            className="display italic"
            style={{
              fontSize: "clamp(28px, 4.6vw, 44px)",
              color: "var(--ink)",
              margin: 0,
              animation: "softFade 2400ms ease both",
            }}>
            Sit with this for a moment.
          </p>
        )}
        {showSecond && (
          <p key="second"
            className="display italic"
            style={{
              fontSize: "clamp(22px, 3.6vw, 32px)",
              color: "var(--ink-soft)",
              margin: "32px 0 0",
              animation: "softFade 2600ms ease both",
            }}>
            What follows is yours.
          </p>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { TransitionScreen });
