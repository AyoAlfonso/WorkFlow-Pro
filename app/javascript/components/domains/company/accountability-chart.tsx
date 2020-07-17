import * as React from "react";
import { observer } from "mobx-react";
import { useMst } from "../../../setup/root";
import { Loading } from "../../shared/loading";

export const AccountabilityChart = observer(
  (): JSX.Element => {
    const {
      companyStore: { company },
    } = useMst();
    return (
      <div>
        {company ? (
          <>
            <div
              className="trix-content"
              dangerouslySetInnerHTML={{ __html: company.accountabilityChartContent }}
            ></div>
            <br />
            <div dangerouslySetInnerHTML={{ __html: company.strategicPlanContent }}></div>
          </>
        ) : (
          <Loading />
        )}
      </div>
    );
  },
);
