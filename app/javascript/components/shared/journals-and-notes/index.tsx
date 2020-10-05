import * as React from "react";
import * as R from "ramda";
import styled from "styled-components";
import { color, ColorProps, layout, LayoutProps, space, SpaceProps } from "styled-system";
import { boolean } from "@storybook/addon-knobs";

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
  grid-template-columns: 20% 20% 60%;
  width: 100%;
`;

export const FilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 70vh;
  padding: 15px 0px 15px 0px;
`;

export const ItemListContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-eight: 70vh;
  padding: 15px 25px 15px 25px;
  overflow-y: auto;
`;

export const EntryContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 70vh;
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
  color: ${props =>
    props.selected ? props.theme.colors.primary100 : props.theme.colors.greyActive};
  margin-bottom: 12px;
  padding: 8px 12px 12px 12px;

  &:hover {
    cursor: pointer;
    background: rgba(0, 0, 0, 0.02);
  }

  &:active {
    box-shadow: 1px 3px 6px 1px rgba(0, 0, 0, 0.2);
    transform: translate(1px, 1px);
  }

  &:focus {
    outline: 0;
    background-color: ${props => props.theme.colors.backgroundBlue};
  }
`;

const ItemTitleContainer = styled.div`
  color: inherit;
  height: 16px;
  margin-bottom: 12px;
`;

const ItemBodyContainer = styled.div`
  color: inherit;
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
    color: ${props => props.theme.colors.greyActive};
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
