export type MilestoneType = {
  id: number;
  createdById: number;
  createdAt: Date | string;
  status: string;
  description: string;
  week: number;
  weekOf: Date | string;
};
