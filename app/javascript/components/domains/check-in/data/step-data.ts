export interface StepCardProps {
  iconName: string;
  stepName: string;
  description: string;
  iconColor: string;
  question?: string;
  variant?: string;
}

export const questionsArray: Array<StepCardProps> = [
  {
    iconName: "Open-Ended",
    iconColor: "primary100",
    stepName: "Open-ended",
    description: "Ask users to enter ansers with any kind of written text.",
    question: "What are you working on?",
  },
  {
    iconName: "Numerical",
    iconColor: "dimPurple",
    stepName: "Numeric",
    description: "Users can respond using numbers only.",
    question: "How productive were you today?",
  },
  {
    iconName: "Sentiment",
    iconColor: "yellowSea",
    stepName: "Sentiment",
    description: "Users can select from a 5 point sentiment scale",
    question: "How was your day?",
  },
  {
    iconName: "Agreement-Scale",
    iconColor: "progressGreen",
    stepName: "Agreement Scale",
    description: "Users can respond on a scale between strongly agree and disagree.",
    question: "My work gives me a sense of purpose?",
  },
  {
    iconName: "YesNo",
    iconColor: "cavier",
    stepName: "Yes/No",
    description: "Ask a simple yes or no question.",
    question: "Is anything blocking you?",
  },
];

export const widgetArray: Array<StepCardProps> = [
  {
    iconName: "Initiative",
    iconColor: "mipBlue",
    stepName: "Initiatives",
    description: "Get updates on users' initiatives using KRs or Milestones.",
  },
  {
    iconName: "New-Goals",
    iconColor: "primary100",
    stepName: "Objectives",
    variant: "Objectives",
    description: "Overview of Foundational Four and Company and Personal Objectives.",
  },
  {
    iconName: "Tasks",
    iconColor: "progressGreen",
    stepName: "ToDos",
    description: "Pick from any of the ToDo components to plan your day/week.",
  },
  {
    iconName: "Alert",
    iconColor: "yellowSea",
    stepName: "Issues",
    variant: "My Issues",
    description: "Keep track of issues and roadblocks that are hindering progress",
  },
  {
    iconName: "Scorecard_New",
    iconColor: "primary100",
    stepName: "KPIs",
    variant: "KPIs",
    description: "Updates on KPIs owned by the user",
  },
  {
    iconName: "Habits",
    iconColor: "cavier",
    stepName: "Habits",
    variant: "My Habits",
    description: "Reviewing and updating habits and streaks.",
  },
  {
    iconName: "Conversation-Starter",
    iconColor: "dimPurple",
    stepName: "Conversation Starter",
    variant: "Conversation Starter",
    description: "A random prompt that makes it easy to share fun facts about yourself.",
  },
  {
    iconName: "Stats",
    iconColor: "neonLemon",
    stepName: "Weekly Review",
    variant: "Weekly Review",
    description: "Summary of weekly activities and progress",
  },
  {
    iconName: "PM-Check-in",
    iconColor: "mipBlue",
    stepName: "Evening Reflection",
    variant: "Evening Reflection",
    description: "Series of questions for a personal reflection at the end of each day",
  },
  {
    iconName: "Weekly-Milestones",
    iconColor: "dimPurple",
    stepName: "Weekly Reflection",
    variant: "Weekly Reflection",
    description: "Series of questions for a personal reflection at the end of each week",
  },
  {
    iconName: "EoM",
    iconColor: "cavier",
    stepName: "Monthly Reflection",
    variant: "Monthly Reflection",
    description: "Series of questions for a personal reflection at the end of each month",
  },
];
