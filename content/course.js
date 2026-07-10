window.IF_COURSE = {
  title: "Investing Foundations",
  pilotDay: 2,
  days: [
    {day: 1, title: "Saving, investing, and your goals", time: "24 min", available: true},
    {day: 2, title: "Companies, ownership, stocks, and shares", time: "29 min", available: true},
    {day: 3, title: "Why prices move and why risk is real", time: "24 min", available: true},
    {day: 4, title: "Bonds: lending instead of owning", time: "24 min", available: true},
    {day: 5, title: "Funds: owning a collection", time: "24 min", available: true},
    {day: 6, title: "Diversification and spreading risk", time: "24 min", available: true},
    {day: 7, title: "A calm first-week review", time: "22 min", available: true},
    {day: 8, title: "Returns, time, and compounding", time: "24 min", available: true},
    {day: 9, title: "Fees and why small costs matter", time: "24 min", available: true},
    {day: 10, title: "Brokerage accounts and order basics", time: "25 min", available: true},
    {day: 11, title: "Reading information without chasing hype", time: "24 min", available: true},
    {day: 12, title: "Fraud warning signs and safer questions", time: "25 min", available: true},
    {day: 13, title: "Building a personal learning checklist", time: "24 min", available: true},
    {day: 14, title: "Review, explain, and choose a next step", time: "25 min", available: true}
  ],
  baseline: [
    {
      id: "confidence",
      prompt: "How confident do you feel explaining what a stock is?",
      help: "There is no right answer. This helps you notice your progress.",
      options: ["Not confident yet", "A little confident", "Mostly confident", "Very confident"]
    },
    {
      id: "startingIdea",
      prompt: "Which statement sounds closest to your current understanding?",
      help: "Choose your best guess. This is not graded.",
      options: [
        "A share is part ownership in a company",
        "A share is a piece of a company’s building or products",
        "A share is money the company must repay",
        "I’m not sure yet"
      ]
    },
    {
      id: "goal",
      prompt: "What would make this lesson useful to you?",
      help: "Pick the reason that fits best today.",
      options: [
        "Understand words I hear in the news",
        "Feel less intimidated by investing",
        "Explain the basics to someone else",
        "Build a foundation for later decisions"
      ]
    }
  ]
};
