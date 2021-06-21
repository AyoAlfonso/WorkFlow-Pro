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

#maintain record as there will be questionnaire attempts related to this, but remove all steps.  Eventually remove this altogether.
#all steps will be stored in questionnaire attempt
Questionnaire.where(name: "Thought Challenge", 
  limit_type: 0,
  title: "Check-in").first_or_initialize.update!(steps: [
  ]
)

Questionnaire.where(name: "Evening Reflection", 
  limit_type: 1,
  title: "Evening Reflection").first_or_initialize.update(steps: [{"id":1,"message":"Good evening, {userName}! Great to see you.","metadata":{"username":true},"trigger":2},{"id":2,"message":"You achieved {completedMIPCount} out of {totalMIPCount} Most Important Pyns today","metadata":{"pynCount":true},"trigger":5},{"id":5,"message":"What do you want to work on this evening?","metadata":{"username":true},"trigger":"checkpoint1"},{"id":"checkpoint1","options":[{"value":"I want to reflect on my day and plan","label":"I want to reflect on my day and plan","trigger":8},{"value":"Let's just plan for tomorrow","label":"Let's just plan for tomorrow","trigger":32},{"value":"Nothing for today, just wanted to check in","label":"Nothing for today, just wanted to check in","trigger":"end-early"}]},{"id":"end-early","message":"Thank you for showing up {userName}! Checking in is a great first step in reflecting on your day but by going more in depth with your reflection and planning you can learn from each day, become more self-aware, and set yourself up for success. I'm looking forward to talking with you tomorrow!","metadata":{"username":true},"trigger":7},{"id":7,"options":[{"value":"Thanks PynBot, see you tomorrow!","label":"Thanks, PynBot!"}],"end":true},{"id":8,"message":"Take a moment to think over your day. Reliving and capturing what you did today will help you better understand what worked well and what didn't.","trigger":"checkpoint2"},{"id":"checkpoint2","options":[{"value":"Let's capture today","label":"Let's capture today","trigger":9},{"value":"Skip","label":"Skip","trigger":11}]},{"id":9,"message":"Capture what you did today:","trigger":"what-happened"},{"id":"what-happened","user":true,"metadata":{"validatorType":"string","journalQuestion":"What happened today:"},"trigger":10},{"id":10,"message":"Cool!","trigger":11},{"id":11,"message":"It is important to acknowledge our wins, even if we think they are no big deal. Can you tell me what were your top three wins for today?","delay":1500,"trigger":"wins"},{"id":"wins","user":true,"metadata":{"validatorType":"string","journalQuestion":"My three wins from today:"},"trigger":12},{"id":12,"message":"Way to go, remember it's important to acknowledge-even celebrate these!  Did you step out of your comfort zone today?","trigger":13},{"id":13,"options":[{"value":"Yes","label":"Yes","trigger":16},{"value":"No","label":"No","trigger":15},{"value":"Skip","label":"Take me straight to planning tomorrow","trigger":14}]},{"id":14,"message":"No worries!","trigger":32},{"id":15,"message":"The magic happens when you step out of your comfort zone. Challenge yourself tomorrow to push past your comfort zone.","trigger":18},{"id":16,"message":"Awesome, what did you do?","trigger":"comfort-zone"},{"id":"comfort-zone","user":true,"metadata":{"validatorType":"string","journalQuestion":"How I stepped out of my comfort zone:"},"trigger":17},{"id":17,"message":"That's great {userName}! Remember growth occurs outside of our comfort zone. I am proud of you for leaning in!","metadata":{"username":true},"delay":1500,"trigger":18},{"id":18,"message":"Now, reflecting on your day and thinking about how you spent your time, where would you say you spent time that wasn't for your highest good?","delay":2000,"trigger":"highest-good"},{"id":"highest-good","user":true,"metadata":{"validatorType":"string","journalQuestion":"Areas where I spent time that wasn't for my highest good:"},"trigger":20},{"id":20,"message":"Got it, Thanks. Recognizing these things is a start to taking control over them.","trigger":21},{"id":21,"message":"So {userName}, I'm sure a lot came your way today; What was one lesson you learned today that you would like to remember?","metadata":{"username":true},"trigger":"lessons"},{"id":"lessons","user":true,"metadata":{"validatorType":"string","journalQuestion":"One lesson learned today:"},"trigger":23},{"id":23,"message":"We need to keep building on these learnings and you will see them again in your Weekly Planning.","delay":1500,"trigger":24},{"id":24,"message":"Okay, now let's shift a little.","delay":1500,"trigger":25},{"id":25,"message":"Coming from a positive place, what is the one thing you could have done to make today even better?","delay":1500,"trigger":"improvements"},{"id":"improvements","user":true,"metadata":{"validatorType":"string","journalQuestion":"What could have made today better:"},"trigger":27},{"id":27,"message":"Awareness proceeds choice. Recognizing these areas may help you navigate them better in the future. You've had quite the day, {userName}!","metadata":{"username":true},"trigger":28},{"id":28,"options":[{"value":"Yeah, it was","label":"Yeah, it was","trigger":29},{"value":"It was okay","label":"It was okay","trigger":29},{"value":"No big deal","label":"No big deal","trigger":29}]},{"id":29,"message":"So before we shift to thinking about tomorrow, what are you most grateful for today?","trigger":"gratitude-pm"},{"id":"gratitude-pm","user":true,"metadata":{"validatorType":"string","journalQuestion":"Gratitude"},"trigger":31},{"id":31,"message":"Nice :O)","trigger":32},{"id":32,"message":"I know you know this {userName}; A good tomorrow starts right now. So I want you to think about what you need to do tomorrow.","metadata":{"username":true},"delay":1500,"trigger":33},{"id":33,"message":"{mipCheck}","metadata":{"mip_check":{"no_mips":"you haven't picked your Most Important Pyns for tomorrow yet but here are your top priority Pyns. Select your Most Important Pyns for tomorrow:","has_mips":"these are your Most Important Pyns for tomorrow. Take a moment to review them:"}},"delay":3000,"trigger":"mips"},{"id":"mips","options":[],"delay":1500,"metadata":{"mip_selector":true,"trigger":34}},{"id":34,"message":"Fantastic, you have planted the seeds for a great day!","trigger":35},{"id":35,"options":[{"value":"Yeah, PynBot!","label":"Yeah, PynBot!","trigger":36}]},{"id":36,"message":"Before you go, it is always a good practice to stop and reflect on the day. This is where you can write freely.","delay":1500,"trigger":37},{"id":37,"message":"Is there anything you would like to capture or reflect upon your day?","delay":1500,"trigger":38},{"id":38,"options":[{"value":"Yes","label":"Yes","trigger":41},{"value":"No","label":"No","trigger":39}]},{"id":39,"message":"Thank you for showing up {userName}, I'm looking forward to talking with you tomorrow!","metadata":{"username":true},"trigger":40},{"id":40,"options":[{"value":"Thanks PynBot, see you tomorrow!","label":"Thanks, PynBot!"}],"end":true},{"id":41,"message":"Great, this is your space--go for it!","trigger":"reflection"},{"id":"reflection","user":true,"metadata":{"validatorType":"string","journalQuestion":"Evening reflection:"},"trigger":43},{"id":43,"message":"Your future self will value that! Have a great evening {userName}, I'm excited to talk with you tomorrow morning.","metadata":{"username":true},"trigger":44},{"id":44,"options":[{"value":"Thanks, PynBot!","label":"Thanks, PynBot!"}],"end":true}]
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
        message: "What happened this week:",
        forumOverrideTrigger: 17
      },
      trigger: 23
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
  limit_type: 0,
  title: "Monthly Reflection").first_or_initialize.update(steps: [
    {
      id: 1,
      options: [],
      metadata: {
        summary: "improvements",
        message: "Ideas to make my days better from this month:"
      },
      trigger: 2
    },
    {
      id: 2,
      options: [],
      metadata: {
        summary: "highest-good",
        message: "Areas where I spent time that wasn't for my highest good from this month:"
      },
      trigger: 3
    },
    {
      id: 3, 
      options: [],
      metadata: {
        summary: "wins",
        message: "My wins from this week:"
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
        message: "My lessons learned from this week:"
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
      message: "Who had the greatest influence on me this month?  How did they influence me?",
      trigger: "influence"
    },
    {
      id: "influence",
      user: true,
      metadata: {
        journalQuestion: "Greatest influence this month:"
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
        message: "What happened this week:",
        forumOverrideTrigger: 28
      },
      trigger: 37
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
      options: [],
      metadata: {
        summary: "weekly-happenings",
        message: "These are the important things that happened this month:"
      },
      trigger: 35
    },
    {
      id: 35,
      options: [],
      metadata: {
        summary: "weekly-emotions",
        message: "These made me feel:"
      },
      trigger: 36
    },
    {
      id: 36,
      options: [],
      metadata: {
        summary: "weekly-importances",
        message: "They were significant to me because:"
      },
      trigger: 37
    },
    {
      id: 37,
      message: "What is the one imporant thing that happened this month that I want to share?",
      trigger: "monthly-happenings"
    },
    {
      id: "monthly-happenings",
      user: true,
      metadata: {
        journalQuestion: "Most important thing that happened this month that I want to share:"
      },
      trigger: 39
    },
    {
      id: 39,
      message: "What is happening next week that I need to account for in my plans?",
      trigger: "account-for"
    },
    {
      id: "account-for",
      user: true,
      metadata: {
        journalQuestion: "What I have to account for in the next week:"
      },
      trigger: 41
    },
    {
      id: 41,
      message: "What could stand in the way?",
      trigger: "stand"
    },
    {
      id: "stand",
      user: true,
      metadata: {
        journalQuestion: "What could stand in the way:"
      },
      trigger: 43
    },
    {
      id: 43, 
      message: "How can I overcome this?",
      trigger: "overcome"
    },
    {
      id: "overcome",
      user: true,
      metadata: {
        journalQuestion: "How I will overcome this:"
      },
      trigger: 45
    },
    {
      id: 45,
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