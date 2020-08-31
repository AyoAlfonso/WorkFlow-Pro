Questionnaire.where(name: "Create My Day").first_or_create(name: "Create My Day", 
daily_limit: true,
steps: [
  {
    id: 1,
    message: "Good morning {userName}!",
    metadata: {
      username: true
    },
    trigger: 2
  },
  {
    id: 2,
    message: "It is a new day, let's get started.",
    delay: 1500,
    trigger: 3
  },
  {
    id: 3,
    message: "Take a deep breath and focus on the wonderful things in your life. They are right here. Give them your attention.",
    delay: 1500,
    trigger: 4
  },
  {
    id: 4,
    message: "And now I want you to complete this sentence",
    delay: 2500,
    trigger: 5
  },
  {
    id: 5,
    message: "I am grateful for...",
    delay: 1500,
    trigger: "gratitude-am"
  },
  {
    id: "gratitude-am",
    user: true,
    metadata: {
      validatorType: "string"
    },
    trigger: 7
  },
  {
    id: 7,
    message: "How do you need to feel today?",
    trigger: 8
  },
  {
    id: 8,
    user: true,
    metadata: {
      validatorType: "string"
    },
    trigger: 9
  },
  {
    id: 9,
    message: "That is great! You need to hold on to that as the day progresses.",
    trigger: 10
  },
  {
    id: 10,
    options: [
      {label: "Continue with the questions", value: "Continue with the questions", trigger: 11},
      {label: "Skip to setting up my day", value: "Skip to setting up my day", end: true}
    ]
  },
  {
    id: 11,
    message: "Alright, let's move on. Growth occurs outside of our comfort zone, so I need you to think about your day and what you can do today that will push you outside of your comfort zone.",
    trigger: 12
  },
  {
    id: 12,
    message: 'How can you be courageous or as I like to say, "how will you lean in today?"',
    delay: 1000,
    trigger: 13
  },
  {
    id: 13,
    user: true,
    metadata: {
      validatorType: "string"
    },
    trigger: 14
  },
  {
    id: 14,
    message: "Look at you go! That's great.",
    trigger: 15
  },
  {
    id: 15,
    message: "Did you pick your Most Important Pyns (MIPs) last night?",
    trigger: 16
  },
  {
    id: 16,
    options: [
      {label: "Yes", value: "Yes", trigger: 19},
      {label: "No", value: "No", trigger: 17}
    ]
  },
  {
    id: 17,
    message: "What are the Most Important Pyns (MIPs) you have to accomplish tomorrow? You can select three from your top 10 Pyns based on priority.",
    trigger: "select-mips"
  },
  {
    id: "select-mips",
    options: [],
    metadata: {
      frog_selector: true,
      trigger: 18
    }
  },
  {
    id: 18,
    message: "That's great {userName}. Congrats on taking the first step to owning your day.",
    metadata: {
      username: true
    },
    trigger: 21
  },
  {
    id: 19,
    message: "Last night you said these are your MIPs for the day. Take a moment to review them.",
    trigger: "display-mips"
  },
  {
    id: "display-mips",
    options: [],
    metadata: {
      display_mips: true,
      trigger: 21
    }
  },
  {
    id: 21,
    message: "p.s. You can always edit your MIPs in the Pyns widget.",
    trigger: 22
  },
  {
    id: 22,
    options: [{label: "Thanks, I got it.", value: "Thanks, I got it.", trigger: 23}]
  },
  {
    id: 23,
    message: "Before you get going, let's do a little more",
    trigger: 24
  }, 
  {
    id: 24,
    options: [
      { label: "For sure!", value: "For sure!", trigger: 27 },
      { label: "I gotta go...", value: "I gotta go...", trigger: 25}
    ]
  },
  {
    id: 25,
    message: "Maybe next time. Have an amazing day!",
    trigger: 26
  },
  {
    id: 26, 
    end: true
  },
  {
    id: 27,
    message: "You are awesome, you really get the power of reflection. So let's take a moment and capture some of your thoughts in your journal. Remember you can write anything here.",
    trigger: 28
  },
  {
    id: 28,
    user: true,
    metadata: {
      validatorType: "string"
    },
    trigger: 29
  },
  {
    id: 29,
    message: "Nice!",
    trigger: 30
  },
  {
    id: 30,
    message: "Just one more thing before we wrap up today. Jot down a mantra or words of affirmation that you can hold for today.",
    trigger: 31
  },
  {
    id: 31, 
    message: "It can be even as simple as filling in the blank:",
    trigger: 32
  },
  {
    id: 32,
    message: "I can...",
    trigger: 33
  }, 
  {
    id: 33,
    message: "I will...",
    trigger: 34
  },
  {
    id: 34,
    message: "I am...",
    trigger: 35
  },
  {
    id: 35,
    user: true,
    metadata: {
      validatorType: "string"
    },
    trigger: 36
  },
  {
    id: 36,
    message: "Amazing. You make this look easy, {userName}.",
    metadata: {
      username: true
    },
    trigger: 37
  }, 
  {
    id: 37,
    message: "Go get your day!",
    trigger: 38
  },
  {
    id: 38,
    options: [
      { label: "YEAH!", value: "YEAH!", trigger: 26 },
      { label: "Can't wait to start!", value: "Can't wait to start!", trigger: 26},
      { label: "Thanks PynBot!", value: "Thanks PynBot!", trigger: 26}
    ]
  }
]
)

Questionnaire.where(name: "Thought Challenge").first_or_create(name: "Thought Challenge", 
daily_limit: false,
steps: [
  {
    id: 1,
    message: "What negative thoughts do you have?",
    trigger: 2
  },
  {
    id: 2,
    user: true,
    trigger: 3
  },
  {
    id: 3,
    message: "Which cognitive distortions apply to you?",
    trigger: 4
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