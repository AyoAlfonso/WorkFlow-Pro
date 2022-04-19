import * as React from "react";
import styled from "styled-components";
import { Icon } from "~/components/shared/icon";
import { useMst } from "~/setup/root";
import { useRef } from "react";
import { DropdownOptions } from "./dropdown-options";
import { Text } from "../../../shared/text";
import ContentEditable from "react-contenteditable";
import { OwnedBySection } from "../shared/owned-by-section";
import { useTranslation } from "react-i18next";
import { baseTheme } from "~/themes";
import { toJS } from "mobx";
import moment from "moment";

interface IInitiativeHeaderProps {
  itemType: string;
  item: any;
  editable: boolean;
  setAnnualInitiativeId?: React.Dispatch<React.SetStateAction<number>>;
  setModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setAnnualInitiativeModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  annualInitiativeId: number;
  annualInitiativeDescription: string;
  showDropdownOptionsContainer?: boolean;
  setShowDropdownOptionsContainer?: React.Dispatch<React.SetStateAction<boolean>>;
  goalYearString: string;
  derivedStatus?: string;
}

export const InitiativeHeader = ({
  itemType,
  item,
  editable,
  setAnnualInitiativeId,
  setModalOpen,
  setAnnualInitiativeModalOpen,
  annualInitiativeId,
  annualInitiativeDescription,
  showDropdownOptionsContainer,
  setShowDropdownOptionsContainer,
  goalYearString,
  derivedStatus,
}: IInitiativeHeaderProps): JSX.Element => {
  const { quarterlyGoalStore, subInitiativeStore, sessionStore, companyStore } = useMst();
  const { currentFiscalYear, currentFiscalQuarter } = companyStore.company;
  const { t } = useTranslation();
  const descriptionRef = useRef(null);
  const mobxStore = itemType == "quarterlyGoal" ? quarterlyGoalStore : subInitiativeStore;
  const initiativeType = itemType == "quarterlyGoal" ? "quarterly_initiative" : "sub_initiative";
  const initiativeValue = toJS(
    sessionStore?.companyStaticData?.find(company => company.field === initiativeType).value,
  );

  const {
    warningRed,
    tango,
    finePine,
    grey30,
    grey10,
    almostPink,
    lightYellow,
    lightFinePine,
    primary100,
    primary20,
  } = baseTheme.colors;

  const determineStatusLabel = (status: string) => {
    switch (status) {
      case "incomplete":
        return (
          <StatusBadge color={warningRed} backgroundColor={almostPink}>
            Behind
          </StatusBadge>
        );
      case "in_progress":
        return (
          <StatusBadge color={tango} backgroundColor={lightYellow}>
            Needs Attention
          </StatusBadge>
        );
      case "completed":
        return (
          <StatusBadge color={finePine} backgroundColor={lightFinePine}>
            On Track
          </StatusBadge>
        );
      case "done":
        return (
          <StatusBadge color={primary100} backgroundColor={primary20}>
            Completed
          </StatusBadge>
        );
      default:
        return (
          <StatusBadge color={grey30} backgroundColor={grey10}>
            None
          </StatusBadge>
        );
    }
  };

  return (
    <>
      {item.closedAt && (
        <ClosedStatusBannerContainer>
          {itemType == "quarterlyGoal"
            ? t("quarterlyGoal.cardClosed", {
                title: sessionStore.companyStaticData[1].value,
              })
            : t("subInitiative.cardClosed", {
                title: sessionStore.companyStaticData[2].value,
              })}
          . {t("quarterlyGoal.createdOn")} {moment(item.createdAt).format("MMM Do, YYYY")}.
          <AnnualInitiativeActionContainer>
            <DropdownOptions
              editable={editable}
              showDropdownOptionsContainer={showDropdownOptionsContainer}
              setShowDropdownOptionsContainer={setShowDropdownOptionsContainer}
              setParentModalOpen={setModalOpen}
              itemType={itemType}
              item={item}
            />
            <CloseIconContainer onClick={() => setModalOpen(false)}>
              <Icon icon={"Close"} size={"16px"} iconColor={"grey80"} />
            </CloseIconContainer>
          </AnnualInitiativeActionContainer>
        </ClosedStatusBannerContainer>
      )}
      <HeaderContainer>
        <TitleContainer>
          <StyledContentEditable
            innerRef={descriptionRef}
            html={item.description}
            disabled={!editable}
            onChange={e => {
              if (!e.target.value.includes("<div>")) {
                mobxStore.updateModelField("description", e.target.value);
              }
            }}
            onKeyDown={key => {
              if (key.keyCode == 13) {
                descriptionRef.current.blur();
              }
            }}
            onBlur={() => mobxStore.update()}
          />
          {!item.closedAt && (
            <AnnualInitiativeActionContainer>
              <DropdownOptions
                editable={editable}
                showDropdownOptionsContainer={showDropdownOptionsContainer}
                setShowDropdownOptionsContainer={setShowDropdownOptionsContainer}
                setParentModalOpen={setModalOpen}
                itemType={itemType}
                item={item}
                quarter={quarterlyGoalStore.quarterlyGoal.quarter || companyStore.onboardingCompany.quarterForCreatingQuarterlyGoals}
              />
              <CloseIconContainer onClick={() => setModalOpen(false)}>
                <Icon icon={"Close"} size={"16px"} iconColor={"grey80"} />
              </CloseIconContainer>
            </AnnualInitiativeActionContainer>
          )}
        </TitleContainer>
        <DetailsContainer>
          {currentFiscalYear <= item.fiscalYear && currentFiscalQuarter < item.quarter ? (
            <UpcomingBadgeContainer>
              <UpcomingCircleIcon />
              <UpcomingText>Upcoming</UpcomingText>
            </UpcomingBadgeContainer>
          ) : (
            determineStatusLabel(derivedStatus)
          )}
          <IconContainer>
            <Icon icon={"Initiative"} size={"16px"} iconColor={"grey80"} />
            <YearText type={"small"}>{initiativeValue}</YearText>
          </IconContainer>
          <IconContainer>
            <Icon icon={"Deadline-Calendar"} size={"16px"} iconColor={"grey80"} />
            <YearText type={"small"}>Q{item.quarter}</YearText>
          </IconContainer>
          <OwnedBySection
            ownedBy={item.ownedBy}
            marginLeft={"0px"}
            marginRight={"0px"}
            marginTop={"auto"}
            marginBottom={"auto"}
            type={itemType}
            disabled={item.closedInitiative}
          />
        </DetailsContainer>
      </HeaderContainer>
    </>
  );
};

const HeaderContainer = styled.div`
  margin-bottom: 24px;
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
`;

const GoalText = styled(Text)`
  font-size: 15px;
  margin-left: 4px;
  color: ${props => props.theme.colors.grey80};
`;

const UnderlinedGoalText = styled.span`
  font-weight: bold;
  text-decoration: underline;
  &: hover {
    cursor: pointer;
  }
`;

const DescriptionContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const AnnualInitiativeActionContainer = styled.div`
  display: flex;
  margin-left: auto;
`;

const IconContainer = styled.div`
  margin-top: auto;
  margin-bottom: auto;
  display: flex;
  align-items: center;
  margin-right: 16px;
`;

const CloseIconContainer = styled.div`
  &:hover {
    cursor: pointer;
  }
`;

const StyledContentEditable = styled(ContentEditable)`
  font-weight: bold;
  font-size: 20px;
  font-family: Exo;
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 4px;
  padding-right: 4px;
  margin-right: -4px;
  color: ${props => props.theme.colors.black};
`;

const DetailsContainer = styled.div`
  display: flex;
  margin-left: 4px;
  align-items: center;
`;

const YearText = styled(Text)`
  color: ${props => props.theme.colors.greyActive};
  margin-left: 8px;
  white-space: nowrap;
`;

const ClosedStatusBannerContainer = styled.div`
  background-image: repeating-linear-gradient(
    150deg,
    #feecea,
    #feecea 20px,
    #f2e2e4 20px,
    #f2e2e4 25px
  );
  border-radius: 4px;
  text-align: left;
  font: normal normal bold 16px/16px Lato;
  letter-spacing: 0px;
  color: ${props => props.theme.colors.black};
  opacity: 1;
  padding: 40px 5%;
  display: flex;
  justify-content: space-between;
  height: 20px;
`;

type StatusBadgeProps = {
  backgroundColor: string;
  color: string;
};

const StatusBadge = styled("span")<StatusBadgeProps>`
  display: inline-block;
  font-size: 16px;
  white-space: nowrap;
  border-radius: 3px;
  padding: 2px 4px;
  margin-right: 16px;
  font-weight: bold;
  background-color: ${props => props.backgroundColor};
  color: ${props => props.color};
`;

export const UpcomingCircleIcon = styled.div`
  display: inline-flex;
  background: ${props => props.theme.colors.primary100};
  width: 16px;
  height: 16px;
  border-radius: 50%;
  font-size: 21px;
  margin-right: 8px;
`;

export const UpcomingText = styled(Text)`
  font-size: 16px;
  font-weight: bold;
  margin: 0;
  color: ${props => props.theme.colors.primary100};
`;

export const UpcomingBadgeContainer = styled.div`
  display: flex;
  align-items: center;
  padding-right: 16px;
  margin-right: 16px;
  border-right: 1px solid ${props => props.theme.colors.greyInactive};
  height: 25px;
  align-self: center;
`;
