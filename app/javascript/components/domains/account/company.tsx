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
        <Label htmlFor="name">{t("company.name")}</Label>
        <Input disabled={true} name="name" onChange={() => {}} value={company.name} />
        <Label htmlFor="logo">{t("company.logo")}</Label>
        {company.logoUrl ? <img src={company.logoUrl}></img> : "No Company Logo set"}
        <Label htmlFor="fiscal_year_start">{t("company.fiscalYearStartDate")}</Label>
        <Input
          disabled={true}
          name="fiscal_year_start"
          onChange={() => {}}
          value={company.fiscalYearStart}
        />
        <Label htmlFor="timezone">{t("company.timezone")}</Label>
        <Input disabled={true} name="timezone" onChange={() => {}} value={company.timezone} />
      </div>
    );
  },
);
