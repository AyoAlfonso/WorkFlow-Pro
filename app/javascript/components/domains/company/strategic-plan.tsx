import * as React from "react";
import { observer } from "mobx-react";
import { useMst } from "../../../setup/root";
import { Loading } from "~/components/shared/loading";
import { Heading } from "~/components/shared/heading";

export const StrategicPlan = observer(
  (): JSX.Element => {
    const {
      companyStore: { company },
    } = useMst();
    return (
      <div>
        {company ? (
          <>
            <Heading type={"h1"} color={"black"}>
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
