interface SelectionScaleData {
  option: number;
  label: string;
}

export const agreementScale: Array<SelectionScaleData> = [
  {
    option: 1,
    label: "Strongly Disagree",
  },
  {
    option: 2,
    label: "Disagree",
  },
  {
    option: 3,
    label: "Neutral",
  },
  {
    option: 4,
    label: "Agree",
  },
  {
    option: 5,
    label: "Strongly Agree",
  },
];

export const sentimentScale: Array<SelectionScaleData> = [
  {
    option: 1,
    label: "Terrible",
  },
  {
    option: 2,
    label: "Not Great",
  },
  {
    option: 3,
    label: "Okay",
  },
  {
    option: 4,
    label: "Great",
  },
  {
    option: 5,
    label: "Awesome",
  },
];
