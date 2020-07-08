import * as React from "react";
import styled from "styled-components";
import { color, layout, space, typography, variant } from "styled-system";
import { buildRepeatingLinearGradient } from "../../utils/css-utils";

const ProgressBarContainer = styled.div`
  ${color}
  ${layout}
  ${space}
  height: 20px;
  width: 100%;
  border-radius: 4px;
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
          bg: "fadedYellow",
        },
        error: {
          bg: "fadedRed",
        },
      },
    })}
`;

const ProgressBarFillDiv = styled.div`
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
    })}
`;

const ProgressBarCompleted = styled.span`
  font-family: Lato;
  color: white;
`;

export const ProgressBar = props => {
  const { completed, variant } = props;
  return (
    <ProgressBarContainer variant={variant}>
      <ProgressBarFillDiv variant={variant} completed={completed}>
        <ProgressBarCompleted>Annual Initiative</ProgressBarCompleted>
      </ProgressBarFillDiv>
    </ProgressBarContainer>
  );
};

// ${props => variant({
//   variants: {
//     primary: {

//     },
//     success: {

//     },
//     warning: {

//     },
//     error: {

//     }
//   }
// })}
