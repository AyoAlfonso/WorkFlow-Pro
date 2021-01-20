mt1 = MeetingTemplate.where(meeting_type: :team_weekly).first_or_create(
  meeting_type: :team_weekly,
  name: "Weekly Meeting",
  steps_attributes: [
    {
      order_index: 0,
      name: "How Are You Feeling?",
      step_type: :image,
      duration: 5,
      instructions: "Go beyond the obvious to identify exactly what you're feeling"
    },
    {
      order_index: 1,
      name: "Conversation Starter",
      step_type: :component,
      duration: 5,
      instructions: "Use the prompt below and have a conversation around the topic as a team.",
      component_to_render: "ConversationStarter"
    },
    {
      order_index: 2,
      name: "Team Pulse",
      step_type: :component,
      duration: 5,
      instructions: "Review the team pulse for the past 7 days.",
      component_to_render: "TeamPulse"
    },
    {
      order_index: 3,
      name: "Updates",
      step_type: :description_text,
      duration: 5,
      instructions: "Provide personal or work-related updates. You can also use this time to give shoutouts."
      description_text: "Do you have anything to share with the team? It can be personal, about work, or simply a shoutout!"
    },
    {
      order_index: 4,
      name: "Dashboard",
      step_type: :embedded_link,
      duration: 5,
      instructions: "Review the Key Metrics from this week.",
      link_embed: "https://public.datapine.com/#board/pGEtHxIopXJN4hJmpqlN1",
      override_key: 'weekly_meeting_dashboard_link_embed'
    },
    {
      order_index: 5,
      name: "Goals",
      step_type: :component,
      duration: 5,
      instructions: "Review Goals and Objectives. Inspect Objectives that are not on track and need attention.",
      component_to_render: "Goals"
    },
    {
      order_index: 6,
      name: "Pyns",
      step_type: :component,
      duration: 5,
      instructions: "Review Pyns list and discuss why they weren’t completed if there are any items outstanding.",
      component_to_render: "KeyActivities"
    },
    {
      order_index: 7,
      name: "Issues",
      step_type: :component,
      duration: 30,
      instructions: "Review the Issues list and prioritize as a team to select the top 3 items. Discuss them one by one and move onto the next item if you have addressed all 3 items in the allotted time.",
      component_to_render: "Issues"
    },
    {
      order_index: 8,
      name: "Recap",
      step_type: :component,
      duration: 5,
      instructions: "Quick recap of today’s meeting. Review the newly added Pyns and make sure everyone knows what they’re responsible for.",
      component_to_render: "Recap"
    },
    {
      order_index: 9,
      name: "Meeting Rating",
      step_type: :component,
      duration: 5,
      instructions: "Rate the meeting out of 5 in terms of how effective it was in helping you move closer to Goals.",
      component_to_render: "MeetingRating"
    },
  ]
)

step1 = mt1.steps.where(name: "How Are You Feeling?").first
step1.image.attach(io: File.open("app/assets/images/mood-board.png"), filename: "mood-board.png", content_type: 'image/png') if step1.present? 

step2 = mt1.steps.where(name: "Updates").first
step2.image.attach(io: File.open("app/assets/images/updates.png"), filename: "updates.png", content_type: 'image/png') if step2.present?


mt2 = MeetingTemplate.where(meeting_type: :personal_weekly, name: "Weekly Planning").first_or_create(
  meeting_type: :personal_weekly,
  name: "Weekly Planning",
  steps_attributes: [
    {
      order_index: 0,
      name: "Personal Goals",
      step_type: :component,
      instructions: "Review the Foundational Four and what the Goals are.",
      component_to_render: "PersonalGoals",
      duration: 5
    },
    {
      order_index: 1,
      name: "Weekly Reflection",
      step_type: :component,
      instructions: "Review your performance from this week and use the prompts to reflect on this week.",
      component_to_render: "WeeklyReflection",
      duration: 5
    },
    {
      order_index: 2,
      name: "Milestones",
      step_type: :component,
      instructions: "Review your list of upcoming Milestones. What must you accomplish this week to drive your Milestones? Create Pyns for each one.",
      component_to_render: "Milestones",
      duration: 5
    },
    {
      order_index: 3,
      name: "Personal Pyns",
      step_type: :component,
      instructions: "What else must you accomplish this week? Add new Pyns or move them from your Master List to the Weekly List. Review your email and calendar to add anything else you need to account for this week.",
      component_to_render: "PersonalKeyActivities",
      duration: 5
    },
    {
      order_index: 4,
      name: "Create My Day",
      step_type: :component,
      instructions: "What are the top 3 things you must accomplish tomorrow? Move them over to Today’s Priority.",
      component_to_render: "DailyPlanning",
      duration: 5
    }
  ],
)

mt3 = MeetingTemplate.where(meeting_type: :forum_monthly, name: "Forum Monthly").first_or_create(
  meeting_type: :forum_monthly,
  name: "Forum Monthly",
  steps_attributes: [
    {
      order_index: 0,
      name: "One Word Opener",
      step_type: :image,
      duration: 5,
      instructions: "Find an emotion that describes how you are feeling right now",
    },
    {
      order_index: 1,
      name: "Confidentiality Reminder",
      step_type: :description_text,
      duration: 5,
      instructions: "Use the promport and discuss as a group",
      description_text: "Any near misses with respect to forum members' confidentiality?",
    },
    {
      order_index: 2,
      name: "Clear the Air",
      step_type: :description_text,
      duration: 5,
      instructions: "Provide personal or work-related updates. You can also use this time to give shout-outs.",
      description_text: "Is there anything that needs to be said so that you can be an active, engaged participant in today's meeting?",
    },
    {
      order_index: 3,
      name: "Conversation Starter",
      step_type: :description_text,
      duration: 5,
      instructions: "Use the prompt below and have a conversation as a team.",
      component_to_render: "What's the most interesting you've read lately?",
    },
    {
      order_index: 4,
      name: "Pulse",
      step_type: :component,
      duration: 5,
      instructions: "Review the team pulse form the past week.",
      component_to_render: "TeamPulse",
    },
    {
      order_index: 5,
      name: "Updates",
      step_type: :description_text,
      duration: 20,
      instructions: "Share your monthly 5% reflection and other significant updates with the group",
      description_text: "Share your 5% monthly reflection and any other significant or important updates with the group (3-5 minutes each).",
    },
    {
      order_index: 6,
      name: "Review Parking Lot",
      step_type: :component,
      duration: 10,
      instructions: "Review the parking lot; is there anything you need to add based on the conversations you've had?",
      component_to_render: "ParkingLot",
    },
    {
      order_index: 7,
      name: "Exploration Topic",
      step_type: :component,
      duration: 60,
      instructions: "The scheduled exploration topic for this month.",
      component_to_render: "ExplorationTopic",
    },
    {
      order_index: 8,
      name: "Parking Lot",
      step_type: :component,
      duration: 60,
      instructions: "Use the time remaining to tackle as many scheduled/non-scheduled parking lot topics as you can, on the basis of priority.",
      component_to_render: "ParkingLot",
    },
    {
      order_index: 9,
      name: "Closing Rituals",
      step_type: :description_text,
      duration: 10,
      instructions: "Follow the instructions for closing rituals.",
      description_text_conent: "- What is public knowledge? - Is there anything left unsaid? - What worked and how could we have made it even better? - Confirm next meeting. - Appreciation and committments.",
    },
    {
      order_index: 10,
      name: "Meeting Rating",
      step_type: :component,
      duration: 5,
      instructions: "Rate the meeting out of 7. How did we run today's meeting?",
      component_to_render: "MeetingRating",
    },
  ]
)

step1 = mt3.steps.where(name: "One Word Opener").first
step1.image.attach(io: File.open("app/assets/images/mood-board.png"), filename: "mood-board.png", content_type: 'image/png') if step1.present? 
