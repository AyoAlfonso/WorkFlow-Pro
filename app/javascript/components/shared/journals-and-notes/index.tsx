import * as React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { layout, LayoutProps, space, SpaceProps } from "styled-system";
import { Text } from "~/components/shared/text";
import { Icon } from "~/components/shared/icon";

export const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-right: 20px;
`;

export const HeadingContainer = styled.div`
  margin: 32px 0px 32px 0px;
  width: 100%;
`;

export const BodyContainer = styled.div`
  display: grid;
  grid-template-columns: minmax(370px, auto) minmax(205px, 1fr) minmax(440px, 3fr);
  width: 100%;
`;

export const FilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 60vh;
  padding: 15px 0px 15px 0px;
`;

export const ItemListContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 60vh;
  padding: 15px 25px 15px 25px;
  overflow-y: auto;
`;

export const EntryContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 60vh;
  padding: 15px 5px 15px 5px;
  overflow-y: auto;
`;

type SpaceLayoutProps = LayoutProps & SpaceProps;

interface IItemContainerProps extends SpaceLayoutProps {
  selected?: boolean;
}

export const ItemCardContainer = styled.div<IItemContainerProps>`
  ${layout}
  ${space}
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  border-radius: 10px;
  box-shadow: 1px 3px 6px 1px rgba(0, 0, 0, 0.1);
  color: ${props => (props.selected ? props.theme.colors.primary100 : props.theme.colors.grey100)};
  background: ${props =>
    props.selected ? props.theme.colors.backgroundBlue : props.theme.colors.white};
  margin-bottom: 12px;
  padding: 8px 8px 8px 8px;

  &:hover {
    cursor: pointer;
    background: rgba(0, 0, 0, 0.02);
  }

  &:active {
    box-shadow: 1px 3px 6px 1px rgba(0, 0, 0, 0.2);
    transform: translate(1px, 1px);
    background: ${props => props.theme.colors.backgroundBlue};
  }

  &:focus {
    outline: 0;
  }
`;

const ItemTitleContainer = styled.div`
  color: inherit;
  height: 16px;
  margin-bottom: 16px;
  font-size: 12px;
`;

const ItemBodyContainer = styled.div`
  color: inherit;
  font-size: 12px;
  font-weight: 600;
`;

interface IItemCardProps {
  titleText?: string;
  bodyText?: string;
  onClick?: () => void;
  selected?: boolean;
}

export const ItemCard = ({
  bodyText,
  titleText,
  onClick,
  selected,
}: IItemCardProps): JSX.Element => {
  return (
    <ItemCardContainer onClick={onClick} selected={selected}>
      <ItemTitleContainer>{titleText}</ItemTitleContainer>
      <ItemBodyContainer>{bodyText}</ItemBodyContainer>
    </ItemCardContainer>
  );
};

export const EntryHeadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
  padding-left: 8px;
`;

export const EntryCardHeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const EntryBodyCard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  border-radius: 10px;
  box-shadow: 1px 3px 6px 1px rgba(0, 0, 0, 0.15);
  margin: 8px;
  padding: 8px;
`;

export const ActionButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const IconContainer = styled.div`
  color: ${props => props.theme.colors.grey40};
  &: hover {
    cursor: pointer;
    color: ${props => props.theme.colors.grey100};
  }
  &: focus {
    outline: 0;
  }
  &:active {
    transform: translate(1px, 1px);
  }
`;

interface IIconButtonContainerProps {
  onClick: () => void;
  children?: any;
}

export const IconButtonContainer = ({
  onClick,
  children,
}: IIconButtonContainerProps): JSX.Element => (
  <IconContainer onClick={onClick}>{children}</IconContainer>
);

export const AvatarContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

export const NoEntrySelectedContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export interface INoSelectedItems {
  text: string;
}

export const NoSelectedItems = ({ text }: INoSelectedItems): JSX.Element => {
  const { t } = useTranslation();
  return (
    <NoEntrySelectedContainer>
      <Icon icon={"Empty-Pockets"} size={"86px"} iconColor={"grey40"} mb={"20px"} />
      <Text fontSize={"18px"} fontWeight={600} fontFamily={"Exo"}>
        {t("journals.selectEntry")}
      </Text>
      <Text fontSize={"12px"} fontWeight={400} color={"grey40"}>
        {t("journals.emptyList")}
      </Text>
      <Text fontSize={"12px"} fontWeight={400} color={"grey40"}>
        {text}
      </Text>
    </NoEntrySelectedContainer>
  );
};

const FilterOptionContainer = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${props => props.theme.colors.borderGrey};
  padding: 8px;

  &:hover {
    cursor: pointer;
    background: rgba(0, 0, 0, 0.02);
  }

  &:active {
    transform: translate(1px, 1px);
    background: ${props => props.theme.colors.backgroundBlue};
  }

  &:focus {
    outline: 0;
  }
`;

interface IFilterOptionLabelContainerProps {
  selected?: boolean;
  children: any;
}

const FilterOptionLabelContainer = styled.div<IFilterOptionLabelContainerProps>`
  color: ${props => (props.selected ? props.theme.colors.primary100 : props.theme.colors.text)};
  background: ${props =>
    props.selected ? props.theme.colors.backgroundBlue : props.theme.colors.white};
  font-family: Lato;
  font-size: 12px;
  padding: 2px 4px 2px 4px;
`;

export interface IFilterOptionProps {
  onClick?: () => void;
  selected?: boolean;
  option: {
    label: string;
  };
}

export const FilterOption = ({
  onClick,
  selected,
  option: { label },
}: IFilterOptionProps): JSX.Element => {
  return (
    <FilterOptionContainer onClick={onClick}>
      <FilterOptionLabelContainer selected={selected}>{label}</FilterOptionLabelContainer>
    </FilterOptionContainer>
  );
};
