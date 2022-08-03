import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { getPercentage, getResponses, getTotalNumberOfResponses } from "~/utils/check-in-functions";

interface RowBarProps {
  average: number;
  text?: string;
  // num: number;
}

interface YesNoInsightsProps {
  insightsToShow: Array<any>;
  steps: Array<any>;
}

export const YesNoInsights = ({ insightsToShow, steps }: YesNoInsightsProps): JSX.Element => {
  const stepQuestions = steps
    .map(step => {
      if (step.name === "Yes/No") {
        return step.question;
      } else return;
    })
    .filter(Boolean);

  const checkInArtifactLogs = insightsToShow
    .map(artifact => {
      if (artifact.checkInArtifactLogs[0]) {
        return {
          ...artifact.checkInArtifactLogs[0],
          ownedBy: artifact.ownedById,
          updatedAt: artifact.updatedAt,
        };
      }
    })
    .filter(Boolean);

  const RowBar = (props: RowBarProps): JSX.Element => {
    const rowBarRef = useRef<HTMLDivElement>(null);
    const [rowBarWidth, setRowBarWidth] = useState(null);

    useEffect(() => {
      const handleResize = () => {
        if (rowBarRef.current) {
          setRowBarWidth(rowBarRef.current.clientWidth);
        }
      };
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }, [rowBarRef]);

    const { average, text } = props;

    const width = (average / 100) * rowBarWidth;

    return (
      <Row ref={rowBarRef}>
        <LabelText color={width < 16 ? "#000" : "#fff"}>{text}</LabelText>
        <RowBarFillDiv average={width} animate={{ width: `${width}px` }} />
      </Row>
    );
  };

  return (
    <>
      {stepQuestions.map((question, index) => {
        const ansSummary = getPercentage(getResponses(question, checkInArtifactLogs, "yes_no"));
        const value = val => ansSummary.find(item => item.value === val);
        
        return (
          <Container key={`${question}-${index}`}>
            <HeaderContainer>
              <QuestionText>{question}</QuestionText>
            </HeaderContainer>
            <RowsContainer>
              <RowContainer>
                <Percentage>{`${value("true")?.percentage || 0}%`}</Percentage>
                <RowBar average={value("false")?.percentage || 0} text="Yes" />
              </RowContainer>
              <RowContainer>
                <Percentage>{`${value("false")?.percentage || 0}%`}</Percentage>
                <RowBar average={value("false")?.percentage || 0} text="No" />
              </RowContainer>
            </RowsContainer>
            <Divider />
            <InfoContainer>
              <InfoText>
                {!getTotalNumberOfResponses(question, checkInArtifactLogs, "yes_no")
                  ? "No response"
                  : getTotalNumberOfResponses(question, checkInArtifactLogs, "yes_no") == 1
                  ? "1 response"
                  : `${getTotalNumberOfResponses(
                      question,
                      checkInArtifactLogs,
                      "yes_no",
                    )} total responses`}
              </InfoText>
            </InfoContainer>
          </Container>
        );
      })}
    </>
  );
};

const Container = styled.div`
  box-shadow: 0px 3px 6px #00000029;
  background: ${props => props.theme.colors.white};
  border-radius: 8px;
  padding: 16px 0;
  margin-bottom: 16px;
  // height: 250px;
`;

const HeaderContainer = styled.div`
  padding: 0 1em;
  margin-bottom: 2em;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const QuestionText = styled.span`
  color: ${props => props.theme.colors.black};
  font-size: 20px;
  font-weight: bold;
  display: inline-block;
`;

const Divider = styled.div`
  border-top: 1px solid ${props => props.theme.colors.grey40};
`;

const InfoContainer = styled.div`
  display: flex;
  padding: 0 1em;
  margin-top: 0.5em;
`;

const InfoText = styled.span`
  font-size: 12px;
  color: ${props => props.theme.colors.grey40};
  margin-left: auto;
`;

const RowsContainer = styled.div`
  padding: 0 1em;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 2em;
`;

const RowContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0 2em;
  margin-bottom: 2em;
`;

const Row = styled.div`
  height: 64px;
  // padding: 1em;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${props => props.theme.colors.backgroundGrey};
  border-radius: 4px;
  width: 100%;
  position: relative;
`;

const Percentage = styled.span`
  font-weight: bold;
  font-size: 14px;
  width: 3em;
  text-align: center;
`;

type LabelTextProps = {
  color: string;
};

const LabelText = styled.span<LabelTextProps>`
  color: ${props => props.color};
  font-weight: bold;
  font-size: 16px;
  position: absolute;
  left: 16px;
  z-index: 2;
`;

const RowBarFillDiv = styled(motion.div)<RowBarProps>`
  height: 100%;
  width: ${props => props.average}%;
  border-radius: inherit;
  background: ${props => props.theme.colors.primary100};
`;
