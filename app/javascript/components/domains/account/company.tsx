import React, { useState } from "react";
import styled from "styled-components";
import { Label, Input } from "~/components/shared/input";
import { useMst } from "~/setup/root";
import { useTranslation } from "react-i18next";

export const Company = (): JSX.Element => {
  const {
    companyStore: { company },
  } = useMst();
  const { t } = useTranslation();
  return (
    <div>
      <StyledLabel htmlFor="name">{t("company.name")}</StyledLabel>
      <StyledInput disabled={true} name="name" onChange={() => {}} value={company.name} />
    </div>
  );
};

const StyledLabel = styled(Label)`
  font-size: 16px;
  font-weight: bold;
`;

const StyledInput = styled(Input)`
  border-color: ${props => props.theme.colors.grey40} !important;
  border-radius: 5px;
`;
