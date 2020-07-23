import React, { useState } from "react";
import styled from "styled-components";
import { Label, Input } from "~/components/shared/input";
import { useMst } from "~/setup/root";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";

export const Company = observer(
  (): JSX.Element => {
    const {
      companyStore: { company },
    } = useMst();
    const { t } = useTranslation();
    return (
      <div>
        <StyledLabel htmlFor="name">{t("company.name")}</StyledLabel>
        <StyledInput disabled={true} name="name" onChange={() => {}} value={company.name} />
        <StyledLabel htmlFor="logo">{t("company.logo")}</StyledLabel>
        {company.logoUrl ? <img src={company.logoUrl}></img> : "No Company Logo set"}
        <StyledLabel htmlFor="fiscal_year_start">{t("company.fiscalYearStartDate")}</StyledLabel>
        <StyledInput
          disabled={true}
          name="fiscal_year_start"
          onChange={() => {}}
          value={company.fiscalYearStart}
        />
        <StyledLabel htmlFor="timezone">{t("company.timezone")}</StyledLabel>
        <StyledInput disabled={true} name="timezone" onChange={() => {}} value={company.timezone} />
      </div>
    );
  },
);

const StyledLabel = styled(Label)`
  font-size: 16px;
  font-weight: bold;
`;

const StyledInput = styled(Input)`
  border-color: ${props => props.theme.colors.grey40} !important;
  border-radius: 5px;
`;
