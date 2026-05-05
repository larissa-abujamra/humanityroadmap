// Questionnaire engine + Movement title screens
// Exposes: QuestionnaireScreen, MovementIntro

const { useState: useStateQ2, useEffect: useEffectQ2 } = React;

function MovementIntro({ movement, index, onContinue }) {
  // Auto-advance after a beat, but also allow click anywhere to continue
  useEffectQ2(() => {
    const t = setTimeout(onContinue, 4200);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="stage" onClick={onContinue} style={{ cursor: "pointer" }}>
      <div className="center-col">
        <div className="smallcaps fade-in" style={{ marginBottom: 28 }}>
          Movement {["One", "Two", "Three", "Four"][index]}
        </div>
        <h2 className="display fade-up" style={{ fontSize: "clamp(40px, 7vw, 84px)", fontStyle: "italic", margin: "0 0 28px", animationDelay: "400ms" }}>
          {movement.title}
        </h2>
        <p className="muted fade-up" style={{ fontSize: 18, fontStyle: "italic", maxWidth: 460, margin: "0 auto", animationDelay: "1400ms" }}>
          {movement.epigraph}
        </p>
        <p className="faint fade-in" style={{ marginTop: 56, fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", animationDelay: "2800ms" }}>
          Continuing
        </p>
      </div>
    </div>
  );
}

function QuestionView({ question, value, onChange }) {
  return (
    <div className="stage" style={{ paddingTop: 96 }}>
      <div className="left-col" style={{ maxWidth: 760 }}>
        <div className="smallcaps fade-in" style={{ marginBottom: 18 }}>
          {question.movementTitle}
          {question.optional && <span style={{ marginLeft: 10, opacity: 0.7 }}>· optional</span>}
        </div>
        <h3 className="display fade-up italic" style={{ fontSize: "clamp(26px, 4.2vw, 42px)", margin: "0 0 14px", animationDelay: "200ms", lineHeight: 1.2 }}>
          {question.prompt}
        </h3>
        {question.help && (
          <p className="muted fade-up" style={{ fontSize: 16, margin: "0 0 18px", animationDelay: "600ms" }}>
            {question.help}
          </p>
        )}

        <div style={{ marginTop: 20 }}>
          {question.kind === "quality-pick" && (
            <QualityPick value={value} onChange={onChange} limit={question.limit || 1} />
          )}
          {question.kind === "alloc" && (
            <AllocSliders value={value} onChange={onChange} />
          )}
          {question.kind === "open" && (
            <OpenText value={value} onChange={onChange} placeholder={question.placeholder} long={question.long} />
          )}
          {question.kind === "choice" && (
            <ChoiceGrid
              value={value}
              onChange={onChange}
              options={question.options}
              multiple={!!question.multiple}
              limit={question.limit}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function QuestionnaireScreen({ answers, setAnswer, onComplete }) {
  // Index encodes: which movement intro / which question.
  // Sequence: intro0, q...q, intro1, q...q, intro2, q...q, intro3, q...q, done
  // Build a flat list of "steps"
  const steps = [];
  window.MOVEMENTS.forEach((m, mi) => {
    steps.push({ kind: "intro", movement: m, movementIndex: mi });
    m.questions.forEach((q, qi) => {
      steps.push({ kind: "q", question: { ...q, movementIndex: mi, qIndex: qi, movementTitle: m.title } });
    });
  });

  const [stepIdx, setStepIdx] = useStateQ2(0);
  const [direction, setDirection] = useStateQ2(1);

  const current = steps[stepIdx];
  // progress: count answered questions / total
  const totalQ = window.ALL_QUESTIONS.length;
  const answeredCount = window.ALL_QUESTIONS.filter((q) => {
    const a = answers[q.id];
    if (q.kind === "alloc") return a && Object.values(a).reduce((s, v) => s + v, 0) === 100;
    if (q.kind === "quality-pick") return Array.isArray(a) ? a.length > 0 : !!a;
    return !!a && (typeof a !== "string" || a.trim().length > 0);
  }).length;
  const progress = Math.min(0.99, answeredCount / totalQ);

  const next = () => {
    if (stepIdx < steps.length - 1) {
      setDirection(1);
      setStepIdx((i) => i + 1);
    } else {
      onComplete();
    }
  };
  const back = () => {
    if (stepIdx > 0) {
      setDirection(-1);
      setStepIdx((i) => i - 1);
    }
  };

  // Validation for current question (if any)
  const canAdvance = (() => {
    if (!current || current.kind !== "q") return true;
    const q = current.question;
    if (q.optional) return true;
    const a = answers[q.id];
    if (q.kind === "open") return !!a && a.trim().length > 0;
    if (q.kind === "quality-pick") return Array.isArray(a) ? a.length > 0 : !!a;
    if (q.kind === "alloc") return a && Object.values(a).reduce((s, v) => s + v, 0) === 100;
    if (q.kind === "choice") return q.multiple ? (Array.isArray(a) && a.length > 0) : !!a;
    return true;
  })();

  return (
    <>
      {/* Progress line */}
      <div className="progress-line" aria-hidden="true">
        <span style={{ width: `${progress * 100}%` }} />
      </div>

      {/* Animated step container */}
      <div key={stepIdx}
        className="fade-up-slow"
        style={{ animationDuration: "1100ms" }}>
        {current.kind === "intro" ? (
          <MovementIntro movement={current.movement} index={current.movementIndex} onContinue={next} />
        ) : (
          <>
            <QuestionView
              question={current.question}
              value={answers[current.question.id]}
              onChange={(val) => setAnswer(current.question.id, val)}
            />
            <div style={{
              position: "fixed", bottom: 32, left: 0, right: 0,
              display: "flex", justifyContent: "center", alignItems: "center", gap: 16,
              zIndex: 10, padding: "0 24px",
            }}>
              <button className="btn-ghost" onClick={back} disabled={stepIdx === 0}
                style={{ visibility: stepIdx === 0 ? "hidden" : "visible" }}>
                ← back
              </button>
              <button className="btn" onClick={next} disabled={!canAdvance}>
                {stepIdx === steps.length - 1 ? "Finish" : "Continue"}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

Object.assign(window, { QuestionnaireScreen, MovementIntro });
