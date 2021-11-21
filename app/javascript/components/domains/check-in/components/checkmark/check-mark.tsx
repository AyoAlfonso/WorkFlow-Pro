import * as React from "react";
import styled, { keyframes } from "styled-components";

export const CheckMark = (): JSX.Element => {
  return (
    <CheckMarkCircle>
      <Check></Check>
    </CheckMarkCircle>
  );
};

const Fill = keyframes`
100% {
    box-shadow: inset 0px 0px 0px 30px #7ac142;
  }
`;

const Scale = keyframes`
  0%, 100% {
    transform: none;
  }
  50% {
    transform: scale3d(1.1, 1.1, 1);
  }
`;

const Checkmark = keyframes`
  0% {
    height: 0;
    width: 0;
    opacity: 1;
  }
  20% {
    height: 0;
    width: 75px;
    opacity: 1;
  }
  40% {
    height: 150px;
    width: 75px;
    opacity: 1;
  }
  100% {
    height: 150px;
    width: 75px;
    opacity: 1;
  }
`;

const CheckMarkCircle = styled.div`
  width: 300px;
  height: 300px;
  position: relative;
  border-radius: 50%;
  display: block;
  stroke: #7ac142;
  stroke-miterlimit: 10;
  margin: 70px auto;
  box-shadow: inset 0px 0px 0px #7ac142;
  animation: ${Fill} 0.4s ease-in-out 0.4s forwards, ${Scale} 0.3s ease-in-out 0.9s both;
`;

const Check = styled.div`
  &:after {
    animation-duration: 1s;
    animation-timing-function: ease;
    animation-name: ${Checkmark};
    transform: scaleX(-1) rotate(135deg);
  }

  &:after {
    opacity: 1;
    height: 150px;
    width: 75px;
    transform-origin: left top;
    border-right: 30px solid #7ac142;
    border-top: 25px solid #7ac142;
    content: "";
    left: 50px;
    top: 150px;
    position: absolute;
  }
`;