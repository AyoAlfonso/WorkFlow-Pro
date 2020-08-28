import * as React from "react";
import styled, { keyframes } from "styled-components";
import { layout, LayoutProps, space, SpaceProps } from "styled-system";
import { Text } from "~/components/shared";
import { baseTheme } from "~/themes/base";

type StyledProps = LayoutProps & SpaceProps;

export interface ISemiCircleGaugeProps extends StyledProps {
  percentage: number;
  fillColor: string;
  text: string;
  textColor: string;
  tickCount: number;
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
  const fill = baseTheme.colors[fillColor] ? baseTheme.colors[fillColor] : fillColor;
  const tickPositions = () => {
    let ticks = [0];
    for (let i = 1; i <= tickCount; i++) {
      ticks.push((180 / tickCount) * i);
    }
    return ticks;
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
          <SemiCircleChart percentage={percentage} fill={fill}>
            <Text color={textColor} fontFamily={"Exo"} fontSize={"24px"} fontWeight={400}>
              {text}
            </Text>
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
  width: 300px;
  height: 150px;
  position: relative;
  text-align: center;
  border-radius: 150px 150px 0 0;
  overflow: hidden;
  color: ${props => props.fill};
  display: flex;
  align-items: flex-end;
  justify-content: center;
  box-sizing: border-box;
  &:before,
  &:after {
    content: "";
    width: 300px;
    height: 150px;
    border: ${props => "50px solid " + props.fill};
    border-top: none;
    position: absolute;
    transform-origin: 50% 0% 0;
    border-radius: 0 0 300px 300px;
    box-sizing: border-box;
    left: 0;
    top: 100%;
  }
  &:before {
    border-color: rgba(0, 0, 0, 0.15);
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
  height: 180px;
  width: 360px;
  border-top-left-radius: 360px;
  border-top-right-radius: 360px;
  position: relative;
  text-align: center;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  box-sizing: border-box;
  // border-top: 1px solid ${props => props.theme.colors.grey20};
  border-top: ${props => (props.hasLine ? "1px solid " + props.theme.colors.grey20 : null)}
`;

interface IDegreeProps {
  degrees: number;
}

const Tick = styled.div<IDegreeProps>`
  position: absolute;
  width: 10px;
  height: 1px;
  background-color: ${props => props.theme.colors.grey40};
  transform: rotate(${props => props.degrees + 180}deg) translate(155px);
  display: flex;
`;

const TickLabelContainer = styled.div<IDegreeProps>`
  position: absolute;
  transform: rotate(${props => props.degrees + 180}deg) translate(175px);
`;

const TickLabel = styled.div<IDegreeProps>`
  position: absolute;
  color: ${props => props.theme.colors.grey40};
  transform: rotate(${props => -props.degrees + 180}deg);
`;
