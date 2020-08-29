mt1 = MeetingTemplate.where(meeting_type: :team_weekly).first_or_create(
  meeting_type: :team_weekly,
  name: "Weekly Meeting",
  duration: 90,
  #description: "Weekly Sync 75-minute meeting for the leadership team. This meeting drives accountability and allows the team to use their collective intelligence to remove any roadblocks impeding progress."
  steps_attributes: [
    {
      order_index: 0,
      name: "How Are You Feeling?",
      step_type: :image,
      duration: 5,
      # section_name: "Section",
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
      step_type: :image,
      duration: 5,
      instructions: "Provide personal or work-related updates. You can also use this time to give shoutouts."
      #"Do you have anything to share with the team? It can be personal, about work, or simply a shoutout!"
    },
    {
      order_index: 4,
      name: "Dashboard",
      step_type: :embedded_link,
      duration: 5,
      instructions: "Review the Key Metrics from this week.",
      link_embed: "https://public.datapine.com/#board/pGEtHxIopXJN4hJmpqlN1"
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
      name: "Key Activities",
      step_type: :component,
      duration: 5,
      instructions: "Review Key Activites list and discuss why they weren’t completed if there are any items outstanding.",
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
      instructions: "Quick recap of today’s meeting. Review the newly added Key Activites and make sure everyone knows what they’re responsible for.",
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

mt1.steps.where(name: "How Are You Feeling?").first.image.attach(io: File.open("app/assets/images/mood-board.png"), filename: "mood-board.png", content_type: 'image/png')
mt1.steps.where(name: "Updates").first.image.attach(io: File.open("app/assets/images/updates.png"), filename: "mood-board.png", content_type: 'image/png')


mt2 = MeetingTemplate.where(meeting_type: :personal_weekly, name: "Weekly Personal Planning").first_or_create(
  meeting_type: :personal_weekly,
  name: "Weekly Personal Planning",
  #description: ""
  steps_attributes: [
    {
      order_index: 0,
      name: "Personal Goals",
      step_type: :component,
      instructions: "Review the Core Four and what the Goals are.",
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
      instructions: "Review your list of upcoming Milestones. What must you accomplish this week to drive your Milestones? Create Key Activities for each one.",
      component_to_render: "Milestones",
      duration: 5
    },
    {
      order_index: 3,
      name: "Personal Key Activities",
      step_type: :component,
      instructions: "What else must you accomplish this week? Add new Key Activities or move them from your Master List to the Weekly List. Review your email and calendar to add anything else you need to account for this week.",
      component_to_render: "PersonalKeyActivities",
      duration: 5
    },
    {
      order_index: 4,
      name: "Daily Planning",
      step_type: :component,
      instructions: "What are the top 3 things you must accomplish tomorrow? Move them over to Today’s Priority.",
      component_to_render: "DailyPlanning",
      duration: 5
    }
  ],

)