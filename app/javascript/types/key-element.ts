export type KeyElementType = {
  id: number;
  value: string;
  completedAt: Date | string;
  elementableId: number;
  completionType: string;
  completionCurrentValue: number | string;
  completionTargetValue: number;
};
