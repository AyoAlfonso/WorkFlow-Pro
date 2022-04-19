import * as React from "react";
import styled from "styled-components";
import { space, color } from "styled-system";
import { HomeTitle } from "../../home/shared-components";
import { EnlargedHomeTitle } from "./enlarged-home-title";
import { Icon } from "~/components/shared/icon";
import { observer } from "mobx-react";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "~/components/shared/switch"
import { baseTheme } from "~/themes";
import { withStyles } from "@material-ui/core/styles";
import { Text } from "~/components/shared/text";
import { useMst } from "~/setup/root";

interface ITitleContainerProps {
}

const StyledLabel = withStyles({
  label: {
    fontFamily: "Lato",
  },
})(FormControlLabel);

export const DummyTitleContainer = observer(
  ({
  }: ITitleContainerProps): JSX.Element => {
    const renderFilterOptions = () => {
      return (
        <FilterContainer>
          <FilterOptionContainer underline={true}>
            <FilterOptions color={"primary100"}>
              Open
            </FilterOptions>
          </FilterOptionContainer>
          <FilterOptionContainer underline={false}>
            <FilterOptions color={"grey40"}>
              Steven
            </FilterOptions>
          </FilterOptionContainer>
          <FilterOptionContainer underline={false}>
            <FilterOptions color={"grey40"}>
              Closed
            </FilterOptions>
          </FilterOptionContainer>
        </FilterContainer>
      );
    };

    const renderHideButton = () => {
      return (
        <HideButtonContainer>
          <HideText>{"Hide"} </HideText>
          <HideIconContainer>
              <HideIcon icon={"Hide_Show_L"} size={"15px"} iconColor={"greyInactive"} />
          </HideIconContainer>
        </HideButtonContainer>
      );
    };
    return (
      <Container>
        <HomeTitleContainer>
          {true ? (
            <EnlargedHomeTitle> GCL Engineering </EnlargedHomeTitle>
          ) : (
            <HomeTitle> GCL Engineering </HomeTitle>
          )}
          <ToggleContainer>
            <FormGroup row>
              <StyledLabel
                control={
                  <Switch
                    name="switch-checked"
                  />
                }
                label="Plan"
                labelPlacement="end"
              />
            </FormGroup>
          </ToggleContainer>
        </HomeTitleContainer>

        {renderFilterOptions()}
        {renderHideButton()}
      </Container>
    );
  },
);


export const DummyUserTitleContainer = observer(
  ({}: ITitleContainerProps): JSX.Element => {
    const renderFilterOptions = () => {
      return (
        <FilterContainer>
          <FilterOptionContainer underline={true}>
            <FilterOptions color={"primary100"}>
              Open
            </FilterOptions>
          </FilterOptionContainer>
          <FilterOptionContainer underline={false}>
            <FilterOptions color={"grey40"}>
              Closed
            </FilterOptions>
          </FilterOptionContainer>
        </FilterContainer>
      );
    };

    const renderHideButton = () => {
      return (
        <HideButtonContainer>
          <HideText>{"Hide"} </HideText>
          <HideIconContainer>
              <HideIcon icon={"Hide_Show_L"} size={"15px"} iconColor={"greyInactive"} />
          </HideIconContainer>
        </HideButtonContainer>
      );
    };

    return (
      <Container>
        <HomeTitleContainer>
          {true ? (
            <EnlargedHomeTitle> Steven </EnlargedHomeTitle>
          ) : (
            <HomeTitle> Steven </HomeTitle>
          )}

          <ToggleContainer>
            <FormGroup row>
              <StyledLabel
                control={
                  <Switch name="switch-checked"/>
                }
                label="Plan"
                labelPlacement="end"
              />
            </FormGroup>
          </ToggleContainer>
        </HomeTitleContainer>

        {renderFilterOptions()}
        {renderHideButton()}
      </Container>
    );
  },
);

const Container = styled.div`
  display: flex;
  margin-bottom: 16px;
  position: relative;
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
  padding-bottom: 4px;
  margin-left: 4px;
  margin-right: 4px;
`;

const ToggleContainer = styled.div`
  margin-left: 32px;
`;

const HideButtonContainer = styled.div`
  display: flex;
  &: hover {
    cursor: pointer;
  }
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
