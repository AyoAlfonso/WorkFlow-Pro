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
import { useParams } from "react-router-dom";
import moment from "moment";
import { toJS } from "mobx";
import { useTranslation } from "react-i18next";
import { EmptyState } from "./empty-state";

export const KpiComponent = observer(
  (props): JSX.Element => {
    const { keyPerformanceIndicatorStore, scorecardStore, sessionStore, companyStore } = useMst();
    const { createScorecardLog } = keyPerformanceIndicatorStore;
    const { kpis } = scorecardStore;
    const { company } = companyStore;
    const { t } = useTranslation();

    const {
      profile
    } = sessionStore;

    const id = profile?.id

    const { weekOf } = useParams();

    let valueForComment;
    const [value, setValue] = useState(undefined);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      scorecardStore
        .getScorecard({ ownerType: "user", ownerId: id, showAll: true })
        .then(() => setLoading(false));
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
          fiscalYear: company.yearForCreatingAnnualInitiatives,
          fiscalQuarter: Math.floor((company.currentFiscalWeek - 1) / 13) + 1,
        };
        createScorecardLog(log);
      }
    };

    const renderHeading = (): JSX.Element => {
      return (
        <Container>
          <StyledHeader>
            What's the status on your KPIs from week of <u>{moment(weekOf).format("MMMM D")}</u>?
          </StyledHeader>
        </Container>
      );
    };

    const renderLoading = () => (
      <LoadingContainer>
        <Loading />
      </LoadingContainer>
    );

    const renderKPIs = (): JSX.Element => {
      return (
        <>
          {!kpis.length ? (
            <EmptyState
              heading={t("weeklyCheckIn.kpi.emptyText")}
              infoText={t("weeklyCheckIn.kpi.create")}
            />
          ) : (
            <>
              {renderHeading()}
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
                        defaultValue={kpi.scorecardLogs[kpi.scorecardLogs?.length - 1]?.score || 0}
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
                            valueForComment =
                              kpi.scorecardLogs[kpi.scorecardLogs?.length - 1]?.score;
                          }
                          handleBlur(kpi.id);
                        }}
                      />
                    </FormElementContainer>
                  </CommentContainer>
                </Container>
              ))}
            </>
          )}
        </>
      );
    };

    return <>{loading ? <>{renderLoading()}</> : <>{renderKPIs()}</>}</>;
  },
);

const Container = styled.div`
  border-bottom: 1px solid ${props => props.theme.colors.borderGrey};
  padding-left: 16px;
  padding-right: 16px;
  @media only screen and (max-width: 768px) {
    padding: 0 16px;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 8px;
  justify-content: center;
  align-items: center;
  height: 100%;
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
