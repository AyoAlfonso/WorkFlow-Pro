import * as React from "react";
import { HomeContainerBorders } from "../../home/shared-components";
import styled from "styled-components";
import { color } from "styled-system";
import { useMst } from "~/setup/root";
import ContentEditable from "react-contenteditable";

interface IRallyingCryProps {
  rallyingCry: string;
}

export const RallyingCry = ({ rallyingCry }: IRallyingCryProps): JSX.Element => {
  const { sessionStore, companyStore } = useMst();
  const profile = sessionStore.profile;
  const editable = profile.role == "ceo" || profile.role == "admin";

  return (
    <VisionContainer>
      <VisionTitle>Rallying Cry</VisionTitle>
      <StyledContentEditable
        html={rallyingCry}
        disabled={!editable}
        onChange={e => {
          companyStore.updateModelField("rallyingCry", e.target.value);
        }}
        onBlur={() => companyStore.updateCompanyFromModel()}
      />
    </VisionContainer>
  );
};

const VisionContainer = styled(HomeContainerBorders)`
  height: 60px;
  display: flex;
`;

const VisionTitle = styled.p`
  ${color}
  font-size: 20px;
  color: ${props => props.theme.colors.primary100};
  margin-top: auto;
  margin-bottom: auto;
  margin-left: 16px;
  display: flex;
  align-items: center;
  height: inherit;
  position: absolute;
`;

const StyledContentEditable = styled(ContentEditable)`
  font-size: 15px;
  margin-left: auto;
  margin-right: auto;
  margin-top: auto;
  margin-bottom: auto;
  padding: 5px;
`;
