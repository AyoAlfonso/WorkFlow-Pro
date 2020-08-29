import * as React from "react";
import * as R from "ramda";
import styled, { keyframes } from "styled-components";
import { layout, LayoutProps, space, SpaceProps } from "styled-system";
import { Text } from "~/components/shared";
import { baseTheme } from "~/themes/base";

type StyledProps = LayoutProps & SpaceProps;

export interface ISemiCircleGaugeProps extends StyledProps {
  percentage: number;
  text?: string;
  textColor?: string;
  fillColor?: string;
  tickCount?: number;
  hasTicks?: boolean;
  hasLabels?: boolean;
  hasLine?: boolean;
}

export const SemiCircleGauge = ({
  percentage,
  fillColor,
  text,
  textColor,
  tickCount,
  hasTicks,
  hasLabels,
  hasLine,
  ...styledProps
}: ISemiCircleGaugeProps): JSX.Element => {
  const fill = () => {
    if (!R.isNil(fillColor)) {
      return !R.isNil(baseTheme.colors[fillColor]) ? baseTheme.colors[fillColor] : fillColor;
    } else {
      if (percentage > 90) {
        return baseTheme.colors.superGreen;
      } else if (percentage > 70) {
        return baseTheme.colors.successGreen;
      } else if (percentage >= 40) {
        return baseTheme.colors.cautionYellow;
      } else {
        return baseTheme.colors.warningRed;
      }
    }
  };
  const tickPositions = () => {
    if (!R.isNil(tickCount)) {
      let ticks = [0];
      for (let i = 1; i <= tickCount; i++) {
        ticks.push((180 / tickCount) * i);
      }
      return ticks;
    } else {
      return [];
    }
  };
  return (
    <Container {...styledProps}>
      <MeterCircle hasLine={hasLine}>
        {hasTicks
          ? tickPositions().map((tick, index) => <Tick key={index} degrees={tick} />)
          : null}
        {hasLabels
          ? tickPositions().map((tick, index) => (
              <TickLabelContainer key={index} degrees={tick}>
                <TickLabel degrees={tick}>{index * 10}</TickLabel>
              </TickLabelContainer>
            ))
          : null}
        <div>
          <SemiCircleChart percentage={percentage} fill={fill()}>
            {text ? (
              <Text
                color={textColor ? textColor : "black"}
                fontFamily={"Exo"}
                fontSize={"24px"}
                fontWeight={400}
              >
                {text}
              </Text>
            ) : null}
          </SemiCircleChart>
        </div>
      </MeterCircle>
    </Container>
  );
};

const Container = styled.div`
  ${layout}
  ${space}
  text-align: center;
  font-family: Exo;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: auto;
  flex-wrap: wrap;
  box-sizing: border-box;
`;

const fillGraphAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
`;

interface ISemiCircleChartProps {
  percentage: number;
  fill: string;
}

const SemiCircleChart = styled.div<ISemiCircleChartProps>`
  width: 240px;
  height: 120px;
  position: relative;
  text-align: center;
  border-radius: 120px 120px 0 0;
  overflow: hidden;
  color: ${props => props.fill};
  display: flex;
  align-items: flex-end;
  justify-content: center;
  box-sizing: border-box;
  &:before,
  &:after {
    content: "";
    width: 240px;
    height: 120px;
    border: ${props => "40px solid " + props.fill};
    border-top: none;
    position: absolute;
    transform-origin: 50% 0% 0;
    border-radius: 0 0 240px 240px;
    box-sizing: border-box;
    left: 0;
    top: 100%;
  }
  &:before {
    border-color: ${props => props.theme.colors.grey20};
    transform: rotate(180deg);
  }
  &:after {
    z-index: 3;
    animation: 1s ${fillGraphAnimation} ease-in;
    transform: ${props => "rotate(calc(1deg * (" + props.percentage + " * 1.8)))"};
  }
  &:hover {
    &:after {
      opacity: 0.8;
      cursor: pointer;
    }
  }
`;

interface IMeterCircleProps {
  hasLine?: boolean;
}

const MeterCircle = styled.div<IMeterCircleProps>`
  height: 144px;
  width: 288px;
  border-top-left-radius: 288px;
  border-top-right-radius: 288px;
  position: relative;
  text-align: center;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  box-sizing: border-box;
  border-top: ${props => (props.hasLine ? "1px solid " + props.theme.colors.grey20 : null)};
`;

interface IDegreeProps {
  degrees: number;
}

const Tick = styled.div<IDegreeProps>`
  position: absolute;
  width: 6px;
  height: 1px;
  background-color: ${props => props.theme.colors.grey40};
  transform: rotate(${props => props.degrees + 180}deg) translate(123px);
  display: flex;
`;

const TickLabelContainer = styled.div<IDegreeProps>`
  position: absolute;
  transform: rotate(${props => props.degrees + 177}deg) translate(132px);
`;

const TickLabel = styled.div<IDegreeProps>`
  position: absolute;
  color: ${props => props.theme.colors.grey40};
  transform: rotate(${props => -props.degrees + 183}deg);
  font-size: 10px;
`;
