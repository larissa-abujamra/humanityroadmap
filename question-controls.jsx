// Question primitives — quality-pick, alloc sliders, open text, choice
// Exposes: QualityPick, AllocSliders, OpenText, ChoiceGrid

const { useState: useStateQ, useEffect: useEffectQ, useRef: useRefQ, useMemo } = React;

function QualityPick({ value, onChange, limit = 1 }) {
  const selected = Array.isArray(value) ? value : (value ? [value] : []);
  const toggle = (key) => {
    const has = selected.includes(key);
    let next;
    if (limit === 1) {
      next = has ? [] : [key];
    } else {
      if (has) next = selected.filter((k) => k !== key);
      else if (selected.length >= limit) return; // cap
      else next = [...selected, key];
    }
    onChange(limit === 1 ? (next[0] || null) : next);
  };
  return (
    <div className="qcards">
      {window.QUALITIES.map((q, i) => {
        const isSel = selected.includes(q.key);
        const disabled = !isSel && limit > 1 && selected.length >= limit;
        return (
          <div key={q.key}
            className={`qcard fade-up ${isSel ? "selected" : ""} ${disabled ? "disabled" : ""}`}
            style={{ "--qc": q.hex, animationDelay: `${i * 70 + 200}ms` }}
            onClick={() => !disabled && toggle(q.key)}
            role="button"
            tabIndex="0"
            onKeyDown={(e) => { if ((e.key === "Enter" || e.key === " ") && !disabled) { e.preventDefault(); toggle(q.key); } }}
          >
            <span className="qdot" />
            <p className="qname italic">{q.name}</p>
            <p className="qdef">{q.def}</p>
          </div>
        );
      })}
    </div>
  );
}

function AllocSliders({ value, onChange }) {
  // value: { work: 14, relationships: 14, ... } summing to 100
  const keys = window.ALLOCATION_KEYS;
  const v = value || keys.reduce((acc, k) => ({ ...acc, [k]: Math.round(100 / keys.length) }), {});

  const setOne = (k, raw) => {
    const newVal = Math.max(0, Math.min(100, Math.round(raw)));
    const others = keys.filter((x) => x !== k);
    const remaining = 100 - newVal;
    const oldOthersSum = others.reduce((s, x) => s + (v[x] || 0), 0);
    const next = { ...v, [k]: newVal };
    if (oldOthersSum <= 0) {
      // distribute equally
      const each = Math.floor(remaining / others.length);
      let leftover = remaining - each * others.length;
      others.forEach((x, i) => { next[x] = each + (i < leftover ? 1 : 0); });
    } else {
      // proportional rebalance
      let runningSum = 0;
      others.forEach((x, i) => {
        const share = (v[x] || 0) / oldOthersSum;
        const portion = i === others.length - 1
          ? remaining - runningSum
          : Math.round(share * remaining);
        next[x] = Math.max(0, portion);
        runningSum += next[x];
      });
    }
    // safety: ensure exactly 100
    let sum = keys.reduce((s, x) => s + next[x], 0);
    let diff = 100 - sum;
    if (diff !== 0) {
      // adjust the largest non-locked bucket
      const target = others.reduce((best, x) => next[x] > next[best] ? x : best, others[0]);
      next[target] = Math.max(0, next[target] + diff);
    }
    onChange(next);
  };

  // Color shading per row - use quality colors loosely as accents
  const accents = ["#C9A96E", "#D4A0A0", "#8E8DB5", "#D4C27A", "#8FA68E", "#B08898", "#8AAEC0"];

  return (
    <div className="fade-up" style={{ width: "100%", maxWidth: 620, margin: "8px auto 0", animationDelay: "200ms" }}>
      {keys.map((k, i) => (
        <div className="alloc-row" key={k}>
          <span className="alabel italic" style={{ borderLeft: `2px solid ${accents[i]}55`, paddingLeft: 12 }}>{k}</span>
          <input type="range" min="0" max="60" step="1" value={v[k] || 0}
            onChange={(e) => setOne(k, parseInt(e.target.value, 10))}
            className="range" />
          <span className="apct">{Math.round(v[k] || 0)}%</span>
        </div>
      ))}
      <div style={{ borderTop: "1px solid var(--rule)", marginTop: 14, paddingTop: 10, display: "flex", justifyContent: "space-between" }}>
        <span className="faint" style={{ fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase" }}>Total</span>
        <span className="faint" style={{ fontVariantNumeric: "tabular-nums" }}>{keys.reduce((s, x) => s + (v[x] || 0), 0)}%</span>
      </div>
    </div>
  );
}

function OpenText({ value, onChange, placeholder, long }) {
  const ref = useRefQ(null);
  useEffectQ(() => { if (ref.current) ref.current.focus(); }, []);
  return (
    <div className="fade-up" style={{ width: "100%", maxWidth: 620, margin: "10px auto 0", animationDelay: "300ms" }}>
      {long ? (
        <textarea ref={ref} className="text-field" value={value || ""}
          onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={5} />
      ) : (
        <input ref={ref} type="text" className="text-field" value={value || ""}
          onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
      )}
    </div>
  );
}

function ChoiceGrid({ value, onChange, options }) {
  return (
    <div className="choice-grid">
      {options.map((opt, i) => (
        <div key={opt}
          className={`choice fade-up italic ${value === opt ? "selected" : ""}`}
          style={{ animationDelay: `${i * 60 + 150}ms` }}
          onClick={() => onChange(opt)}
          role="button" tabIndex="0"
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onChange(opt); }}}
        >
          {opt}
        </div>
      ))}
    </div>
  );
}

Object.assign(window, { QualityPick, AllocSliders, OpenText, ChoiceGrid });
