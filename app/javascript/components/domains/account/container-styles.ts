import styled from "styled-components";
import { Text } from "~/components/shared/text";
import { space, SpaceProps } from "styled-system";

export const Container = styled.div`
  width: 100%;
  height: 600px;
`;

export const StretchContainer = styled.div`
  width: 100%;
  height: 100%;
  min-height: 600px;
`;

export const BodyContainer = styled.div`
  display: flex;
  padding: 16px;
`;

export const PersonalInfoContainer = styled.div`
  width: 70%;
  padding-right: 10%;
`;

type ProfilePhotoSectionType = {
  display?: string;
};
export const ProfilePhotoSection = styled.div<ProfilePhotoSectionType>`
  width: 30%;
  display: ${props => props.display || "flex"};
  justify-content: center;
  align-items: center;
`;

export const ProfilePhotoWrapper = styled.div``;

export const HeaderContainer = styled.div`
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #e3e3e3;
  display: flex;
  justify-content: space-between;
  height: 30px;
`;

export const HeaderText = styled(Text)`
  font-size: 20px;
  font-weight: bold;
  margin: 0;
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
  margin-top: 120px;
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
