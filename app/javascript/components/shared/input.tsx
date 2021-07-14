import * as React from "react";
import styled from "styled-components";
import { createStyles, withStyles, Theme } from '@material-ui/core/styles';
import { baseTheme } from "../../themes";
import FormControl from '@material-ui/core/FormControl';
import MuiSelect from '@material-ui/core/Select';
import MuiTextField from '@material-ui/core/TextField';
import NativeSelect from '@material-ui/core/NativeSelect'
import InputBase from '@material-ui/core/InputBase';
import { Icon } from "./icon";

export const Label = props => <StyledLabel {...props}>{props.children}</StyledLabel>;

const StyledLabel = styled.label`
  display: block;
  width: 100%;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 15px;
  font-family: Lato, sans-serif;
  font-weight: bold;
`;

const MuiStyledInputBase = (props) => withStyles(
	(theme: Theme) => createStyles({
		input: {
			borderRadius: 4,
			postition: 'relative',
			color: props.color || baseTheme.colors.black,
			backgroundColor: 'transparent',
			border: `1px solid ${baseTheme.colors.grey40}`,
			transition: theme.transitions.create(['border-color', 'box-shadow']),
			fontFamily: "Lato, sans-serif",
			fontSize: props.fontSize || 16,
			'&:focus': {
				borderRadius: 4,
				borderColor: baseTheme.colors.primary60,
				boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
			},
			paddingLeft: props.paddingLeft || "4px",
			paddingTop: props.paddingTop || "8px",
			paddingBottom: props.paddingBottom || "8px",
			height: "20px",
		},
	}))(InputBase);

const StyledIcon = styled(Icon)`
	top: calc(50% - 8px);
	right: 16px;
	position: absolute;
	pointer-events: none;
	margin: auto;
`

export const Input = (props): JSX.Element => {
	const MuiInput = MuiStyledInputBase(props)
	return (
		<FormControl
			style={{
				width: props.width || "100%",
				marginBottom: props.marginBottom || "16px"
			}}>
			<MuiInput {...props}>{props.children}</MuiInput>
		</FormControl>
	)
}

type ChevronDownIconProps = {
	iconColor?: string;
}

const ChevronDownIcon = ({ iconColor }: ChevronDownIconProps): JSX.Element => {
	return (
		<StyledIcon
			icon={"Chevron-Down"}
			size={"16px"}
			iconColor={iconColor || baseTheme.colors.primary80}
		/>
	)
}

type SelectProps = {
	value: string | number;
	id?: string;
	onChange?: any;
	children?: any;
	native?: boolean,
	[restProp: string]: any,
};

export const Select = ({
	value,
	id,
	onChange,
	children,
	fontSize,
	color,
	native = true,
	...restProps
}: SelectProps): JSX.Element => {

	const StyledInputBase = MuiStyledInputBase(restProps);
	const Icon = (props) => restProps.disabled ? (
		<ChevronDownIcon iconColor={baseTheme.colors.greyInactive}></ChevronDownIcon>
	) : (
			<ChevronDownIcon></ChevronDownIcon>
		)

	return (
		<FormControl style={{ width: restProps.width || "100%" }}>
			{native ? (
				<NativeSelect
					id={id}
					value={value}
					onChange={onChange}
					input={<StyledInputBase />}
					IconComponent={Icon}
					{...restProps}
				>
					{children}
				</NativeSelect>
			) : (
					<MuiSelect
						id={id}
						value={value}
						onChange={onChange}
						input={<StyledInputBase />}
						IconComponent={Icon}
						{...restProps}
					>
						{children}
					</MuiSelect>
				)}
		</FormControl>
	)
}

export const TextField = (props): JSX.Element => {
	const StyledInputBase = MuiStyledInputBase(props);
	return (
		<FormControl style={{ width: props.width || "100%" }}>
			<MuiTextField input={<StyledInputBase />} {...props}>{props.children}</MuiTextField>
		</FormControl>
	)
}

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  width: 100%;
`;
