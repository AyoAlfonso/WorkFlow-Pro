import * as React from "react";
import styled from "styled-components";
import { color } from "styled-system";
import { baseTheme } from "../../../../themes";
import { Icon } from "../../../shared/icon";
import { AnnualInitiativeType } from "~/types/annual-initiative";
import * as moment from "moment";
import { MilestoneCard } from "../milestone/milestone-card";
import { OwnedBySection } from "../shared/owned-by-section";

interface IAnnualInitiativeCardMinimizedProps {
  annualInitiative: AnnualInitiativeType;
  setShowMinimizedCard: React.Dispatch<React.SetStateAction<boolean>>;
  disableOpen?: boolean;
  showMinimizedCard?:boolean;
}

export const AnnualInitiativeCardMinimized = ({
  annualInitiative,
  disableOpen,
  setShowMinimizedCard,
  showMinimizedCard
}: IAnnualInitiativeCardMinimizedProps): JSX.Element => {
  const { warningRed, cautionYellow, finePine, grey40 } = baseTheme.colors;
  const counts = []
  // TODOIT: RETURN counts BACK to zero  
  let milestoneObj = [
          {
            color: finePine,
            count: 0,
          },
          {
            color: cautionYellow,
            count: 0,
          },
          {
            color: warningRed,
            count: 0,
          },
          
          {
            color: grey40,
            count: 0,
          },
    ]
  
  const renderStatusSquares = () => {
     
    annualInitiative.quarterlyGoals.map((quarterlyGoal, index) => {
      
      //if there is no currentMilestone, use the last milestone, assuming this is past the 13th week
      let currentMilestone;

      currentMilestone = quarterlyGoal.milestones.find(milestone =>
        moment(milestone.weekOf).isSame(moment(), "week"),
      );
      if (!currentMilestone) {
        currentMilestone = quarterlyGoal.milestones[quarterlyGoal.milestones.length - 1];
      }

      if (currentMilestone && currentMilestone.status) {
        switch (currentMilestone.status) {
          case "completed":
            milestoneObj[0].count++
            break;
          case "in_progress":
            milestoneObj[1].count++
            break;
          case "incomplete":
            milestoneObj[2].count++
            break;
          case "unstarted":
            milestoneObj[3].count++
            break;
        }
      }
    
    });
 
    let gradient = '';
    let annualQtrGoalsLength = annualInitiative.quarterlyGoals.length
    milestoneObj.forEach((obj, index) => {
      let margin = 0;
      if(index > 0) {
         let lastPercentage = 0
         let intialPercentage = 0
         Array.from({ length: index + 1}).map((_, i)=> {
           lastPercentage += (milestoneObj[i].count/annualQtrGoalsLength)*100
         })
         Array.from({ length: index }).map((_, i)=> intialPercentage += (milestoneObj[i].count/annualQtrGoalsLength)*100)
         gradient += `, ${obj.color} ${intialPercentage}% ${lastPercentage}` + `% `
         margin = lastPercentage - intialPercentage 
        } else {
          gradient += `, ${obj.color} ${(obj.count/annualQtrGoalsLength)*100}% `;
          margin = (obj.count/annualQtrGoalsLength)*100
      }
      if (obj.count > 0 ){
         counts.push(<MilestoneCountContainer color={obj.color} margin={`${Math.floor(margin)/2}%`} >{obj.count}</MilestoneCountContainer>)
      }
    }) 
    return <GradientContainer gradient={gradient} />;
  };
  return (
    <div
    onClick={e => {
          e.stopPropagation();
        }}
      >
      <OwnedBySection
          ownedBy={annualInitiative.ownedBy}
          type={"annualInitiative"}
          disabled={true}
          size={25}
          marginLeft={"16px"}
          marginRight={"0px"}
          marginTop={"5px"}
          marginBottom={"0px"}
        />
    <InitiativeCountContainer>
       {...counts}
      </InitiativeCountContainer>
      <StatusSquareContainer>{renderStatusSquares()}</StatusSquareContainer>
     
     
    <Container
      onClick={e => {
        setShowMinimizedCard(!showMinimizedCard);
       }}
    >
    {disableOpen ? null : (
        <MaximizeIconContainer>
          <ShowInitiativeBar> {showMinimizedCard ? 'Show' : 'Hide'}  Initiative </ShowInitiativeBar>
          <StyledIcon
            icon={showMinimizedCard ? "Chevron-Down": "Chevron-Up"}
            size={"12px"}
            iconColor={"#005FFE"}// TODOIT: ADD TO CONSTANT VARIABLES
            style={{ padding: "0px 5px" }}
    
          />
        </MaximizeIconContainer>
      )} 
    </Container>
    </div>
  );
};

const Container = styled.div`
  ${color}
  background-color: ${props => props.theme.colors.backgroundGrey};
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  display: flex;
  position: relative;
  width: auto;
  cursor: pointer;
`;

type QuarterlyGoalIndicatorType = {
  backgroundColor?: string;
};

const QuarterlyGoalIndicator = styled.div<QuarterlyGoalIndicatorType>`
  height: 16px;
  width: 16px;
  background-color: ${props => props.backgroundColor || props.theme.colors.grey80};
  margin-right: 6px;
  margin-top: auto;
  margin-bottom: auto;
  border-radius: 3px;
`;

const MaximizeIconContainer = styled.div`
  border-radius: 50px;
  height: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin: 5% auto;

  &: hover {
    cursor: pointer;
  }
`;

const ShowInitiativeBar = styled.div`
 margin: 15%;
 color: #005FFE;
 font-size: 12px;
 font-weight: bold;
`;
//TODOIT: add blue color above to constants
const StatusSquareContainer = styled.div`
  position: relative;
  display: flex;
  margin: 10px 0px 0px;
`;

const InitiativeCountContainer = styled.div`
  display: flex;
  width: 100%; 
  font-size: small;
`
type MilestoneCountContainerType = {
  margin: string;
  color: string;
};

const MilestoneCountContainer = styled.div<MilestoneCountContainerType>`
    margin: 0 ${props => props.margin} 0px;
    color: ${props => props.color}
    display: inline-block;
    width: 0px;
`
type GradientContainerType = {
  gradient?: string;
};

const GradientContainer = styled.div<GradientContainerType> `
    height: 2px;
    width: 100%;
    background: linear-gradient(to right ${props => props.gradient});
`

const StyledIcon = styled(Icon)`
  transition: .8s
  -moz-animation-delay: 3.5s;
   -webkit-animation-delay: 3.5s;
   -o-animation-delay: 3.5s;
    animation-delay: 3.5s;
`