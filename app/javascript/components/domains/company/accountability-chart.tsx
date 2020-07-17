import * as React from "react";
import { observer } from "mobx-react";
import { useMst } from "../../../setup/root";
import { Loading } from "~/components/shared/loading";
import { Heading } from "~/components/shared/heading";

export const AccountabilityChart = observer(
  (): JSX.Element => {
    const {
      companyStore: { company },
    } = useMst();
    return (
      <div>
        {company ? (
          <>
            <Heading type={"h3"} color={"black"}>
              Accountability Chart
            </Heading>
            <div
              className="trix-content"
              dangerouslySetInnerHTML={{ __html: company.accountabilityChartContent }}
            ></div>
            <br />
            <Heading type={"h3"} color={"black"}>
              Strategic Plan
            </Heading>
            <div
              className="trix-content"
              dangerouslySetInnerHTML={{ __html: company.strategicPlanContent }}
            ></div>
          </>
        ) : (
          <Loading />
        )}
      </div>
    );
  },
);
