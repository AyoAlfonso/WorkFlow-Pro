import React, { useState } from "react";
import * as R from "ramda";
import styled from "styled-components";
import { Label, Input, Select } from "~/components/shared/input";
import { useMst } from "~/setup/root";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import { Can } from "~/components/shared/auth/can";
import { Button } from "~/components/shared/button";

export const Company = observer(
  (): JSX.Element => {
    const {
      companyStore: { company },
      sessionStore: { staticData },
    } = useMst();
    const [name, setName] = useState(company.name);
    const [timezone, setTimezone] = useState(company.timezone);
    const { t } = useTranslation();
    return (
      <Can
        action={"update-company-details"}
        data={null}
        no={
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
        }
        yes={
          <div>
            <Label htmlFor="name">{t("company.name")}</Label>
            <Input
              name="name"
              onChange={e => {
                setName(e.target.value);
              }}
              value={name}
            />
            <Label htmlFor="logo">{t("company.logo")}</Label>
            {company.logoUrl ? <img src={company.logoUrl}></img> : "No Company Logo set"}
            <Label htmlFor="fiscal_year_start">{t("company.fiscalYearStartDate")}</Label>
            <Input name="fiscal_year_start" onChange={() => {}} value={company.fiscalYearStart} />
            <Label htmlFor="timezone">{t("company.timezone")}</Label>
            <Select
              name="timezone"
              onChange={e => {
                setTimezone(e.target.value);
              }}
              value={timezone}
            >
              {R.map(
                (zone: string) => (
                  <option key={zone}>{zone}</option>
                ),
                staticData.timezones,
              )}
            </Select>
            <Button
              small
              variant={"primary"}
              onClick={() => {}}
              style={{
                marginLeft: "auto",
                marginTop: "auto",
                marginBottom: "24px",
                marginRight: "24px",
              }}
            >
              {t("general.save")}
            </Button>
          </div>
        }
      />
    );
  },
);
