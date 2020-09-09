import * as React from "react";
import { observer } from "mobx-react";
import { useMst } from "../../../setup/root";
import { Loading } from "~/components/shared/loading";
import { Heading } from "~/components/shared/heading";
import styled from "styled-components";

export const StrategicPlan = observer(
  (): JSX.Element => {
    const {
      companyStore: { company },
    } = useMst();
    return (
      <div>
        {company ? (
          <>
            <HeaderText type={"h1"} color={"black"}>
              The {company.name} Plan
            </HeaderText>
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

const HeaderText = styled.p`
  font-size: 24px;
  font-weight: 600;
  font-family: Exo;
`;
