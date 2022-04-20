import React from "react";
import styled from "styled-components";
import { createStyles, makeStyles, withStyles, Theme } from "@material-ui/core/styles";
import { baseTheme } from "~/themes/base";
import FormControl from "@material-ui/core/FormControl";
import NativeSelect from "@material-ui/core/NativeSelect";
import InputBase from "@material-ui/core/InputBase";
import InputLabel from "@material-ui/core/InputLabel";
import { Icon } from "../../shared/icon";

const MuiStyledInput = withStyles((theme: Theme) =>
  createStyles({
    input: {
      borderRadius: 4,
      postition: "relative",
      color: baseTheme.colors.greyActive,
      backgroundColor: baseTheme.colors.white,
      border: `1px solid ${baseTheme.colors.borderGrey}`,
      transition: theme.transitions.create(["border-color", "box-shadow"]),
      fontFamily: "Lato, sans-serif",
      fontSize: 12,
      "&:focus": {
        borderRadius: 4,
        borderColor: baseTheme.colors.primary60,
        boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
      },
      paddingLeft: "16px",
      paddingTop: "6px",
      paddingBottom: "8px",
      width: "85px",
    },
  }),
)(InputBase);

const StyledIcon = styled(Icon)`
  top: calc(50% - 8px);
  right: 16px;
  position: absolute;
  pointer-events: none;
`;

const ChevronDownIcon = (): JSX.Element => {
  return <StyledIcon icon={"Chevron-Down"} size={"16px"} iconColor={baseTheme.colors.primary80} />;
};

type SelectProps = {
  selection: string | number;
  setSelection: any;
  id: string;
  children?: any;
};

export default ({ selection, setSelection, id, children }: SelectProps): JSX.Element => {
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelection(event.target.value as string);
  };
  return (
    <FormControl>
      <NativeSelect
        id={id}
        value={selection}
        onChange={handleChange}
        input={<MuiStyledInput />}
        IconComponent={ChevronDownIcon}
      >
        {children}
      </NativeSelect>
    </FormControl>
  );
};
