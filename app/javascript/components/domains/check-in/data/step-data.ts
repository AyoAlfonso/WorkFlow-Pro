export interface StepCardProps {
  iconName: string;
  name: string;
  description: string;
  instructions?: string;
  iconColor: string;
  question?: string;
  variant?: string;
  stepType: string;
}

export const questionsArray: Array<StepCardProps> = [
  {
    iconName: "Open-Ended",
    iconColor: "primary100",
    name: "Open-ended",
    stepType: "component",
    description: "Ask users to enter ansers with any kind of written text.",
    instructions: "Type your response to the prompt in the input field.",
    question: "What are you working on?",
  },
  {
    iconName: "Numerical",
    iconColor: "dimPurple",
    stepType: "component",
    name: "Numeric",
    description: "Users can respond using numbers only.",
    instructions: "Provide your rating based on the prompt on a 1-10 scale.",
    question: "How productive were you today?",
  },
  {
    iconName: "Sentiment",
    iconColor: "yellowSea",
    stepType: "component",
    name: "Sentiment",
    description: "Users can select from a 5 point sentiment scale",
    instructions: "Provide your sentiment rating based on a 1-5 scale.",
    question: "How was your day?",
  },
  {
    iconName: "Agreement-Scale",
    iconColor: "progressGreen",
    stepType: "component",
    name: "Agreement Scale",
    description: "Users can respond on a scale between strongly agree and disagree.",
    instructions: "Provide your agreement rating based on a 1-5 scale.",
    question: "My work gives me a sense of purpose?",
  },
  {
    iconName: "YesNo",
    iconColor: "cavier",
    stepType: "component",
    name: "Yes/No",
    description: "Ask a simple yes or no question.",
    instructions: "Select yes or no based on your response to the prompt.",
    question: "Is anything blocking you?",
  },
];

export const widgetArray: Array<StepCardProps> = [
  {
    iconName: "Initiative",
    iconColor: "mipBlue",
    stepType: "component",
    name: "Initiatives",
    instructions: "Provide status update on your Initiatives.",
    description: "Get updates on users' initiatives using KRs or Milestones.",
  },
  {
    iconName: "New-Goals",
    iconColor: "primary100",
    stepType: "component",
    name: "Objectives",
    instructions: "Review the Foundational Four, Company Goals, and Personal Goals.",
    variant: "Objectives",
    description: "Overview of Foundational Four and Company and Personal Objectives.",
  },
  {
    iconName: "Tasks",
    iconColor: "progressGreen",
    stepType: "component",
    name: "ToDos",
    description: "Pick from any of the ToDo components to plan your day/week.",
  },
  {
    iconName: "Alert",
    iconColor: "yellowSea",
    stepType: "component",
    name: "Issues",
    variant: "My Issues",
    description: "Keep track of issues and roadblocks that are hindering progress",
  },
  {
    iconName: "Scorecard_New",
    iconColor: "primary100",
    stepType: "component",
    name: "KPIs",
    variant: "KPIs",
    instructions: "Provide an update on your KPIs.",
    description: "Updates on KPIs owned by the user",
  },
  {
    iconName: "Habits",
    iconColor: "cavier",
    stepType: "component",
    name: "Habits",
    variant: "My Habits",
    instructions: "Review and update your progress on your Habits.",
    description: "Reviewing and updating habits and streaks.",
  },
  {
    iconName: "Conversation-Starter",
    iconColor: "dimPurple",
    stepType: "component",
    name: "Conversation Starter",
    variant: "Conversation Starter",
    instructions: "Use the random prompt generated to start a conversation.",
    description: "A random prompt that makes it easy to share fun facts about yourself.",
  },
  {
    iconName: "Stats",
    iconColor: "neonLemon",
    stepType: "component",
    name: "Weekly Review",
    variant: "Weekly Review",
    instructions:
      "Review your performance from this week and consider what you can learn from it moving forward.",
    description: "Summary of weekly activities and progress",
  },
  {
    iconName: "PM-Check-in",
    iconColor: "mipBlue",
    stepType: "component",
    name: "Evening Reflection",
    variant: "Evening Reflection",
    instructions: "Chat with PynBot and use the prompts to complete your Evening Reflection.",
    description: "Series of questions for a personal reflection at the end of each day",
  },
  {
    iconName: "Weekly-Milestones",
    iconColor: "dimPurple",
    stepType: "component",
    name: "Weekly Reflection",
    variant: "Weekly Reflection",
    instructions:
      "Chat with PynBot and use the prompts and insights from Evening Reflections to complete your Weekly Reflection.",
    description: "Series of questions for a personal reflection at the end of each week",
  },
  {
    iconName: "EoM",
    iconColor: "cavier",
    stepType: "component",
    name: "Monthly Reflection",
    variant: "Monthly Reflection",
    instructions:
      "Chat with PynBot and use the prompts and insights from Weekly Reflections to complete your Monthly Reflection.",
    description: "Series of questions for a personal reflection at the end of each month",
  },
];

export const getIconName = (stepType) => {
  switch (stepType) {
    case "Open-ended":
      return "Open-Ended";
    case "Numeric":
      return "Numerical";
    case "Sentiment":
      return "Sentiment"
    case "Agreement Scale":
      return "Agreement-Scale"
    case "Yes/No":
      return "YesNo"
    case "Intiatives":
      return "Initiative";
    case "Objectives":
      return "New-Goals";
    case "ToDos":
      return "Tasks"
    case "Issues":
      return "Alert"
    case "Topics":
      return "Alert";
    case "KPIs":
      return "Scorecard_New";
    case "Habits":
      return "Habits"
    case "Conversation Starter":
      return "Conversation-Starter"
    case "Weekly Review":
      return "Stats"
    case "Evening Reflection":
      return "PM-Check-in"
    case "Weekly Reflection":
      return "Weekly-Milestones"
    case "Monthly Reflection":
      return "EoM"
    default:
      return ""
  }
}