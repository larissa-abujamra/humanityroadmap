// Screens 5-7: Roadmap reveal, Return prompt, Shareable card
// Exposes: RoadmapScreen

const { useEffect: useEffectRR, useState: useStateRR, useRef: useRefRR } = React;

function RoadmapScreen({ answers, onRestart, roadmap, source }) {
  const [stage, setStage] = useStateRR(0); // 0=north star, 1=+practices, 2=+rhythm, 3=+return, 4=share
  const shareRef = useRefRR(null);

  useEffectRR(() => {
    const t1 = setTimeout(() => setStage(1), 3500);
    const t2 = setTimeout(() => setStage(2), 7500);
    const t3 = setTimeout(() => setStage(3), 11000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const cs = roadmap.qualities;
  const c1 = cs[0]?.hex || "#D4A0A0";
  const c2 = cs[1]?.hex || "#B08898";
  const c3 = cs[2]?.hex || "#8AAEC0";

  const downloadShareCard = () => {
    const node = shareRef.current;
    if (!node) return;
    // Simple approach: open print dialog scoped to that card
    window.print();
  };

  return (
    <div className="stage" style={{ paddingTop: 96, paddingBottom: 120, justifyContent: "flex-start" }}>
      <div className="left-col" style={{ maxWidth: 760 }}>

        {/* Part 1: North Star */}
        <div className="fade-up-slow">
          <div className="smallcaps" style={{ marginBottom: 18 }}>Your North Star</div>
          <p className="display italic" style={{
            fontSize: "clamp(24px, 3.6vw, 36px)",
            lineHeight: 1.35,
            color: "var(--ink)",
            margin: 0,
            textWrap: "pretty",
          }}>
            {roadmap.northStar}
          </p>
        </div>

        {/* Part 2: Three Practices */}
        {stage >= 1 && (
          <div className="fade-up-slow" style={{ marginTop: 96, animationDuration: "1800ms" }}>
            <div className="smallcaps" style={{ marginBottom: 18 }}>Your Three Practices</div>
            <p className="muted italic" style={{ fontSize: 18, marginTop: 0, marginBottom: 24 }}>
              Three to tend, this year. Not all at once.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
              {cs.map((q, i) => (
                <div key={q.key} className="roadmap-card fade-up-slow"
                  style={{ "--qc": q.hex, animationDelay: `${i * 700 + 200}ms`, animationDuration: "1600ms" }}>
                  <div className="smallcaps" style={{ color: "var(--ink-faint)" }}>Practice {["One","Two","Three"][i]}</div>
                  <h3 className="qname italic" style={{ color: "var(--ink)" }}>{q.name}</h3>
                  <p className="qbody">{q.why}</p>
                  <ul className="qpractices" style={{ paddingLeft: 22, margin: "20px 0 0" }}>
                    {q.practices.map((p, pi) => (
                      <li key={pi} className="muted" style={{ fontSize: 16, lineHeight: 1.6 }}>{p}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Part 3: Rhythm */}
        {stage >= 2 && (
          <div className="fade-up-slow" style={{ marginTop: 96, animationDuration: "1800ms" }}>
            <div className="smallcaps" style={{ marginBottom: 18 }}>Your Weekly Rhythm</div>
            <p className="muted italic" style={{ fontSize: 18, marginTop: 0, marginBottom: 28 }}>
              Three small anchors. Not a schedule.
            </p>
            <div style={{ display: "grid", gap: 24 }}>
              {[
                { label: "Monday — under five minutes", body: roadmap.rhythm.monday, c: "#C9A96E" },
                { label: "When it gets hard", body: roadmap.rhythm.hard, c: "#8E8DB5" },
                { label: "Sunday — a reflection", body: roadmap.rhythm.sunday, c: "#8AAEC0" },
              ].map((r, i) => (
                <div key={i} style={{
                  borderTop: `1px solid ${r.c}66`,
                  paddingTop: 18,
                  position: "relative",
                }}>
                  <div className="smallcaps" style={{ color: "var(--ink-faint)", marginBottom: 8 }}>{r.label}</div>
                  <p className="display italic" style={{ fontSize: "clamp(20px, 2.6vw, 26px)", lineHeight: 1.45, margin: 0, color: "var(--ink)" }}>
                    {r.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Return prompt */}
        {stage >= 3 && (
          <div className="fade-up-slow" style={{ marginTop: 120, textAlign: "center", animationDuration: "1800ms" }}>
            <div style={{ width: 60, height: 1, background: "var(--rule)", margin: "0 auto 32px" }} />
            <p className="display italic" style={{ fontSize: "clamp(22px, 3vw, 30px)", margin: "0 0 14px" }}>
              Return here in 90 days. Things will have shifted.
            </p>
            <p className="muted" style={{ fontSize: 15, maxWidth: 460, margin: "0 auto 32px" }}>
              When you return, the questions will be shorter. The map will deepen.
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <button className="btn" onClick={() => window.print()}>Save as PDF</button>
              <button className="btn-ghost" onClick={() => setStage(4)}>A card to keep →</button>
            </div>
            {source === "demo" && (
              <p className="faint" style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginTop: 36 }}>
                Demo response · Personalize live in production
              </p>
            )}
          </div>
        )}

        {/* Shareable card */}
        {stage >= 4 && (
          <div className="fade-up-slow" style={{ marginTop: 80, textAlign: "center", animationDuration: "1400ms" }}>
            <p className="display italic" style={{ fontSize: 24, margin: "0 0 32px" }}>
              This is yours to keep.
            </p>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div ref={shareRef} className="share-card"
                style={{ "--c1": c1, "--c2": c2, "--c3": c3 }}>
                <div className="midwash" />
                <div>
                  <div className="scfoot" style={{ marginBottom: 24 }}>North Star · 2026</div>
                  <p className="scbody" style={{ textWrap: "pretty" }}>
                    {roadmap.northStar}
                  </p>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", zIndex: 1 }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    {cs.map((q) => (
                      <div key={q.key} style={{ width: 12, height: 12, borderRadius: "50%", background: q.hex, opacity: 0.7 }} />
                    ))}
                  </div>
                  <div className="scfoot">Humanity Roadmap</div>
                </div>
              </div>
            </div>
            <div style={{ marginTop: 36, display: "flex", gap: 14, justifyContent: "center" }}>
              <button className="btn" onClick={() => window.print()}>Save</button>
              <button className="btn-ghost" onClick={onRestart}>Start over</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

Object.assign(window, { RoadmapScreen });
