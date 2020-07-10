import * as React from "react";
import styled from "styled-components";
import { color, layout, space, typography, variant } from "styled-system";
import { buildRepeatingLinearGradient } from "../../utils/css-utils";
import { motion } from "framer-motion";

const ProgressBarContainer = styled.div`
  ${color}
  ${layout}
  ${space}
  height: 23px;
  width: ${props => (props.width ? props.width : "100%")};
  border-radius: 4px;
  position: relative;
  ${props =>
    variant({
      variants: {
        primary: {
          bg: "primary40",
        },
        success: {
          bg: "fadedSuccess",
        },
        warning: {
          bg: "peach",
        },
        error: {
          bg: "fadedRed",
        },
      },
    })}
`;

const ProgressBarFillDiv = styled(motion.div)`
  height: 100%;
  width: ${props => props.completed}%;
  border-radius: inherit;
  ${props =>
    variant({
      variants: {
        primary: {
          background: buildRepeatingLinearGradient(props.theme.colors.primary100, 70, 5, "px", 20),
        },
        success: {
          background: buildRepeatingLinearGradient(
            props.theme.colors.successGreen,
            70,
            5,
            "px",
            -5,
          ),
        },
        warning: {
          background: buildRepeatingLinearGradient(
            props.theme.colors.cautionYellow,
            70,
            5,
            "px",
            10,
          ),
        },
        error: {
          background: buildRepeatingLinearGradient(props.theme.colors.warningRed, 70, 5, "px", 20),
        },
      },
    })};
`;

const ProgressBarText = styled.div`
  font-family: Lato;
  font-weight: 500;
  font-size: 19px;
  color: white;
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
`;

export interface IStripedProgressBarProps {
  completed: number;
  variant: string;
  text?: string;
}

export const StripedProgressBar = (props: IStripedProgressBarProps) => {
  const progressBarRef = React.useRef(null);
  const [progressBarWidth, setProgressBarWidth] = React.useState(null);
  React.useEffect(() => {
    if (progressBarRef.current) {
      setProgressBarWidth(progressBarRef.current.offsetWidth);
    }
  }, [progressBarRef]);

  const { completed, variant, text } = props;
  return (
    <ProgressBarContainer variant={variant} ref={progressBarRef}>
      <ProgressBarText>{text}</ProgressBarText>
      <ProgressBarFillDiv
        variant={variant}
        completed={completed}
        animate={{ width: progressBarWidth * (completed / 100) }}
      />
    </ProgressBarContainer>
  );
};
