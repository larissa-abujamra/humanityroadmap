// Static data: qualities, questions, demo roadmap

window.QUALITIES = [
  { key: "love",          name: "Love",          color: "var(--love)",          hex: "#D4A0A0",
    def: "How you tend the people and pieces of yourself you care for." },
  { key: "wisdom",        name: "Wisdom",        color: "var(--wisdom)",        hex: "#C9A96E",
    def: "What you've learned, and who you let teach you." },
  { key: "joy",           name: "Joy",           color: "var(--joy)",           hex: "#D4C27A",
    def: "The pleasure of being here, in this body, on this day." },
  { key: "community",     name: "Community",     color: "var(--community)",     hex: "#8FA68E",
    def: "The wider belonging — the table you're at, and the one you set." },
  { key: "consciousness", name: "Consciousness", color: "var(--consciousness)", hex: "#8E8DB5",
    def: "The quality of attention you bring to your own mind." },
  { key: "soul",          name: "Soul",          color: "var(--soul)",          hex: "#B08898",
    def: "The part of you that doesn't need to be useful to be real." },
  { key: "awe",           name: "Awe",           color: "var(--awe)",           hex: "#8AAEC0",
    def: "Letting something be larger than you, and letting that be a relief." },
];

window.ALLOCATION_KEYS = [
  "work", "relationships", "inner life", "play", "community", "creativity", "rest",
];

// Each question has: id, kind, prompt, optional helper, optional config
window.MOVEMENTS = [
  {
    id: "where",
    title: "Where you are",
    epigraph: "Begin where your feet are.",
    questions: [
      { id: "alive",    kind: "quality-pick", limit: 1,
        prompt: "Of the seven, which feels most alive in you right now?",
        help: "Pick one. There's no wrong answer — just an honest one." },
      { id: "atrophied", kind: "quality-pick", limit: 1,
        prompt: "And which feels most neglected?",
        help: "The one that's been quiet. The one you've maybe been avoiding." },
      { id: "time_now",  kind: "alloc",
        prompt: "How are you spending your time, roughly?",
        help: "Move each line until the shape feels close to your week. They'll add up to 100." },
      { id: "time_want", kind: "alloc",
        prompt: "And how would you want to spend it?",
        help: "Don't be reasonable. Be honest." },
      { id: "present",  kind: "open", long: true,
        prompt: "When did you last feel genuinely present? What were you doing?",
        placeholder: "Not distracted. Not performing. Just there." },
    ],
  },
  {
    id: "who",
    title: "Who you are",
    epigraph: "You are not a problem to solve.",
    questions: [
      { id: "wise_one",   kind: "open", long: true,
        prompt: "Who in your life represents wisdom to you? What is it about them?",
        placeholder: "A name, and what they know that you want to know." },
      { id: "time_disappears", kind: "open",
        prompt: "What is something you do where time disappears?",
        placeholder: "Cooking. Long drives. A particular kind of conversation." },
      { id: "deepen",     kind: "open",
        prompt: "Which relationship do you most want to deepen this year?",
        help: "Could be a person. Could be the one with yourself.",
        placeholder: "Name it." },
      { id: "survived",   kind: "open", long: true, optional: true,
        prompt: "What have you lived through that made you more yourself?",
        help: "Optional. Only if it wants to be written.",
        placeholder: "A line is enough. So is a paragraph." },
    ],
  },
  {
    id: "want",
    title: "What you want",
    epigraph: "Fear is a wasted emotion.",
    questions: [
      { id: "year_from_now", kind: "open", long: true,
        prompt: "What do you want to be true about your life a year from now that might not betrue today?",
        placeholder: "Not a goal. A truth. Write it as if it were already so." },
      { id: "focus",     kind: "quality-pick", limit: 3,
        prompt: "Which of the seven do you most want to strengthen?",
        help: "Pick up to three. The ones that knock first." },
      { id: "afraid",    kind: "open",
        prompt: "What are you most afraid of losing if nothing changes?",
        placeholder: "Say the quiet thing." },
    ],
  },
  {
    id: "reality",
    title: "Your reality",
    epigraph: "A practice that fits the life you have.",
    questions: [
      { id: "discretionary", kind: "choice",
        prompt: "How much of your week is genuinely yours?",
        options: ["Less than 2 hours", "2 – 5 hours", "5 – 10 hours", "More than 10 hours"] },
      { id: "most_yourself", kind: "choice", multiple: true,
        prompt: "When are you most yourself?",
        options: ["Early mornings", "Late nights", "In conversation", "In solitude", "In movement", "In nature", "In creative work"] },
      { id: "in_the_way",   kind: "open", long: true,
        prompt: "What has gotten in your way before, when you've tried to change something?",
        placeholder: "Be specific. The pattern is the thing." },
    ],
  },
];

// Flatten for progress
window.ALL_QUESTIONS = [];
window.MOVEMENTS.forEach((m, mi) => {
  m.questions.forEach((q, qi) => {
    window.ALL_QUESTIONS.push({ ...q, movementIndex: mi, qIndex: qi, movementTitle: m.title });
  });
});
