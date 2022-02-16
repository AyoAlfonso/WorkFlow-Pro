import styled from "styled-components";
import { Text } from "~/components/shared/text";
import { space, SpaceProps } from "styled-system";

export const Container = styled.div`
  width: 100%;
`;

export const StretchContainer = styled.div`
  width: 100%;
  height: 100%;
  min-height: 600px;
`;

export const BodyContainer = styled.div`
  display: flex;
`;

type PersonalInfoContainerProps = {
  mr?: string;
};

export const PersonalInfoContainer = styled.div<PersonalInfoContainerProps>`
  width: 70%;
  padding-right: 10%;
  margin-right: ${props => (props.mr ? props.mr : "")};
`;

type ProfilePhotoSectionType = {
  display?: string;
};
export const ProfilePhotoSection = styled.div<ProfilePhotoSectionType>`
  width: 30%;
  display: ${props => props.display || "flex"};
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
`;

export const ProfilePhotoWrapper = styled.div``;

export const HeaderContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  height: 30px;
  margin-bottom: 24px;
`;

export const HeaderText = styled(Text)`
  font-size: 20px;
  font-weight: bold;
  font-family: Exo;
  margin: 0;
  color: ${props => props.theme.colors.black};
`;

export const PhotoContainer = styled.div`
  text-align: center;
`;

export const PhotoModificationButtonsSection = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 16px;
  width: 250px;
  margin-left: auto;
  margin-right: auto;
`;

export const SaveButtonContainer = styled.div`
  display: flex;
  margin-top: 100px;
  margin-right: 20px;
`;

export const ModalButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const CenteredTableContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

export const SpacedTableContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
`;

export const LeftAlignedTableContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 8px;
`;

export const LeftAlignedColumnListTableContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;
`;

export const IconContainer = styled.div<SpaceProps>`
  ${space}
  &:hover {
    cursor: pointer;
  }
`;
