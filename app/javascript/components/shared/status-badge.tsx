import React, { useState, useMemo } from "react"
import * as R from "ramda"
import styled from "styled-components"

type StatusBadgeProps = {
	color: string;
	background: string;
  padding?: string;
  fontSize?: string;
	fontWeight?: string;
}

export const StatusBadge = styled.div<StatusBadgeProps>`
	display: inline-block;
  font-size: ${props => props.fontSize || "9px"};
	font-weight: ${props => props.fontWeight || "bold"};
	color: ${props => props.color};
	background: ${props => props.background};
  padding: ${props => props.padding ? props.padding : "4px"};
	border-radius: 2px;
`
