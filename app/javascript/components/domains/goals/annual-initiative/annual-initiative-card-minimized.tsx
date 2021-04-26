import * as React from "react";
import styled from "styled-components";
import { color } from "styled-system";
import { baseTheme } from "../../../../themes";
import { Icon } from "../../../shared/icon";
import { AnnualInitiativeType } from "~/types/annual-initiative";
import * as moment from "moment";
import { MilestoneCard } from "../milestone/milestone-card";

interface IAnnualInitiativeCardMinimizedProps {
  annualInitiative: AnnualInitiativeType;
  setShowMinimizedCard: React.Dispatch<React.SetStateAction<boolean>>;
  disableOpen?: boolean;
}

export const AnnualInitiativeCardMinimized = ({
  annualInitiative,
  disableOpen,
  setShowMinimizedCard,
}: IAnnualInitiativeCardMinimizedProps): JSX.Element => {
  const { warningRed, cautionYellow, finePine, grey40 } = baseTheme.colors;
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
    let counts = []
    console.log("milestoneObj", milestoneObj)
  const renderStatusSquares = () => {
     
    let gradient = '';
    annualInitiative.quarterlyGoals.map((quarterlyGoal, index) => {
      console.log(quarterlyGoal, "annualInitiative")
      

      //if there is no currentMilestone, use the last milestone, assuming this is past the 13th week
      let currentMilestone;
   

      currentMilestone = quarterlyGoal.milestones.find(milestone =>
        moment(milestone.weekOf).isSame(moment(), "week"),
      );
      if (!currentMilestone) {
        currentMilestone = quarterlyGoal.milestones[quarterlyGoal.milestones.length - 1];
      }

      // let backgroundColor = grey40;

      if (currentMilestone && currentMilestone.status) {
        console.log(currentMilestone.status)
        switch (currentMilestone.status) {
          case "completed":
           console.log("completed")
            milestoneObj[0].count++
            break;
          case "in_progress":
           console.log("in_progress")
            milestoneObj[1].count++
            break;
          case "incomplete":
          console.log("incomplete")
            milestoneObj[2].count++
            break;
          case "unstarted":
          console.log("unstarted")
            milestoneObj[3].count++
            break;
        }
      }
    
    });
 
      
    milestoneObj.forEach((obj, index) => {
      if (obj.count > 0 ){
         counts.push(<MilestoneCountContainer>{obj.count}</MilestoneCountContainer>)
      }

      if(index > 0) {
         gradient += `, ${obj.color} ${(milestoneObj[index-1].count/annualInitiative.quarterlyGoals.length)*100}% ${(obj.count/annualInitiative.quarterlyGoals.length)*100}` + `% `;
         return obj
        } else {
          gradient += `, ${obj.color} ${(obj.count/annualInitiative.quarterlyGoals.length)*100}% `;
          return obj
      }
    }) 
  console.log("gradient", gradient)
    return <GradientContainer gradient={gradient} />;
  };
  return (
    <Container
      onClick={e => {
        e.stopPropagation();
      }}
    >
      <InitiativeCountContainer>
       {/* {renderMilestoneCounts()} */}
       {...counts}
      </InitiativeCountContainer>
      <StatusSquareContainer>{renderStatusSquares()}</StatusSquareContainer>
    
      {disableOpen ? null : (
        <MaximizeIconContainer
          onClick={e => {
            setShowMinimizedCard(false);
          }}
        >
          <ShowInitiativeBar> Show Initiative </ShowInitiativeBar>
          <Icon
            icon={"Chevron-Down"}
            size={"15px"}
            iconColor={"#005FFE"}
            style={{ marginTop: "5px" }}
          />
        </MaximizeIconContainer>
      )}
    </Container>
  );
};

const Container = styled.div`
  ${color}
  height: 50px;
  background-color: ${props => props.theme.colors.backgroundGrey};
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  display: flex;
  padding-left: 16px;
  padding-right: 16px;
  position: relative;
  padding-bottom: 10px;
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
  background-color: white;
  border-radius: 50px;
  width: 15px;
  height: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin: 15% 50%;
  &: hover {
    cursor: pointer;
  }
`;

const ShowInitiativeBar = styled.div`
 margin: 15%;
 color: #005FFE
`;
//add blue above to constants
const StatusSquareContainer = styled.div`
  position: absolute;
  display: flex;
  margin-top: 10%;
  width: 200px;
`;

const InitiativeCountContainer = styled.div`
  display: flex;
  width: 100%;
`
const MilestoneCountContainer = styled.div`
    margin: 0 10%;
    display: inline-block
`
type GradientContainerType = {
  gradient?: string;
};

const GradientContainer = styled.div<GradientContainerType> `
    height: 2px;
    width: 100%;
    background: linear-gradient(to right ${props => props.gradient});
`