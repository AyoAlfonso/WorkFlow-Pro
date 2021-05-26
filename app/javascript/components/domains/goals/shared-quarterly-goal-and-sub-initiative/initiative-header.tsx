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
import moment from "moment";

interface IInitiativeHeaderProps {
  itemType: string;
  item: any;
  editable: boolean;
  setAnnualInitiativeId: React.Dispatch<React.SetStateAction<number>>;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setAnnualInitiativeModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  annualInitiativeId: number;
  annualInitiativeDescription: string;
  showDropdownOptionsContainer: boolean;
  setShowDropdownOptionsContainer: React.Dispatch<React.SetStateAction<boolean>>;
  goalYearString: string;
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
}: IInitiativeHeaderProps): JSX.Element => {
  const { quarterlyGoalStore, subInitiativeStore, sessionStore } = useMst();
  const { t } = useTranslation();
  const descriptionRef = useRef(null);
  const mobxStore = itemType == "quarterlyGoal" ? quarterlyGoalStore : subInitiativeStore;

  return (
    <>
      {item.closedAt && (
        <ClosedStatusBannerContainer>
          {itemType == "quarterlyGoal"
            ? t("quarterlyGoal.cardClosed", {
              title: sessionStore.companyStaticData[1].value
            })
              : t("subInitiative.cardClosed", {
                title: sessionStore.companyStaticData[2].value
              })}
          . {t("annualInitiative.createdOn")} {moment(item.createdAt).format("MMM Do, YYYY")}.
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
          <GoalText>
            driving{" "}
            <UnderlinedGoalText
              onClick={() => {
                setModalOpen(false);
                setAnnualInitiativeId(annualInitiativeId);
                setAnnualInitiativeModalOpen(true);
              }}
            >
              {annualInitiativeDescription}
            </UnderlinedGoalText>
          </GoalText>
          <DetailsContainer>
            <YearText type={"small"}>Q{item.quarter}</YearText>
            <OwnedBySection
              ownedBy={item.ownedBy}
              marginLeft={"5px"}
              marginRight={"5px"}
              marginTop={"auto"}
              marginBottom={"auto"}
              type={itemType}
              disabled={item.closedInitiative}
            />
          </DetailsContainer>
        </TitleContainer>
        {!item.closedAt && (
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
        )}
      </HeaderContainer>
    </>
  );
};

const HeaderContainer = styled.div`
  display: flex;
`;

const TitleContainer = styled.div``;

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

const CloseIconContainer = styled.div`
  &:hover {
    cursor: pointer;
  }
`;

const StyledContentEditable = styled(ContentEditable)`
  font-weight: bold;
  font-size: 20px;
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 4px;
  padding-right: 4px;
  margin-right: -4px;
`;

const DetailsContainer = styled.div`
  display: flex;
  margin-left: 4px;
`;

const YearText = styled(Text)`
  color: ${props => props.theme.colors.greyActive};
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
