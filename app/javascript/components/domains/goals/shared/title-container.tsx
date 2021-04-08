import * as React from "react";
import styled from "styled-components";
import { space, color } from "styled-system";
import { HomeTitle } from "../../home/shared-components";
import { EnlargedHomeTitle } from "./enlarged-home-title";
import { Icon } from "~/components/shared/icon";
import { observer } from "mobx-react";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import { baseTheme } from "~/themes";
import { withStyles, Theme, createStyles } from "@material-ui/core/styles";
import { Text } from "~/components/shared/text";
interface ITitleContainerProps {
  showMinimizedCards: boolean;
  setShowMinimizedCards: React.Dispatch<React.SetStateAction<boolean>>;
  goalsFilter: string;
  setGoalsFilter: React.Dispatch<React.SetStateAction<string>>;
  largeHomeTitle?: boolean;
  title: string;
  handleToggleChange: any;
  toggleChecked: boolean;
  showInitiatives: boolean;
  setShowInitiatives: React.Dispatch<React.SetStateAction<boolean>>;
}

const StyledSwitch = withStyles({
  switchBase: {
    "&$checked": {
      color: baseTheme.colors.primary100,
      "& + $track": {
        backgroundColor: baseTheme.colors.primary40,
        opacity: 1,
      },
    },
  },
  track: {},
  checked: {},
  focusVisible: {},
})(Switch);

const StyledLabel = withStyles({
  label: {
    fontFamily: "Lato",
  },
})(FormControlLabel);

export const TitleContainer = observer(
  ({
    showMinimizedCards,
    setShowMinimizedCards,
    goalsFilter,
    setGoalsFilter,
    largeHomeTitle,
    title,
    handleToggleChange,
    toggleChecked,
    showInitiatives,
    setShowInitiatives,
  }: ITitleContainerProps): JSX.Element => {
    const renderExpandAnnualInitiativesIcon = (): JSX.Element => {
      return showMinimizedCards ? (
        <IconContainer>
          <Icon icon={"Chevron-Down"} size={"15px"} iconColor={"primary100"} />
        </IconContainer>
      ) : (
        <IconContainer marginTop={"3px"}>
          <Icon icon={"Chevron-Up"} size={"15px"} iconColor={"white"} />
        </IconContainer>
      );
    };

    const renderFilterOptions = () => {
      return (
        <FilterContainer>
          <FilterOptionContainer underline={goalsFilter == "all"}>
            <FilterOptions
              onClick={() => setGoalsFilter("all")}
              color={goalsFilter == "all" ? "primary100" : "grey40"}
            >
              All
            </FilterOptions>
          </FilterOptionContainer>

          {title == "Company" && (
            <FilterOptionContainer underline={goalsFilter == "me"}>
              <FilterOptions
                onClick={() => setGoalsFilter("me")}
                color={goalsFilter == "me" ? "primary100" : "grey40"}
              >
                Me
              </FilterOptions>
            </FilterOptionContainer>
          )}
          <FilterOptionContainer underline={goalsFilter == "closed"}>
            <FilterOptions
              onClick={() => setGoalsFilter("closed")}
              color={goalsFilter == "closed" ? "primary100" : "grey40"}
            >
              Closed
            </FilterOptions>
          </FilterOptionContainer>
        </FilterContainer>
      );
    };

    const renderHideButton = () => {
      return (
        <HideButtonContainer onClick={() => setShowInitiatives(!showInitiatives)}>
          <HideText>{showInitiatives ? "Hide" : "Show"} </HideText>
          <HideIconContainer>
            {showInitiatives ? (
              <HideIcon icon={"Hide_Show_L"} size={"15px"} iconColor={"greyInactive"} />
            ) : (
              <ShowIcon icon={"Hide_Show_L"} size={"15px"} iconColor={"greyInactive"} />
            )}
          </HideIconContainer>
        </HideButtonContainer>
      );
    };

    return (
      <Container>
        <HomeTitleContainer>
          {largeHomeTitle ? (
            <EnlargedHomeTitle> {title} </EnlargedHomeTitle>
          ) : (
            <HomeTitle> {title} </HomeTitle>
          )}

          <ToggleContainer>
            <FormGroup row>
              <StyledLabel
                control={
                  <StyledSwitch
                    checked={toggleChecked}
                    onChange={handleToggleChange}
                    name="switch-checked"
                  />
                }
                label="Plan"
                labelPlacement="start"
              />
            </FormGroup>
          </ToggleContainer>

          {/* <ExpandAnnualInitiativesButton
            showMinimizedCards={showMinimizedCards}
            onClick={() => setShowMinimizedCards(!showMinimizedCards)}
          >
            {renderExpandAnnualInitiativesIcon()}
          </ExpandAnnualInitiativesButton> */}
        </HomeTitleContainer>

        {renderFilterOptions()}
        {renderHideButton()}
      </Container>
    );
  },
);

type ExpandAnnualInitiativesButtonType = {
  showMinimizedCards: boolean;
};

const ExpandAnnualInitiativesButton = styled.div<ExpandAnnualInitiativesButtonType>`
  border-radius: 50px;
  border: 1px solid #e3e3e3;
  box-shadow: 0px 3px 6px #f5f5f5;
  height: 25px;
  width: 25px;
  margin-left: 16px;
  background-color: ${props =>
    props.showMinimizedCards ? props.theme.colors.white : props.theme.colors.primary100};
`;

const Container = styled.div`
  display: flex;
  margin-bottom: 16px;
`;

type IconContainerType = {
  marginTop?: string;
};

const IconContainer = styled.div<IconContainerType>`
  text-align: center;
  margin-top: ${props => props.marginTop || "6px"};
  &: hover {
    cursor: pointer;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  margin-left: auto;
  margin-right: auto;
`;

type FilterOptionsType = {
  mr?: string;
};

const FilterOptions = styled.p<FilterOptionsType>`
  ${space}
  ${color}
  font-size: 12px;
  font-weight: 400;
  cursor: pointer;
  margin-top: 4px;
  margin-bottom: 0;
`;

const HomeTitleContainer = styled.div`
  position: absolute;
  display: flex;
`;

type FilterOptionContainerType = {
  underline: boolean;
};
const FilterOptionContainer = styled.div<FilterOptionContainerType>`
  border-bottom: ${props => props.underline && `4px solid ${props.theme.colors.primary100}`};
  padding-left: 4px;
  padding-right: 4px;
  margin-left: 4px;
  margin-right: 4px;
`;

const ToggleContainer = styled.div`
  margin-left: 16px;
`;

const HideButtonContainer = styled.div`
  display: flex;
`;

const HideText = styled(Text)`
  font-size: 14px;
  color: ${props => props.theme.colors.greyInactive};
  margin-top: 0;
  margin-bottom: 0;
  margin-right: 8px;
`;

const HideIconContainer = styled.div``;

const HideIcon = styled(Icon)`
  -webkit-transform: rotate(90deg);
  transform: rotate(90deg);
`;

const ShowIcon = styled(Icon)`
  -webkit-transform: rotate(-90deg);
  transform: rotate(-90deg);
`;
