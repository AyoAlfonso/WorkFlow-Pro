import styled from "styled-components";
import { Text } from "~/components/shared/text";

export const Container = styled.div`
  width: 100%;
  height: 600px;
`;

export const BodyContainer = styled.div`
  display: flex;
  padding: 16px;
`;

export const PersonalInfoContainer = styled.div`
  width: 70%;
  padding-right: 30px;
`;

export const ProfilePhotoSection = styled.div`
  width: 30%;
`;

export const HeaderContainer = styled.div`
  padding: 16px;
  border-bottom: 1px solid #e3e3e3;
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
`;

export const SaveButtonContainer = styled.div`
  display: flex;
  margin-top: 120px;
  margin-right: 20px;
`;