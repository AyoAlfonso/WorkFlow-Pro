import React from "react"
import { createStyles, makeStyles, withStyles, Theme } from '@material-ui/core/styles';
import { baseTheme } from "~/themes/base";
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import InputBase from '@material-ui/core/InputBase';
import InputLabel from '@material-ui/core/InputLabel';

const StyledInput = withStyles(
	(theme: Theme) => createStyles({
		input: {
			borderRadius: 4,
			postition: 'relative',
			backgroundColor: baseTheme.colors.white,
			border: `1px solid ${baseTheme.colors.borderGrey}`,
      transition: theme.transitions.create(['border-color', 'box-shadow']),
			fontFamily: "Lato, sans-serif",
			'&:focus': {
        borderRadius: 4,
        borderColor: baseTheme.colors.primary60,
        boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
      },
			padding: "4px 8px",
		},
		select: {
			paddingRight: "16px",
		}
}))(InputBase);

type SelectProps = {
	selection: string | number;
	setSelection: any;
	id: string;
	children?: any;
};

export default ({
	selection,
	setSelection,
	id,
	children,
}: SelectProps): JSX.Element => {
	const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
		setSelection(event.target.value as string);
	}
	return (
		<FormControl>
			<NativeSelect
				id={id}
				value={selection}
				onChange={handleChange}
				input={<StyledInput />}
			>
			{children}
			</NativeSelect>
		</FormControl>
	)
}
