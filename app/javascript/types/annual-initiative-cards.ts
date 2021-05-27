import { AnnualInitiativeType } from "~/types/annual-initiative";
import { QuarterlyGoalType } from "./quarterly-goal";

// TODOIT: Add a default
export interface IAnnualInitiativeCardExpandedProps {
  annualInitiative: AnnualInitiativeType;
  quarterlyGoals? : QuarterlyGoalType;
  setQuarterlyGoalId: React.Dispatch<React.SetStateAction<number>>;
  setQuarterlyGoalModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedAnnualInitiativeDescription: React.Dispatch<React.SetStateAction<string>>;
  showCreateQuarterlyGoal: boolean;
  showEditButton?: boolean;
  selectedSubInitiativeCards?:number;
  showSubInitiativeCards?: boolean; 
  setSelectSubInitiativeCard?:React.Dispatch<React.SetStateAction<number>>;
  setShowSubInitiativeCards?: React.Dispatch<React.SetStateAction<boolean>>;
  marginLeft?: string;
  marginRight?: string;
  setSubInitiativeModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setSubInitiativeId?: React.Dispatch<React.SetStateAction<number>>;
}
