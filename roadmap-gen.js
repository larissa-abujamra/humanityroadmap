// Roadmap generation + reveal + return prompt + shareable card.
// Exposes: TransitionAndRoadmap (orchestrates Screens 4-7), generateRoadmap

const { useEffect: useEffectR, useState: useStateR, useRef: useRefR } = React;

// ----- Demo (always-good) roadmap, lightly personalized via answers -----
function buildDemoRoadmap(answers) {
  const QUALS = window.QUALITIES;
  const focus = (answers.focus && answers.focus.length ? answers.focus
    : (answers.atrophied ? [answers.atrophied] : []))
    .slice(0, 3);
  // Top up to 3 from a sensible default
  const fill = ["soul", "community", "awe"].filter((k) => !focus.includes(k));
  while (focus.length < 3) focus.push(fill.shift());

  const wise = (answers.wise_one || "").split(/[,.\n]/)[0].trim();
  const flow = (answers.time_disappears || "").split(/[,.\n]/)[0].trim();
  const deepen = (answers.deepen || "").split(/[,.\n]/)[0].trim();
  const yearGoal = (answers.year_from_now || "").trim();
  const present = (answers.present || "").split(/[,.\n]/)[0].trim();
  const inTheWay = (answers.in_the_way || "").trim();

  const yearFragment = yearGoal ? yearGoal.replace(/^I (want|wish|hope) ?(to|that)? ?/i, "").replace(/\.$/, "") : "more of yourself, on the page";

  const northStar = `This year is not about becoming someone new. It is about returning, on purpose, to ${yearFragment ? `the version of you where ${yearFragment.toLowerCase()}` : "the version of you that already knows"}. ${present ? `You said you were last most present ${present.toLowerCase()} — let that be a clue, not a memory.` : "Pay attention to where you stop performing."} Move slower than you think you need to. ${inTheWay ? "What's gotten in the way before is information, not a verdict." : "Trust what is steady in you."} The map is not the year. You are.`;

  const practiceLib = {
    love:          [`Write one sentence of love a week — to ${deepen || "someone you've been quiet with"}.`,
                    `Once a week, ask a real question and don't fill the silence.`,
                    `Touch someone you love on the shoulder when they walk by.`],
    wisdom:        [wise ? `Send ${wise} a question this month, before you need an answer.` : `Find your wisdom-keeper. Send them a question this month.`,
                    `Keep a margin of one page in whatever you're reading. Write the line that stayed.`,
                    `When you don't know — say so, on purpose, out loud.`],
    joy:           [flow ? `Protect a non-negotiable hour of ${flow.toLowerCase()} a week.` : `Find the thing where time disappears, and put it on the calendar.`,
                    `Notice one small pleasure a day. Name it.`,
                    `Once a week, do something with no outcome attached.`],
    community:     [`Set a table — small dinner, walk, anything — once a month.`,
                    `Reach out to someone you've drifted from with no agenda.`,
                    `Show up early. Stay a little late.`],
    consciousness: [`Three minutes of nothing in the morning. No phone, no input.`,
                    `Notice the second thought, not just the first.`,
                    `Walk without listening to anything once a week.`],
    soul:          [`A weekly hour that has no purpose other than tending you.`,
                    `Write the line you don't want to write. Keep it private.`,
                    `Sit with what's heavy without trying to fix it.`],
    awe:           [`Get under a sky once a week. Look up for two minutes.`,
                    `Read something that's bigger than you — a poem, a paragraph.`,
                    `Let one thing this month genuinely surprise you.`],
  };

  const explanations = {
    love:          `You named the people in your life. They appear in your answers more than you might have expected. This year, love is the practice of showing up for them with attention rather than effort.`,
    wisdom:        `You already know who teaches you. The practice is to let them — actually let them — by asking, and listening past the first answer.`,
    joy:           `You told the truth about what makes time disappear. This year, that's not a luxury. It's a structural piece of the map.`,
    community:     `You're held more than you're admitting. The practice is reciprocity — being one of the people who sets the table, not only one of the ones invited.`,
    consciousness: `Your mind is fast and full. This year is about widening the gap between stimulus and response. Not silence — just spaciousness.`,
    soul:          `You said something this year that doesn't yet have words for itself. Soul is the practice of giving it room without rushing it into a sentence.`,
    awe:           `You've gotten small with the small things. This year is about getting small with the large ones — sky, water, music, anything that returns scale.`,
  };

  const qualities = focus.map((key) => {
    const q = QUALS.find((x) => x.key === key);
    return {
      key, name: q.name, hex: q.hex,
      why: explanations[key],
      practices: practiceLib[key].slice(0, 3),
    };
  });

  const rhythm = {
    monday: `On Monday, write a single sentence: what is this week for? Three minutes, no more.`,
    hard: inTheWay
      ? `When it gets hard — and you said the pattern is ${inTheWay.toLowerCase().replace(/\.$/, "")} — pause. Hand on the chest. One slow breath. Ask: what would the version of me from a year-from-now do here?`
      : `When it gets hard, pause. Hand on the chest. One slow breath. Ask: what would I do if I weren't afraid?`,
    sunday: `On Sunday, ask yourself two questions: where did I show up? Where did I disappear? Don't grade them. Just notice.`,
  };

  return { northStar, qualities, rhythm };
}

// ----- Live attempt via window.claude.complete -----
async function attemptLiveRoadmap(answers) {
  if (!window.claude || !window.claude.complete) throw new Error("no claude");
  const prompt = `You are writing a deeply personal "Humanity Roadmap" for a user, in the warm, direct, poetic voice of Tina Sharkey. Never self-helpy. Never corporate. Trust the reader.

The user answered a reflection questionnaire about cultivating seven qualities: Love, Wisdom, Joy, Community, Consciousness, Soul, Awe.

ANSWERS:
${JSON.stringify(answers, null, 2)}

Return strict JSON with this shape (no commentary, just JSON):
{
  "northStar": "one warm paragraph in second person, 3-5 sentences, weaving in their actual words",
  "qualities": [
    { "key": "<one of love/wisdom/joy/community/consciousness/soul/awe>", "why": "2-3 sentences why THIS quality for THEM, citing their words", "practices": ["practice 1 referencing specifics","practice 2","practice 3"] },
    { "key": "...", "why": "...", "practices": ["...","...","..."] },
    { "key": "...", "why": "...", "practices": ["...","...","..."] }
  ],
  "rhythm": {
    "monday": "one short under-5-min anchor for the week's start",
    "hard": "a specific reorientation practice for hard moments, written for them",
    "sunday": "a reflection practice for the week's end"
  }
}

Choose the three qualities based on their stated focus and what their answers suggest they need. If they named a friend, name them. If they named what they love, reference it. Weave their language back to them. Do not invent facts.`;

  const txt = await window.claude.complete(prompt);
  // Extract JSON
  const match = txt.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("no json");
  const parsed = JSON.parse(match[0]);
  // Normalize qualities to include name/hex
  parsed.qualities = parsed.qualities.map((q) => {
    const meta = window.QUALITIES.find((x) => x.key === q.key) || window.QUALITIES[0];
    return { ...q, name: meta.name, hex: meta.hex, key: meta.key };
  });
  return parsed;
}

async function generateRoadmap(answers) {
  try {
    const live = await Promise.race([
      attemptLiveRoadmap(answers),
      new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), 20000)),
    ]);
    if (live && live.northStar && live.qualities && live.qualities.length === 3 && live.rhythm) {
      return { source: "live", ...live };
    }
    throw new Error("incomplete");
  } catch (e) {
    return { source: "demo", ...buildDemoRoadmap(answers) };
  }
}

window.generateRoadmap = generateRoadmap;
window.buildDemoRoadmap = buildDemoRoadmap;
