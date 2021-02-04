Questionnaire.where(name: "Create My Day", 
  limit_type: 1,
  title: "Create My Day").first_or_initialize.update(steps: [
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
        validatorType: "string",
        journalQuestion: "Gratitude:"
      },
      trigger: 7
    },
    {
      id: 7,
      message: "How do you need to feel today?",
      trigger: "feel"
    },
    {
      id: "feel",
      user: true,
      metadata: {
        validatorType: "string",
        journalQuestion: "How I need to feel today:"
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
      trigger: "lean-in"
    },
    {
      id: "lean-in",
      user: true,
      metadata: {
        validatorType: "string",
        journalQuestion: "How I will lean in today:"
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
      message: "{mipCheck}",
      metadata: {
        mip_check: {
          no_mips: "you haven’t picked your Most Important Pyns for today yet but here are your top priority Pyns. Select your Most Important Pyns for the day:",
          has_mips: "these are your Most Important Pyns for the day. Take a moment to review them:"
        }
      },
      trigger: "select-mips"
    },
    {
      id: "select-mips",
      options: [],
      metadata: {
        mip_selector: true,
        trigger: 16
      }
    },
    {
      id: 16,
      message: "That's great {userName}. Congrats on taking the first step to owning your day.",
      metadata: {
        username: true
      },
      trigger: 17
    },
    {
      id: 17,
      message: "p.s. You can always edit your MIPs in the Pyns widget.",
      trigger: 18
    },
    {
      id: 18,
      options: [{label: "Thanks, I got it.", value: "Thanks, I got it.", trigger: 19}]
    },
    {
      id: 19,
      message: "Before you get going, let's do a little more",
      trigger: 20
    }, 
    {
      id: 20,
      options: [
        { label: "For sure!", value: "For sure!", trigger: 22 },
        { label: "I gotta go...", value: "I gotta go...", trigger: 21}
      ]
    },
    {
      id: 21,
      message: "Maybe next time. Have an amazing day!",
      end: true
    },
    {
      id: 22,
      message: "You are awesome, you really get the power of reflection. So let's take a moment and capture some of your thoughts in your journal. Remember you can write anything here.",
      trigger: "reflection-am"
    },
    {
      id: "reflection-am",
      user: true,
      metadata: {
        validatorType: "string",
        journalQuestion: "Morning reflection:"
      },
      trigger: 24
    },
    {
      id: 24,
      message: "Nice!",
      trigger: 25
    },
    {
      id: 25,
      message: "Just one more thing before we wrap up today. Jot down a mantra or words of affirmation that you can hold for today.",
      trigger: 26
    },
    {
      id: 26, 
      message: "It can be even as simple as filling in the blank:",
      trigger: 27
    },
    {
      id: 27,
      message: "I can...",
      trigger: 28
    }, 
    {
      id: 28,
      message: "I will...",
      trigger: 29
    },
    {
      id: 29,
      message: "I am...",
      trigger: "mantra"
    },
    {
      id: "mantra",
      user: true,
      metadata: {
        validatorType: "string",
        journalQuestion: "Mantra:"
      },
      trigger: 31
    },
    {
      id: 31,
      message: "Amazing. You make this look easy, {userName}.",
      metadata: {
        username: true
      },
      trigger: 32
    }, 
    {
      id: 32,
      message: "Go get your day!",
      trigger: 33
    },
    {
      id: 33,
      options: [
        { label: "YEAH!", value: "YEAH!" },
        { label: "Can't wait to start!", value: "Can't wait to start!" },
        { label: "Thanks PynBot!", value: "Thanks PynBot!" }
      ],
      end: true
    }
  ]
)

Questionnaire.where(name: "Thought Challenge", 
  limit_type: 0,
  title: "Check-in").first_or_initialize.update!(steps: [
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
        { label: 'Frightened', value: 'Frightened', trigger: 3 },
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
        { label: 'Blessed', value: 'Blessed', trigger: 3 },
        { label: 'At Ease', value: 'At Ease', trigger: 3 },
        { label: 'Content', value: 'Content', trigger: 3 },
        { label: 'Fulfilled', value: 'Fulfilled', trigger: 3 },
        { label: 'Humble', value: 'Humble', trigger: 3 },
        { label: 'Secure', value: 'Secure', trigger: 3 },
        { label: 'Chill', value: 'Chill', trigger: 3 },
        { label: 'Grateful', value: 'Grateful', trigger: 3 },
        { label: 'Calm', value: 'Calm', trigger: 3 },
        { label: 'Satisfied', value: 'Satisfied', trigger: 3 },
        { label: 'Relaxed', value: 'Relaxed', trigger: 3 },
        { label: 'Carefree', value: 'Carefree', trigger: 3 },
        { label: 'Relieved', value: 'Relieved', trigger: 3 },
        { label: 'Restful', value: 'Restful', trigger: 3 },
        { label: 'Tranquil', value: 'Tranquil', trigger: 3 },
        { label: 'Serene', value: 'Serene', trigger: 3 }
      ]
    },
    {
      id: "hp-feeling",
      options: [
        { label: 'Pleasant', value: 'Pleasant', trigger: 3 },
        { label: 'Joyful', value: 'Joyful', trigger: 3 },
        { label: 'Proud', value: 'Proud', trigger: 3 },
        { label: 'Blissful', value: 'Blissful', trigger: 3 },
        { label: 'Energized', value: 'Energized', trigger: 3 },
        { label: 'Lively', value: 'Lively', trigger: 3 },
        { label: 'Optimistic', value: 'Optimistic', trigger: 3 },
        { label: 'Thrilled', value: 'Thrilled', trigger: 3 },
        { label: 'Hyper', value: 'Hyper', trigger: 3 },
        { label: 'Cheerful', value: 'Cheerful', trigger: 3 },
        { label: 'Inspired', value: 'Inspired', trigger: 3 },
        { label: 'Elated', value: 'Elated', trigger: 3 },
        { label: 'Surprised', value: 'Surprised', trigger: 3 },
        { label: 'Upbeat', value: 'Upbeat', trigger: 3 },
        { label: 'Motivated', value: 'Motivated', trigger: 3 },
        { label: 'Ecstatic', value: 'Ecstatic', trigger: 3 }
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

Questionnaire.where(name: "Evening Reflection", 
  limit_type: 1,
  title: "Evening Reflection").first_or_initialize.update(steps: [
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
      message: "You achieved {completedMIPCount} out of {totalMIPCount} Most Important Pyns today",
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
        validatorType: "string",
        journalQuestion: "What happened today:"
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
          {icon: "Emotion-E", color: "warningRed", value: 1, trigger: 8},
          {icon: "Emotion-D", color: "cautionYellow", value: 2, trigger: 8},
          {icon: "Emotion-C", color: "grey60", value: 3, trigger: 8},
          {icon: "Emotion-B", color: "successGreen", value: 4, trigger: 8},
          {icon: "Emotion-A", color: "finePine", value: 5, trigger: 8}
        ],
        journalQuestion: "My rating for today:"
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
        validatorType: "string",
        journalQuestion: "My three wins from today:"
      },
      trigger: 12
    },
    {
      id: 12, 
      message: "Way to go!  Would you like to continue?", 
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
        validatorType: "string",
        journalQuestion: "How I stepped out of my comfort zone:"
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
        validatorType: "string",
        journalQuestion: "Areas where I spent time that wasn't for my highest good:"
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
        validatorType: "string",
        journalQuestion: "One lesson learned today:"
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
        validatorType: "string",
        journalQuestion: "What could have made today better:"
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
        validatorType: "string",
        journalQuestion: "Gratitude"
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
      message: "{mipCheck}",
      metadata: {
        mip_check: {
          no_mips: "you haven’t picked your Most Important Pyns for tomorrow yet but here are your top priority Pyns. Select your Most Important Pyns for tomorrow:",
          has_mips: "these are your Most Important Pyns for tomorrow. Take a moment to review them:"
        }
      },
      trigger: "mips"
    },
    {
      id: "mips", 
      options: [],
      delay: 1500,
      metadata: {
        mip_selector: true,
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
        validatorType: "string",
        journalQuestion: "Evening reflection:"
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

Questionnaire.where(name: "Weekly Reflection", 
  limit_type: 2,
  title: "Weekly Reflection").first_or_initialize.update(steps: [
    {
      id: 1,
      options: [],
      metadata: {
        summary: "improvements",
        message: "Ideas to make my days better:"
      },
      trigger: 2
    },
    {
      id: 2,
      options: [],
      metadata: {
        summary: "highest-good",
        message: "Areas where I spent time that wasn't for my highest good:"
      },
      trigger: 3
    },
    {
      id: 3, 
      options: [],
      metadata: {
        summary: "wins",
        message: "My wins:"
      },
      trigger: 4
    },
    {
      id: 4,
      message: "What was my biggest win from this week?",
      trigger: "weekly-wins"
    },
    {
      id: "weekly-wins",
      user: true,
      metadata: {
        journalQuestion: "Biggest win from this week:"
      },
      trigger: 6
    },
    {
      id: 6,
      options: [],
      metadata: {
        summary: "lessons",
        message: "My lessons learned:"
      },
      trigger: 7
    },
    {
      id: 7,
      message: "What was my biggest lessons learned from this week?",
      trigger: "weekly-lessons"
    },
    {
      id: "weekly-lessons",
      user: true,
      metadata: {
        journalQuestion: "Biggest lesson learned from this week:"
      },
      trigger: 9
    },
    {
      id: 9,
      message: "What's my takeaway from the information above and what can I leverage from it going forward?",
      trigger: "weekly-takeaways"
    },
    {
      id: "weekly-takeaways",
      user: true,
      metadata: {
        journalQuestion: "My weekly takeaway and what I can take from this week that will help me in the future:"
      },
      trigger: 11
    },
    {
      id: 11,
      message: "Who had the greatest influence on me this week?  How did they influence me?",
      trigger: "influence"
    },
    {
      id: "influence",
      user: true,
      metadata: {
        journalQuestion: "Greatest influence this week:"
      },
      trigger: 13
    },
    {
      id: 13,
      options: [],
      metadata: {
        summary: "gratitude",
        message: {
          am: "Morning",
          pm: "Evening"
        }
      },
      trigger: 14
    },
    {
      id: 14,
      message: "What am I most grateful for this week?",
      trigger: "weekly-gratitudes"
    },
    {
      id: "weekly-gratitudes",
      user: true,
      metadata: {
        journalQuestion: "Gratitude:"
      },
      trigger: 16
    },
    {
      id: 16,
      options: [],
      metadata: {
        summary: "what-happened",
        message: "What happened this week:"
      },
      trigger: 17
    },
    {
      id: 17,
      message: "Looking back, what was the most significant thing that happened this week? (in one sentence)",
      trigger: "weekly-happenings"
    },
    {
      id: "weekly-happenings",
      user: true,
      metadata: {
        journalQuestion: "Significant thing that happened this week:"
      },
      trigger: 19
    },
    {
      id: 19,
      message: "How did this make me feel? (3-5 emotions)",
      trigger: "weekly-emotions"
    },
    {
      id: "weekly-emotions",
      user: true,
      metadata: {
        journalQuestion: "This made me feel:"
      },
      trigger: 21
    },
    {
      id: 21,
      message: "Why is this significant or imporant to me? (Keep asking why until you get to the root of it)",
      trigger: "weekly-importances"
    },
    {
      id: "weekly-importances",
      user: true,
      metadata: {
        journalQuestion: "It was significant to me because:"
      },
      trigger: 23
    },
    {
      id: 23,
      message: "What is happening next week that I need to account for in my plans?",
      trigger: "account-for"
    },
    {
      id: "account-for",
      user: true,
      metadata: {
        journalQuestion: "What I have to account for in the next week:"
      },
      trigger: 25
    },
    {
      id: 25,
      message: "What could stand in the way?",
      trigger: "stand"
    },
    {
      id: "stand",
      user: true,
      metadata: {
        journalQuestion: "What could stand in the way:"
      },
      trigger: 27
    },
    {
      id: 27, 
      message: "How can I overcome this?",
      trigger: "overcome"
    },
    {
      id: "overcome",
      user: true,
      metadata: {
        journalQuestion: "How I will overcome this:"
      },
      trigger: 29
    },
    {
      id: 29,
      message: "Weekly Reflection is complete!",
      end: true
    }
  ]
)

Questionnaire.where(name: "Monthly Reflection", 
  limit_type: 3,
  title: "Monthly Reflection").first_or_initialize.update(steps: [
    {
      id: 1,
      options: [],
      metadata: {
        summary: "improvements",
        message: "Ideas to make my days better:"
      },
      trigger: 2
    },
    {
      id: 2,
      options: [],
      metadata: {
        summary: "highest-good",
        message: "Areas where I spent time that wasn't for my highest good:"
      },
      trigger: 3
    },
    {
      id: 3, 
      options: [],
      metadata: {
        summary: "wins",
        message: "My wins:"
      },
      trigger: 4
    },
    {
      id: 4,
      message: "What was my biggest win from this week?",
      trigger: "weekly-wins"
    },
    {
      id: "weekly-wins",
      user: true,
      metadata: {
        journalQuestion: "Biggest win from this week:"
      },
      trigger: 6
    },
    {
      id: 6, 
      options: [],
      metadata: {
        summary: "weekly-wins",
        message: "My wins from this month:"
      },
      trigger: 7
    },
    {
      id: 7,
      message: "What was my biggest win from this month?",
      trigger: "monthly-wins"
    },
    {
      id: "monthly-wins",
      user: true,
      metadata: {
        journalQuestion: "Biggest win from this month:"
      },
      trigger: 9
    },
    {
      id: 9,
      options: [],
      metadata: {
        summary: "lessons",
        message: "My lessons learned:"
      },
      trigger: 10
    },
    {
      id: 10,
      message: "What was my biggest lessons learned from this week?",
      trigger: "weekly-lessons"
    },
    {
      id: "weekly-lessons",
      user: true,
      metadata: {
        journalQuestion: "Biggest lesson learned from this week:"
      },
      trigger: 12
    },
    {
      id: 12,
      options: [],
      metadata: {
        summary: "weekly-lessons",
        message: "My biggest lessons learned this month:"
      },
      trigger: 13
    },
    {
      id: 13,
      message: "What was my biggest lesson learned from this month?",
      trigger: "monthly-lessons",
    },
    {
      id: "monthly-lessons",
      user: true,
      metadata: {
        journalQuestion: "Biggest lesson learned from this month:"
      },
      trigger: 15
    },
    {
      id: 15,
      message: "What's my takeaway from the information above and what can I leverage from it going forward?",
      trigger: "weekly-takeaways"
    },
    {
      id: "weekly-takeaways",
      user: true,
      metadata: {
        journalQuestion: "My weekly takeaway and what I can take from this week that will help me in the future:"
      },
      trigger: 17
    },
    {
      id: 17,
      options: [],
      metadata: {
        summary: "weekly-takeaways",
        message: "My takeaways from this month:"
      },
      trigger: 18
    },
    {
      id: 18,
      message: "What's my biggest takeaway this month?",
      trigger: "monthly-takeaways"
    },
    {
      id: "monthly-takeaways",
      user: true,
      metadata: {
        journalQuestion: "My biggest monthly takeaway:"
      },
      trigger: 20
    },
    {
      id: 20,
      message: "Who had the greatest influence on me this week?  How did they influence me?",
      trigger: "influence"
    },
    {
      id: "influence",
      user: true,
      metadata: {
        journalQuestion: "Greatest influence this week:"
      },
      trigger: 22
    },
    {
      id: 22,
      options: [],
      metadata: {
        summary: "gratitude",
        message: {
          am: "Morning",
          pm: "Evening"
        }
      },
      trigger: 23
    },
    {
      id: 23,
      message: "What am I most grateful for this week?",
      trigger: "weekly-gratitudes"
    },
    {
      id: "weekly-gratitudes",
      user: true,
      metadata: {
        journalQuestion: "Weekly Gratitude:"
      },
      trigger: 25
    },
    {
      id: 25,
      options: [],
      metadata: {
        summary: "weekly-gratitudes",
        message: "My gratitude from this month:"
      },
      trigger: 26
    },
    {
      id: 26,
      message: "What am I most grateful for this month?",
      trigger: "monthly-gratitudes"
    },
    {
      id: "monthly-gratitudes",
      user: true,
      metadata: {
        journalQuestion: "Monthly Gratitude:"
      },
      trigger: 27
    },
    {
      id: 27,
      options: [],
      metadata: {
        summary: "what-happened",
        message: "What happened this week:"
      },
      trigger: 28
    },
    {
      id: 28,
      message: "Looking back, what was the most significant thing that happened this week? (in one sentence)",
      trigger: "weekly-happenings"
    },
    {
      id: "weekly-happenings",
      user: true,
      metadata: {
        journalQuestion: "Significant thing that happened this week:"
      },
      trigger: 30
    },
    {
      id: 30,
      message: "How did this make me feel? (3-5 emotions)",
      trigger: "weekly-emotions"
    },
    {
      id: "weekly-emotions",
      user: true,
      metadata: {
        journalQuestion: "This made me feel:"
      },
      trigger: 32
    },
    {
      id: 32,
      message: "Why is this significant or imporant to me? (Keep asking why until you get to the root of it)",
      trigger: "weekly-importances"
    },
    {
      id: "weekly-importances",
      user: true,
      metadata: {
        journalQuestion: "It was significant to me because:"
      },
      trigger: 34
    },
    {
      id: 34,
      message: "What is the one imporant thing that happened this month that I want to share?",
      trigger: "monthly-happenings"
    },
    {
      id: "monthly-happenings",
      user: true,
      metadata: {
        journalQuestion: "Most important thing that happened this month that I want to share:"
      },
      trigger: 36
    },
    {
      id: 36,
      message: "What is happening next week that I need to account for in my plans?",
      trigger: "account-for"
    },
    {
      id: "account-for",
      user: true,
      metadata: {
        journalQuestion: "What I have to account for in the next week:"
      },
      trigger: 38
    },
    {
      id: 38,
      message: "What could stand in the way?",
      trigger: "stand"
    },
    {
      id: "stand",
      user: true,
      metadata: {
        journalQuestion: "What could stand in the way:"
      },
      trigger: 40
    },
    {
      id: 40, 
      message: "How can I overcome this?",
      trigger: "overcome"
    },
    {
      id: "overcome",
      user: true,
      metadata: {
        journalQuestion: "How I will overcome this:"
      },
      trigger: 42
    },
    {
      id: 42,
      message: "Monthly Reflection is complete!",
      end: true
    }
  ]
)

if Rails.env.development?
  7.times.each do |number|
    sunny = User.find_by_email("sunny@laterolabs.com")
    chris = User.find_by_email("christopher@laterolabs.com")
    kyle = User.find_by_email("kyle@laterolabs.com")
    mani = User.find_by_email("mani@laterolabs.com")
    
    questionnaire = Questionnaire.find_by_name("Evening Reflection")
  
    QuestionnaireAttempt.create!(questionnaire_id: questionnaire.id, completed_at: Time.now - 2.day - number.day, emotion_score: rand(1..5), user: sunny)
    QuestionnaireAttempt.create!(questionnaire_id: questionnaire.id, completed_at: Time.now - 2.day - number.day, emotion_score: rand(1..5), user: chris)
    QuestionnaireAttempt.create!(questionnaire_id: questionnaire.id, completed_at: Time.now - 2.day - number.day, emotion_score: rand(1..5), user: kyle)
    QuestionnaireAttempt.create!(questionnaire_id: questionnaire.id, completed_at: Time.now - 2.day - number.day, emotion_score: rand(1..5), user: mani)
  end
end