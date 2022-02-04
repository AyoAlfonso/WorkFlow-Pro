import React, { useState, useMemo } from "react"
import * as R from "ramda"
import styled from "styled-components"

type StatusBadgeHoverProps = {
	color: string;
	background: string;
  //padding?: string;
  fontSize?: string;
	fontWeight?: string;
    height?: string;
    width?: string;
    hoverWidth?: string;
    hoverHeight?: string;
}

export const StatusBadgeHover = styled.div<StatusBadgeHoverProps>`
	display: inline-block;
    font-size: ${props => props.fontSize || "9px"};
	font-weight: ${props => props.fontWeight || "bold"};
	color: ${props => props.color};
	background: ${props => props.background};
    height: ${props => props.height || "15px"};
    width: ${props => props.width || "15px"};
    line-height: ${props => props.height || "15px"};
    text-align: center;
	border-radius: 2px;
    justify-content: center;
    align-items: center;
    vertical-align: middle;
    &:hover {
        //height: ${props => props.hoverHeight || props.height ||"15px"};
        //width: ${props => props.hoverWidth || props.width ||"15px"};
    }
`
