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
    trigger: 3
  },
  {
    id: 3,
    message: "Take a deep breath and focus on the wonderful things in your life. They are right here. Give them your attention.",
    trigger: 4
  },
  {
    id: 4,
    message: "And now I want you to complete this sentence",
    trigger: 5
  },
  {
    id: 5,
    message: "I am grateful for...",
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
      { label: "YEAH!", value: "YEAH!" },
      { label: "Can't wait to start!", value: "Can't wait to start!" },
      { label: "Thanks PynBot!", value: "Thanks PynBot!" }
    ],
    end: true
  }
]
)

Questionnaire.where(name: "Thought Challenge").first_or_create(name: "Thought Challenge", 
daily_limit: false,
steps: [
  {
    id: 1,
    message: "Hi {userName}!",
    metadata: {
      username: true
    },
    trigger: 2
  },
  {
    id: 2,
    message: "How are you right now?",
    trigger: "mood"
  },
  {
    id: "mood",
    options: [
      { label: "Low Energy & Unpleasant", value: "Low Energy & Unpleasant", trigger: "lu-feeling"},
      { label: "High Energy & Unpleasant", value: "High Energy & Unpleasant", trigger: "hu-feeling"},
      { label: "Low Energy & Pleasant", value: "Low Energy & Pleasant", trigger: "lp-feeling"},
      { label: "High Energy & Pleasant", value: "High Energy & Pleasant", trigger: "hp-feeling"}
    ]
  },
  {
    id: "lu-feeling",
    options: [
      { label: 'Alone', value: 'Alone', trigger: 3 },
      { label: 'Down', value: 'Down', trigger: 3 },
      { label: 'Bored', value: 'Bored', trigger: 3 },
      { label: 'Tired', value: 'Tired', trigger: 3 },
      { label: 'Embarrassed', value: 'Embarrassed', trigger: 3 },
      { label: 'Excluded', value: 'Excluded', trigger: 3 },
      { label: 'Timid', value: 'Timid', trigger: 3 },
      { label: 'Drained', value: 'Drained', trigger: 3 },
      { label: 'Mortified', value: 'Mortified', trigger: 3 },
      { label: 'Alienated', value: 'Alienated', trigger: 3 },
      { label: 'Mopey', value: 'Mopey', trigger: 3 },
      { label: 'Apathetic', value: 'Apathetic', trigger: 3 },
      { label: ' Disgusted', value: ' Disgusted', trigger: 3 },
      { label: 'Disappointed', value: 'Disappointed', trigger: 3 },
      { label: 'Glum', value: 'Glum', trigger: 3 },
      { label: 'Ashamed', value: 'Ashamed', trigger: 3 }
    ]
  },
  {
    id: "hu-feeling",
    options: [
      { label: 'Enraged', value: 'Enraged', trigger: 3 },
      { label: 'Furious', value: 'Furious', trigger: 3 },
      { label: 'Frustrated', value: 'Frustrated', trigger: 3 },
      { label: 'Shocked', value: 'Shocked', trigger: 3 },
      { label: 'Livid', value: 'Livid', trigger: 3 },
      { label: 'Freightened', value: 'Freightened', trigger: 3 },
      { label: 'Nervous', value: 'Nervous', trigger: 3 },
      { label: 'Restless', value: 'Restless', trigger: 3 },
      { label: 'Fuming', value: 'Fuming', trigger: 3 },
      { label: 'Apprehensive', value: 'Apprehensive', trigger: 3 },
      { label: ' Worried', value: ' Worried', trigger: 3 },
      { label: 'Annoyed', value: 'Annoyed', trigger: 3 },
      { label: 'Repulsed', value: 'Repulsed', trigger: 3 },
      { label: 'Troubled', value: 'Troubled', trigger: 3 },
      { label: 'Uneasy', value: 'Uneasy', trigger: 3 },
      { label: 'Peeved', value: 'Peeved', trigger: 3 }
    ]
  },
  {
    id: "lp-feeling",
    options: [
      { label: 'Enraged', value: 'Enraged', trigger: 3 },
      { label: 'Furious', value: 'Furious', trigger: 3 },
      { label: 'Frustrated', value: 'Frustrated', trigger: 3 },
      { label: 'Shocked', value: 'Shocked', trigger: 3 },
      { label: 'Livid', value: 'Livid', trigger: 3 },
      { label: 'Freightened', value: 'Freightened', trigger: 3 },
      { label: 'Nervous', value: 'Nervous', trigger: 3 },
      { label: 'Restless', value: 'Restless', trigger: 3 },
      { label: 'Fuming', value: 'Fuming', trigger: 3 },
      { label: 'Apprehensive', value: 'Apprehensive', trigger: 3 },
      { label: 'Worried', value: 'Worried', trigger: 3 },
      { label: 'Annoyed', value: 'Annoyed', trigger: 3 },
      { label: 'Repulsed', value: 'Repulsed', trigger: 3 },
      { label: 'Troubled', value: 'Troubled', trigger: 3 },
      { label: 'Uneasy', value: 'Uneasy', trigger: 3 },
      { label: 'Peeved', value: 'Peeved', trigger: 3 }
    ]
  },
  {
    id: "hp-feeling",
    options: [
      { label: 'Enraged', value: 'Enraged', trigger: 3 },
      { label: 'Furious', value: 'Furious', trigger: 3 },
      { label: 'Frustrated', value: 'Frustrated', trigger: 3 },
      { label: 'Shocked', value: 'Shocked', trigger: 3 },
      { label: 'Livid', value: 'Livid', trigger: 3 },
      { label: 'Freightened', value: 'Freightened', trigger: 3 },
      { label: 'Nervous', value: 'Nervous', trigger: 3 },
      { label: 'Restless', value: 'Restless', trigger: 3 },
      { label: 'Fuming', value: 'Fuming', trigger: 3 },
      { label: 'Apprehensive', value: 'Apprehensive', trigger: 3 },
      { label: 'Worried', value: 'Worried', trigger: 3 },
      { label: 'Annoyed', value: 'Annoyed', trigger: 3 },
      { label: 'Repulsed', value: 'Repulsed', trigger: 3 },
      { label: 'Troubled', value: 'Troubled', trigger: 3 },
      { label: 'Uneasy', value: 'Uneasy', trigger: 3 },
      { label: 'Peeved', value: 'Peeved', trigger: 3 }
    ]
  },
  {
    id: 3, 
    message: "Thanks. Understanding what you are feeling helps you better address and learn from it.", 
    trigger: 4
  },
  {
    id: 4, 
    message: "Do you want to explore this a little more?", 
    trigger: 5
  },
  {
    id: 5, 
    options: [
      {value: true, label: "Yes", trigger: "6"}, 
      {value: false, label: "No", trigger: "end-short"}
    ]
  },
  {
    id: "end-short", 
    message: "Okay. Great effort, {userName}. Remember to check in often, see you soon!", 
    metadata: {
      username: true
    },
    end: true,
  },
  {
    id: 6, 
    message: "Did something happen or did you have a thought that triggered what you're feeling?", 
    trigger: 7
  },
  {
    id: 7, 
    user: true, 
    metadata: {
      validatorType: "string"
    },
    trigger: 8
  },
  {
    id: 8, 
    message: "Thanks for sharing, {userName}. Being aware of what triggered your emotion is very important", 
    metadata: {
      username: true
    },
    trigger: 9
  },
  {
    id: 9, 
    message: "Given your current Pyns and what you have to get done, do you want to maintain your emotion or shift?", 
    trigger: 10
  },
  {
    id: 10, 
    options: [
      {value: "Shift", label: "Shift", trigger: 11}, 
      {value: "Stay", label: "Stay", trigger: "end-short"}
    ]
  },
  {
    id: 11, 
    message: "Ok, so thinking of what you need to do, what emotion would serve you best?", 
    trigger: 12
  },
  {
    id: 12, 
    user: true, 
    metadata: {
      validatorType: "string"
    },
    trigger: 13
  },
  {
    id: 13, 
    message: "What can you do to get yourself in that state?", 
    trigger: 14
  },
  {
    id: 14, 
    user: true, 
    metadata: {
      validatorType: "string"
    },
    trigger: 15
  },
  {
    id: 15, 
    message: "Awesome! I think you know just what you have to do.", 
    trigger: "end"
  },
  { 
    id: "end", 
    message: "Remember to check in often, see you soon!", 
    end: true
  }
]
)

Questionnaire.where(name: "Evening Reflection").first_or_create(name: "Evening Reflection", 
  daily_limit: true,
  steps: [
    {
      id: 1, 
      message: "Good evening, {userName}! Great to see you.",
      metadata: {
        username: true
      },
      trigger: 2
    },
    {
      id: 2, 
      message: "You achieved {completedPynCount} out of {totalPynCount} Pyns today",
      metadata: {
        pynCount: true
      },
      trigger: 3
    },
    {
      id: 3, 
      message: "I know you did more than that! Tell me what else happened today?", 
      trigger: "what-happened"
    },
    {
      id: "what-happened", 
      user: true,
      metadata: {
        validatorType: "string"
      },
      trigger: 5
    },
    {
      id: 5, 
      message: "Cool!", 
      trigger: 6
    },
    {
      id: 6, 
      message: "How would you say your day was?", 
      trigger: "rating"
    },
    {
      id: "rating",
      options: [],
      metadata: {
        emotion_selector: true,
        emotions: [
          {icon: "Emotion-E", color: "warningRed", value: "Emotion-E", trigger: 8},
          {icon: "Emotion-D", color: "cautionYellow", value: "Emotion-D", trigger: 8},
          {icon: "Emotion-C", color: "grey60", value: "Emotion-C", trigger: 8},
          {icon: "Emotion-B", color: "successGreen", value: "Emotion-B", trigger: 8},
          {icon: "Emotion-A", color: "finePine", value: "Emotion-A", trigger: 8}
        ]
      }
    },
    {
      id: 8, 
      message: "Got it.", 
      trigger: 9
    },
    {
      id: 9, 
      message: "It is important to acknowledge our wins, even if we think they are no big deal.", 
      trigger: 10
    },
    {
      id: 10, 
      message: "Can you tell me what were your top three wins for today?", 
      trigger: "wins"
    },
    {
      id: "wins", 
      user: true, 
      metadata: {
        validatorType: "string"
      },
      trigger: 12
    },
    {
      id: 12, 
      message: "Way to go!", 
      trigger: 13
    },
    {
      id: 13, 
      options: [
        {value: "Yes", label: "Yes", trigger: 16}, 
        {value: "No", label: "No", trigger: 15},
        {value: "Skip", label: "Don't have time to talk now...", trigger: 14}
      ]
    },
    {
      id: 14, 
      message: "No worries!", 
      trigger: 32
    },
    {
      id: 15, 
      message: "The magic happens when you step out of your comfort zone. Challenge yourself tomorrow to push past your comfort zone.",
      trigger: 18
    },
    {
      id: 16, 
      message: "Awesome, what did you do?", 
      trigger: "comfort-zone"
    },
    {
      id: "comfort-zone", 
      user: true, 
      metadata: {
        validatorType: "string"
      },
      trigger: 17
    },
    {
      id: 17, 
      message: "Way to go {userName}! You clearly understand that growth happens outside of our comfort zone. I am proud of you!",
      metadata: {
        username: true
      },
      trigger: 18
    },
    {
      id: 18, 
      message: "Where did you spend time on today that wasn't for your highest good?", 
      trigger: "highest-good"
    },
    {
      id: "highest-good", 
      user: true,
      metadata: {
        validatorType: "string"
      },
      trigger: 20
    },
    {
      id: 20, 
      message: "Got it, Thanks.", 
      trigger: 21
    },
    {
      id: 21, 
      message: "So {userName}, what was one lesson you learned today?",
      metadata: {
        username: true
      },
      trigger: "lessons"
    },
    {
      id: "lessons", 
      user: true, 
      metadata: {
        validatorType: "string"
      },
      trigger: 23
    },
    {
      id: 23, 
      message: "We need to keep building on these learning and you will see this again at your weekly R&P.", 
      trigger: 24
    },
    {
      id: 24, 
      message: "Okay, now let's shift a little. Complete the following sentence", 
      trigger: 25
    },
    {
      id: 25, 
      message: "I could have made today better if...", 
      trigger: "improvements"
    },
    {
      id: "improvements", 
      user: true,
      metadata: {
        validatorType: "string"
      },
      trigger: 27
    },
    {
      id: 27, 
      message: "Sounds like something to remember for tomorrow. You've had quite the day, {userName}!",
      metadata: {
        username: true
      },
      trigger: 28
    },
    {
      id: 28, 
      options: [
        {value: "Yeah, it was", label: "Yeah, it was", trigger: 29}, 
        {value: "It was okay", label: "It was okay", trigger: 29}, 
        {value: "No big deal", label: "No big deal", trigger: 29}
      ]
    },
    {
      id: 29, 
      message: "So before we shift to thinking about tomorrow, what are you most grateful for today?", 
      trigger: "gratitude-pm"
    },
    {
      id: "gratitude-pm", 
      user: true,
      metadata: {
        validatorType: "string"
      },
      trigger: 31
    },
    {
      id: 31, 
      message: "Nice :O)", 
      trigger: 32
    },
    {
      id: 32, 
      message: "I know you know this {userName}; A good tomorrow starts right now. So I want you to think about what you need to do tomorrow.",
      metadata: {
        username: true
      }, 
      trigger: 33
    },
    {
      id: 33, 
      message: "What are the Most Important Pyns (MIPs) you have to accomplish tomorrow? You can select three from your top 10 Pyns based on priority.", 
      trigger: "mips"
    },
    {
      id: "mips", 
      options: [],
      metadata: {
        frog_selector: true,
        trigger: 34
      }
    },
    {
      id: 34, 
      message: "Fantastic, you have planted the seeds for a great day!", 
      trigger: 35
    },
    {
      id: 35, 
      options: [
        {value: "Yeah, PynBot!", label: "Yeah, PynBot!", trigger: 36}
      ]
    },
    {
      id: 36, 
      message: "Before you go, it is always a good practice to stop and reflect on the day. This is where you can write freely.", 
      trigger: 37
    },
    {
      id: 37, 
      message: "Is there anything you would like to capture or reflect upon your day?", 
      trigger: 38
    },
    {
      id: 38, 
      options: [
        {value: "Yes", label: "Yes", trigger: 41}, 
        {value: "No", label: "No", trigger: 39}
      ]
    },
    {
      id: 39, 
      message: "Thank you for showing up {userName}, I'm looking forward to talking with you tomorrow!",
      metadata: {
        username: true
      }, 
      trigger: 40
    },
    {
      id: 40, 
      options: [
        {value: "Thanks, PynBot!", label: "Thanks, PynBot!"}
      ],
      end: true
    },
    {
      id: 41, 
      message: "Great, this is your space--go for it!", 
      trigger: "reflection"
    },
    {
      id: "reflection", 
      user: true,
      metadata: {
        validatorType: "string"
      },
      trigger: 43
    },
    {
      id: 43, 
      message: "Your future self will value that! Have a great evening {userName}, I'm excited to talk with you tomorrow morning.",
      metadata: {
        username: true
      }, 
      trigger: 44
    },
    {
      id: 44, 
      options: [
        { value: "Thanks, PynBot!", label: "Thanks, PynBot!" }
      ],
      end: true
    }
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