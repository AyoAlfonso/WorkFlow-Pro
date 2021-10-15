import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { Loading } from "~/components/shared/loading";
import { useMst } from "~/setup/root";
import styled from "styled-components";
import * as R from "ramda";
import { Input } from "~/components/shared";
import {
  StyledInput,
  InputHeaderWithComment,
  FormElementContainer,
  InputFromUnitType,
} from "../../scorecard/shared/modal-elements";
import { toJS } from "mobx";

export const KpiComponent = observer(
  (props): JSX.Element => {
    const { keyPerformanceIndicatorStore, scorecardStore, sessionStore, companyStore } = useMst();
    const { createScorecardLog } = keyPerformanceIndicatorStore;
    const { kpis } = scorecardStore;
    const { company } = companyStore;

    const {
      profile: { id },
    } = sessionStore;

    let valueForComment;
    const [value, setValue] = useState(undefined);
    const [comment, setComment] = useState("");

    useEffect(() => {
      keyPerformanceIndicatorStore.load();
      scorecardStore.getScorecard({ ownerType: "user", ownerId: id });
      companyStore.load();
    }, [id]);

    const handleBlur = kpiId => {
      if (!value || !valueForComment) {
        const log = {
          keyPerformanceIndicatorId: kpiId,
          userId: id,
          score: !value ? valueForComment : value,
          note: comment != "" ? comment : null,
          week: company.currentFiscalWeek,
          fiscalYear: company.currentFiscalYear,
          fiscalQuarter: Math.floor((company.currentFiscalWeek - 1) / 13) + 1,
        };
        createScorecardLog(log);
      }
    };

    const renderHeading = (): JSX.Element => {
      return (
        <Container>
          <StyledHeader>
            What's the status on your KPIs from week of <u>June 28th</u>?
          </StyledHeader>
        </Container>
      );
    };

    const renderLoading = () => (
      <LoadingContainer>
        <BodyContainer>
          <Loading />
        </BodyContainer>
      </LoadingContainer>
    );

    const renderKPIs = (): JSX.Element => {
      return (
        <>
          {kpis.map(kpi => (
            <Container key={kpi.id}>
              <SubHeaderText>
                {`${kpi.title} ${kpi.greaterThan ? `>` : `<`} ${kpi.targetValue}${
                  kpi.unitType === "percentage" ? `%` : ""
                }`}
              </SubHeaderText>
              <ValueInputContainer>
                <FormElementContainer>
                  <InputFromUnitType
                    unitType={kpi.unitType}
                    placeholder={"Add the new value..."}
                    onChange={e => setValue(e.target.value)}
                    defaultValue={kpi.scorecardLogs[kpi.scorecardLogs.length - 1]?.score || 0}
                    onBlur={() => handleBlur(kpi.id)}
                  />
                </FormElementContainer>
                <ValueSpan>{`${kpi.targetValue}${
                  kpi.unitType === "percentage" ? `%` : ""
                }`}</ValueSpan>
              </ValueInputContainer>
              <CommentContainer>
                <FormElementContainer>
                  <InputHeaderWithComment
                    comment={"optional"}
                    fontSize={"14px"}
                    childFontSize={"12px"}
                  />
                  <StyledInput
                    placeholder={"Add a comment..."}
                    onChange={e => {
                      setComment(e.target.value);
                    }}
                    onBlur={() => {
                      if (!value) {
                        valueForComment = kpi.scorecardLogs[kpi.scorecardLogs.length - 1]?.score;
                      }
                      handleBlur(kpi.id);
                    }}
                  />
                </FormElementContainer>
              </CommentContainer>
            </Container>
          ))}
        </>
      );
    };

    return (
      <>
        {R.isNil(kpis) ? (
          renderLoading()
        ) : (
          <>
            {renderHeading()}
            {renderKPIs()}
          </>
        )}
      </>
    );
  },
);

const Container = styled.div`
  border-bottom: 1px solid ${props => props.theme.colors.borderGrey};
  @media only screen and (max-width: 768px) {
    padding: 0 16px;
  }
`;

const LoadingContainer = styled.div``;

const BodyContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 8px;
  justify-content: center;
`;

const StyledHeader = styled.h1`
  margin-bottom: 25px;
  @media only screen and (max-width: 768px) {
    font-size: 24px;
  }
`;

const SubHeaderText = styled.span`
  display: inline-block;
  font-size: 18px;
  font-weight: bold;
  margin-top: 15px;
  margin-bottom: 25px;
`;

const ValueSpan = styled.span`
  font-weight: bold;
  display: inline-block;
  margin-left: 50px;
  @media only screen and (max-width: 768px) {
    margin-left: 30px;
  }
`;

const CommentContainer = styled.div`
  width: 70%;
  margin-bottom: 15px;
  @media only screen and (max-width: 768px) {
    width: 80%;
  }
`;

const ValueInputContainer = styled.div`
  width: 30%;
  align-items: center;
  display: flex;
  margin-bottom: 20px;
  justify-content: space-between;
  @media only screen and (max-width: 768px) {
    width: 70%;
  }
`;
