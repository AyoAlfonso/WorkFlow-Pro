import { AnnualInitiativeType } from "~/types/annual-initiative";
import { QuarterlyGoalType } from "./quarterly-goal";

// TODOIT: Add a default
export interface ISubInitiativeCardExpandedProps {
  annualInitiative: AnnualInitiativeType;
  setSubInitiativeModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedAnnualInitiativeDescription: React.Dispatch<React.SetStateAction<string>>;
  setSubInitiativeId: React.Dispatch<React.SetStateAction<number>>;
  selectedSubInitiativeCards?: number;
}
