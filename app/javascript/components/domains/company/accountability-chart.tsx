import * as React from "react";
import { observer } from "mobx-react";
import { useMst } from "../../../setup/root";
import { useTranslation } from "react-i18next";
import { Loading } from "~/components/shared/loading";
import { Heading } from "~/components/shared/heading";

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
            <Heading type={"h1"} color={"black"}>
              {t("company.accountabilityChart")}
            </Heading>
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
