/* The Awe Finder — static data.
   Attached to window so plain <script> and Babel components can share it.
   No build step. */
(function () {
  "use strict";

  // Phase 2 — Wheel of Life. Order defines slider order and radar spoke order.
  var DOMAINS = [
    { key: "career",       name: "Career",               clarifier: "The work you do and how well it fits you" },
    { key: "finances",     name: "Finances",             clarifier: "Your money situation, and your peace with it" },
    { key: "health",       name: "Health",               clarifier: "Body, energy, sleep — how you physically feel" },
    { key: "family",       name: "Family & Friends",     clarifier: "The people closest to you" },
    { key: "romance",      name: "Romance",              clarifier: "Partnership, dating, or intimacy — whatever applies to you" },
    { key: "growth",       name: "Personal Growth",      clarifier: "Learning, changing, working on yourself" },
    { key: "fun",          name: "Fun & Recreation",     clarifier: "Play, hobbies, things you do just because" },
    { key: "environment",  name: "Physical Environment", clarifier: "Your home, your space, your surroundings" },
    { key: "contribution", name: "Contribution",         clarifier: "What you give beyond yourself" }
  ];

  // Phase 3 — Time & intention audit buckets.
  var TIME_BUCKETS = [
    { key: "work",         name: "Work",                 clarifier: "" },
    { key: "screens",      name: "Screens & scrolling",  clarifier: "" },
    { key: "people",       name: "People you love",      clarifier: "" },
    { key: "rest",         name: "Rest",                 clarifier: "" },
    { key: "movement",     name: "Movement",             clarifier: "" },
    { key: "creating",     name: "Creating",             clarifier: "" },
    { key: "unstructured", name: "Unstructured time",    clarifier: "time with nothing scheduled" }
  ];

  // Phase 5 — micro-practices. "custom" is the "Write your own" affordance.
  var PRACTICES = [
    { key: "awe",       title: "The awe hunt",       desc: "Once a day, stop for one beautiful thing — a sky, a song, a face — and look at it for twenty extra seconds." },
    { key: "gratitude", title: "The gratitude line", desc: "Each night, write one sentence about something good from today. One sentence is the whole practice." },
    { key: "mirror",    title: "The mirror check",   desc: "Each morning while brushing your teeth, meet your own eyes and finish the sentence: “Today I am ___.”" },
    { key: "text",      title: "One honest text",    desc: "Once a week, send one message you actually mean to someone you love. Not “hey” — the real thing." },
    { key: "evening",   title: "The fenced evening", desc: "One evening a week with nothing scheduled and your phone in another room." },
    { key: "start",     title: "The tiny start",     desc: "Ten minutes a day on the thing you keep postponing. Set a timer. You’re allowed to stop when it rings." },
    { key: "custom",    title: "Write your own",     desc: "One small action, with a frequency. Keep it under a sentence." }
  ];

  // Phase 5 — suggested practices per domain (keys into PRACTICES). "custom" always shown separately.
  var DOMAIN_PRACTICES = {
    career:       ["start", "gratitude", "mirror"],
    finances:     ["gratitude", "start", "mirror"],
    health:       ["start", "evening", "awe"],
    family:       ["text", "evening", "gratitude"],
    romance:      ["text", "evening", "gratitude"],
    growth:       ["mirror", "start", "gratitude"],
    fun:          ["awe", "evening", "start"],
    environment:  ["awe", "gratitude", "start"],
    contribution: ["text", "gratitude", "awe"]
  };

  // Phase 5 — humanity-layer line per domain (display italic).
  var HUMANITY_LAYER = {
    career:       "Career runs on wisdom — knowing what’s worth your effort and what isn’t.",
    finances:     "Money calms down when attention shows up. This is a practice of consciousness.",
    health:       "Health sticks when it’s fed by joy, not discipline alone.",
    family:       "This one runs on love — the practiced kind, not just the felt kind.",
    romance:      "Romance is love as a practice: attention, given again and again.",
    growth:       "Growth is soul work — becoming more yourself, not someone else.",
    fun:          "Fun is joy taken seriously.",
    environment:  "Your surroundings are the nearest place to practice awe. Beauty is allowed at home.",
    contribution: "Contribution is community in motion — what you give comes back as belonging."
  };

  // Phase 3 — gap reveal connection map: wheel domain -> the time bucket(s) it relates to.
  var DOMAIN_BUCKET_MAP = {
    family:       ["people"],
    romance:      ["people"],
    health:       ["movement", "rest"],
    fun:          ["unstructured"],
    growth:       ["creating"],
    career:       ["creating"],
    contribution: ["people"]
  };

  // Phase 1 — soft role-word nudge list (substring match, case-insensitive).
  var ROLE_WORDS = [
    "manager", "engineer", "teacher", "doctor", "lawyer", "student", "ceo",
    "founder", "boss", "employee", "mom", "mother", "dad", "father", "wife",
    "husband", "parent", "sister", "brother", "designer", "developer",
    "nurse", "coach"
  ];

  window.AweData = {
    DOMAINS: DOMAINS,
    TIME_BUCKETS: TIME_BUCKETS,
    PRACTICES: PRACTICES,
    DOMAIN_PRACTICES: DOMAIN_PRACTICES,
    HUMANITY_LAYER: HUMANITY_LAYER,
    DOMAIN_BUCKET_MAP: DOMAIN_BUCKET_MAP,
    ROLE_WORDS: ROLE_WORDS,
    STORAGE_KEY: "awefinder_v1"
  };
})();
