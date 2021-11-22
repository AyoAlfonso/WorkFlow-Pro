import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import styled from "styled-components";
import { color, ColorProps, layout, LayoutProps, space, SpaceProps, variant } from "styled-system";
import { buildRepeatingLinearGradient } from "~/utils/css-utils";

type ProgressBarContainerProps = {
  variant: string;
  width?: string | number;
};

const ProgressBarContainer = styled.div<ProgressBarContainerProps>`
  ${color}
  ${layout}
  ${space}
  height: 16px;
  width: ${props => (props.width ? props.width : "100%")};
  border-radius: 4px;
  position: relative;
  ${props =>
    variant({
      variants: {
        unstarted: {
          bg: "grey10",
        },
        incomplete: {
          bg: "almostPink",
        },
        in_progress: {
          bg: "lightYellow",
        },
        completed: {
          bg: "lightFinePine",
        },
      },
    })}
`;

type ProgressBarFillDivProps = {
  completed: string | number;
  variant: string;
}

const ProgressBarFillDiv = styled(motion.div)<ProgressBarFillDivProps>`
  height: 100%;
  width: ${props => props.completed}%;
  border-radius: inherit;
  ${props =>
    variant({
      variants: {
        unstarted: {
          background: buildRepeatingLinearGradient(props.theme.colors.grey30, 70, 5, "px", 20),
        },
        incomplete: {
          background: buildRepeatingLinearGradient(props.theme.colors.warningRed, 70, 5, "px", -5),
        },
        in_progress: {
          background: buildRepeatingLinearGradient(props.theme.colors.tango, 70, 5, "px", 10),
        },
        completed: {
          background: buildRepeatingLinearGradient(props.theme.colors.finePine, 70, 5, "px", 20),
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
  const progressBarRef = useRef(null);
  const [progressBarWidth, setProgressBarWidth] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      if (progressBarRef.current) {
        setProgressBarWidth(progressBarRef.current.offsetWidth);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [progressBarRef]);

  const { completed, variant, text } = props;
  return (
    <ProgressBarContainer variant={variant} ref={progressBarRef}>
      <ProgressBarText>{text}</ProgressBarText>
      <ProgressBarFillDiv
        variant={variant}
        completed={completed}
        animate={{ width: `${progressBarWidth * (completed / 100)}px` }}
      />
    </ProgressBarContainer>
  );
};
