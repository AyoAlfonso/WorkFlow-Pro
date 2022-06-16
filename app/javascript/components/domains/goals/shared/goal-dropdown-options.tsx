import * as React from "react";
import styled from "styled-components";
import { Icon } from "~/components/shared/icon";
import { useEffect, useRef, useState } from "react";
import { useMst } from "~/setup/root";
import { useTranslation } from "react-i18next";
import { showToast } from "~/utils/toast-message";
import { ToastMessageConstants } from "~/constants/toast-types";

interface IGoalDropdownOptionsProps {
  setShowDropdownOptions: any;
  setModalOpen?: any;
  itemType: string;
  itemId: number | string;
  quarter?: number;
}

export const GoalDropdownOptions = ({
  setShowDropdownOptions,
  setModalOpen,
  itemType,
  itemId,
  quarter,
}: IGoalDropdownOptionsProps): JSX.Element => {
  const { annualInitiativeStore, quarterlyGoalStore, subInitiativeStore, sessionStore } = useMst();
  const optionsRef = useRef(null);

  const { t } = useTranslation();

  const annualInitiativeTitle = sessionStore.annualInitiativeTitle;
  const quarterlyGoalTitle = sessionStore.quarterlyGoalTitle;
  const subInitiativeTitle = sessionStore.subInitiativeTitle;

  useEffect(() => {
    const handleClickOutside = event => {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setShowDropdownOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [optionsRef]);

  const itemText = itemType == "annualInitiative" ? "Objective" : "Initiative";
  const quarterText = () => {
    const quarters = [1, 2, 3, 4, 4];
    return quarters[quarter];
  };

  const closeModal = () => {
    if (setModalOpen) {
      setModalOpen(false);
    }
  };

  const closeInitiative = () => {
    if (itemType == "annualInitiative") {
      if (
        confirm(
          `Are you sure you want to close this ${t<string>("annualInitiative.messageText", {
            title: annualInitiativeTitle,
          })}? Closing an Annual Objective will result in closing all of the related ${t<string>(
            "quarterlyGoal.messageText",
            {
              title: quarterlyGoalTitle,
            },
          )}s as well`,
        )
      ) {
        annualInitiativeStore.closeInitiative(itemId).then(() => {
          closeModal();
        });
      }
    } else if (itemType == "quarterlyGoal") {
      if (
        confirm(
          `Are you sure you want to close this ${t<string>("quarterlyGoal.messageText", {
            title: quarterlyGoalTitle,
          })}`,
        )
      ) {
        quarterlyGoalStore.closeGoal(itemId).then(() => {
          closeModal();
        });
      }
    } else if (itemType == "subInitiative") {
      if (
        confirm(
          `Are you sure you want to close this ${t<string>("subInitiative.messageText", {
            title: subInitiativeTitle,
          })}`,
        )
      ) {
        subInitiativeStore.closeGoal(itemId).then(() => {
          closeModal();
        });
      }
    }
  };

  const duplicateQuarterly = () => {
    if (itemType == "quarterlyGoal") {
      if (quarter < 4) {
        if (
          confirm(
            `Are you sure you want to duplicate this ${t<string>("quarterlyGoal.messageText", {
              title: quarterlyGoalTitle,
            })}?`,
          )
        ) {
          quarterlyGoalStore.duplicateGoal(itemId).then(() => {
            closeModal();
          });

          quarterlyGoalStore.closeGoal(itemId).then(() => {
            closeModal();
          });
          setShowDropdownOptions(false);
        }
      } else {
        showToast("Can not carry over from the 4th quarter", ToastMessageConstants.INFO);
        setShowDropdownOptions(false);
      }
    }
  };

  const closeAndDuplicateQuarterly = () => {
    duplicateQuarterly();
  };

  const deleteInitiative = () => {
    if (itemType == "annualInitiative") {
      if (
        confirm(
          `Are you sure you want to delete this ${t<string>("annualInitiative.messageText", {
            title: annualInitiativeTitle,
          })}`,
        )
      ) {
        annualInitiativeStore.delete(itemId).then(() => {
          closeModal();
        });
      }
    } else if (itemType == "quarterlyGoal") {
      if (
        confirm(
          t("quarterlyGoal.confirmDelete", {
            title: quarterlyGoalTitle,
          }),
        )
      ) {
        quarterlyGoalStore.delete(false, itemId).then(() => {
          closeModal();
        });
      }
    } else if (itemType == "subInitiative") {
      if (
        confirm(
          t("subInitiative.confirmDelete", {
            title: subInitiativeTitle,
          }),
        )
      ) {
        subInitiativeStore.delete(itemId).then(() => {
          closeModal();
        });
      }
    }
  };

  if (itemType == "quarterlyGoal" && quarter) {
    return (
      <Container ref={optionsRef}>
        <OptionContainer onClick={() => closeInitiative()}>
          <IconContainer>
            <StyledIcon icon={"Checkmark"} size={"15px"} />
          </IconContainer>
          <OptionText> Close {itemText} </OptionText>
        </OptionContainer>
        <OptionContainer onClick={() => closeAndDuplicateQuarterly()}>
          <IconContainer>
            <StyledIcon icon={"Duplicate"} size={"15px"} />
          </IconContainer>
          <OptionText>
            {" "}
            {"Carry Over to Q"}
            {quarterText()}
          </OptionText>
        </OptionContainer>
        <OptionContainer onClick={() => deleteInitiative()}>
          <IconContainer>
            <StyledIcon icon={"Delete"} size={"15px"} />
          </IconContainer>
          <OptionText> Delete {itemText} </OptionText>
        </OptionContainer>
      </Container>
    );
  } else {
    return (
      <Container ref={optionsRef}>
        <OptionContainer onClick={() => closeInitiative()}>
          <IconContainer>
            <StyledIcon icon={"Checkmark"} size={"15px"} />
          </IconContainer>
          <OptionText> Close {itemText} </OptionText>
        </OptionContainer>
        <OptionContainer onClick={() => deleteInitiative()}>
          <IconContainer>
            <StyledIcon icon={"Delete"} size={"15px"} />
          </IconContainer>
          <OptionText> Delete {itemText} </OptionText>
        </OptionContainer>
      </Container>
    );
  }
};

const Container = styled.div`
  position: absolute;
  background-color: ${props => props.theme.colors.white};
  box-shadow: 1px 3px 4px 2px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  z-index: 3;
  margin-left: -80px;
  margin-top: 5px;
  height: auto;
  overflow: auto;
`;

const TextContainer = styled.div`
  margin-left: 8px;
  font-size: 12px;
  margin-top: auto;
  margin-bottom: auto;
  color: ${props => props.theme.colors.black};
`;

const IconContainer = styled.div`
  color: ${props => props.theme.colors.greyInactive};
  width: 20px;
  text-align: center;
  margin-top: auto;
  margin-bottom: auto;
`;

const OptionText = styled(TextContainer)`
  color: ${props => props.theme.colors.black};
  margin-left: 8px;
  white-space: nowrap;
`;

export const StyledIcon = styled(Icon)``;

type InitialsTextProps = {
  fontSize?: string;
  fontColor?: string;
};

export const InitialsText = styled.div<InitialsTextProps>`
  font-size: ${props => props.fontSize || "12px"};
  font-weight: bold;
  margin-top: auto;
  margin-bottom: auto;
  color: ${props => props.fontColor};
`;

const OptionContainer = styled.div`
  display: flex;
  height: 24px;
  padding-left: 16px;
  padding-right: 16px;
  margin-top: 4px;
  margin-bottom: 4px;
  &: hover {
    cursor: pointer;
    background-color: ${props => props.theme.colors.primary100};
  }
  &:hover ${OptionText} {
    color: white;
  }
  &: hover ${InitialsText}{
    color: white;
  }
  &: hover ${StyledIcon}{
    color: white;
  }

`;
