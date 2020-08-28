Questionnaire.where(name: "Create My Day").first_or_create(name: "Create My Day", 
daily_limit: true,
steps: [
  {
    id: 1,
    message: "What are you grateful for?",
    trigger: "2"
  },
  {
    id: 2,
    user: true,
    trigger: "3"
  },
  {
    id: 3,
    message:
      "How do you want to feel today? What does your life look like when you are feeling that way?",
    trigger: "4"
  },
  {
    id: 4,
    user: true,
    trigger: "5"
  },
  {
    id: 5,
    message: "What frog will you eat today?",
    trigger: "6"
  },
  {
    id: 6,
    options: [],
    metadata: {
      frog_selector: true,
      trigger: 7
    }
  },
  {
    id: 7,
    message: "What is your daily affirmation today?",
    trigger: "8"
  },
  {
    id: 8,
    user: true,
    trigger: "9"
  },
  {
    id: 9,
    message: "What are your thoughts and reflections for today?",
    trigger: "10"
  },
  {
    id: 10,
    user: true,
    end: true
  }
]
)

Questionnaire.where(name: "Thought Challenge").first_or_create(name: "Thought Challenge", 
daily_limit: false,
steps: [
  {
    id: 1,
    message: "What negative thoughts do you have?",
    trigger: "2"
  },
  {
    id: 2,
    user: true,
    trigger: "3"
  },
  {
    id: 3,
    message: "Which cognitive distortions apply to you?",
    trigger: "4"
  },
  {
    id: 4,
    options: [
      { value: "All-or-Nothing Thinking", label: "All-or-Nothing Thinking", trigger: "5" },
      { value: "Overgeneralization", label: "Overgeneralization", trigger: "5" },
      { value: "Filtering Out Positives", label: "Filtering Out Positives", trigger: "5" },
      { value: "Jumping to Conclusions", label: "Jumping to Conclusions", trigger: "5" }
    ]
  },
  {
    id: 5,
    message: "How can you challenge your negative thoughts?",
    trigger: "6"
  },
  {
    id: 6,
    user: true,
    trigger: "7"
  },
  {
    id: 7,
    message: "What is another way of interpreting the situation?",
    trigger: "8"
  },
  {
    id: 8,
    user: true,
    trigger: "9"
  },
  {
    id: 9,
    message: "How are you feeling now?",
    trigger: "10"
  },
  {
    id: 10,
    options: [],
    metadata: {
      emotion_selector: true,
      emotions: [
          {icon: "Emotion-D", color: "cautionYellow", value: "Worse than before!", trigger: 12},
          {icon: "Emotion-C", color: "grey60", value: "About the Same", trigger: 13},
          {icon: "Emotion-B", color: "successGreen", value: "Better than before!", trigger: 14}
      ]
    }
  },
  {
    id: 12,
    message: "Sorry to hear that...",
    end: true
  },
  {
    id: 13,
    message: "Got it. You can always try something relaxing and come back to this later.",
    end: true
  },
  {
    id: 14,
    message: "Glad to hear that!",
    end: true
  },
]
)

Questionnaire.where(name: "Evening Reflection").first_or_create(name: "Evening Reflection", 
daily_limit: true,
steps: [
  {
    id: 1,
    message: "How are you feeling?",
    trigger: "2"
  },
  {
    id: 2,
    metadata: {
      emotion_selector: true,
      emotions: [
        {icon: "Emotion-E", color: "warningRed", value: 1, trigger: 3},
        {icon: "Emotion-D", color: "cautionYellow", value: 2, trigger: 3},
        {icon: "Emotion-C", color: "grey60", value: 3, trigger: 3},
        {icon: "Emotion-B", color: "successGreen", value: 4, trigger: 3},
        {icon: "Emotion-A", color: "finePine", value: 5, trigger: 3}
      ]
    }
  },
  {
    id: 3,
    message: "What did you feel?",
    trigger: "4"
  },
  {
    id: 4,
    user: true,
    trigger: "5"
  },
  {
    id: 5,
    message: "Reflect and celebrate",
    trigger: "6"
  },
  {
    id: 6,
    user: true,
    trigger: "7"
  },
  {
    id: 7,
    message: "Daily affirmations",
    trigger: "8"
  },
  {
    id: 8,
    user: true,
    trigger: "9"
  },
  {
    id: 9,
    message: "Thoughts and reflections",
    trigger: "10"
  },
  {
    id: 10,
    user: true,
    end: true
  },
]
)

Questionnaire.where(name: "Weekly Reflection").first_or_create(name: "Weekly Reflection", 
daily_limit: false,
steps: [
  {
    id: 1,
    options: [],
    metadata: {
      questionnaire_title: true,
      message: "Weekly Rating"
    },
    trigger: 2,
  },
  {
    id: 2,
    message: "On a scale of 1-10, how well did I progress towards my goals this week?",
    trigger: 3,
  },
  {
    id: 3,
    options: [
      { label: "1", value: 1, trigger: 4 },
      { label: "2", value: 2, trigger: 4 },
      { label: "3", value: 3, trigger: 4 },
      { label: "4", value: 4, trigger: 4 },
      { label: "5", value: 5, trigger: 4 },
      { label: "6", value: 6, trigger: 4 },
      { label: "7", value: 7, trigger: 4 },
      { label: "8", value: 8, trigger: 4 },
      { label: "9", value: 9, trigger: 4 },
      { label: "10", value: 10, trigger: 4 },
    ],
  },
  {
    id: 4,
    options: [],
    metadata: {
      questionnaire_title: true,
      message: "My Biggest Wins"
    },
    trigger: 5,
  },
  {
    id: 5,
    message: "What went well?  Any wins (big or little) this week? (up to 5)",
    trigger: 6,
  },
  {
    id: 6,
    user: true,
    placeholder: "Write something...",
    trigger: 7,
  },
  {
    id: 7,
    message: "What did I learn from these wins and how can I double down on them?",
    trigger: 8,
  },
  {
    id: 8,
    user: true,
    placeholder: "Write something...",
    trigger: 9,
  },
  {
    id: 9,
    user: true,
    end: true
  },
]
)