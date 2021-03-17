import * as React from "react";
import { HomeContainerBorders } from "../../home/shared-components";
import styled from "styled-components";
import { color } from "styled-system";
import { useMst } from "~/setup/root";
import ContentEditable from "react-contenteditable";
import { RoleAdministrator, RoleCEO } from "~/lib/constants";
import { useTranslation } from "react-i18next";
import { useRef } from "react";

interface IRallyingCryProps {
  rallyingCry: string;
}

export const RallyingCry = ({ rallyingCry }: IRallyingCryProps): JSX.Element => {
  const { sessionStore, companyStore } = useMst();
  const { t } = useTranslation();
  const profile = sessionStore.profile;
  const editable = profile.role == RoleCEO || profile.role == RoleAdministrator;
  const rallyingCryRef = useRef(null);

  const visionTitle = companyStore.company.name
    ? `${companyStore.company.name} ${t("company.personalizedRallyingCrySuffix")}`
    : t("company.rallyingCry");

  return (
    <VisionContainer>
      <VisionTitle>{visionTitle}</VisionTitle>
      <StyledContentEditable
        innerRef={rallyingCryRef}
        html={rallyingCry}
        disabled={!editable}
        onChange={e => {
          if (!e.target.value.includes("<div>")) {
            companyStore.updateModelField("rallyingCry", e.target.value);
          }
        }}
        onKeyDown={key => {
          if (key.keyCode == 13) {
            rallyingCryRef.current.blur();
          }
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
