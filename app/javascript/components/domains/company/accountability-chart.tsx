import * as React from "react";
import { observer } from "mobx-react";
import { useMst } from "../../../setup/root";
import { useTranslation } from "react-i18next";
import { Loading } from "~/components/shared/loading";
import { Heading } from "~/components/shared/heading";
import styled from "styled-components";

export const AccountabilityChart = observer(
  (): JSX.Element => {
    const {
      companyStore: { company },
    } = useMst();
    const { t } = useTranslation();
    return (
      <div>
        {company ? (
          <>
            <HeaderText color={"black"}>{t("company.accountabilityChart")}</HeaderText>
            <div
              className="trix-content"
              dangerouslySetInnerHTML={{ __html: company.accountabilityChartContent }}
            ></div>
          </>
        ) : (
          <Loading />
        )}
      </div>
    );
  },
);

const HeaderText = styled.p`
  font-size: 24px;
  font-weight: 600;
  font-family: Exo;
`;
