import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Avatar, Text } from "~/components/shared";
import { StatusBadge } from "~/components/shared/status-badge";
import { useMst } from "~/setup/root";
import { baseTheme } from "~/themes";
import { Loading } from "~/components/shared/loading";
import { sortByDate } from "~/utils/sorting";
import { toJS } from "mobx";
import { titleCase } from "~/utils/camelize";
interface InitiativeInsightsProps {
  insightsToShow: Array<any>;
}

export const KpiInsights = ({ insightsToShow }: InitiativeInsightsProps): JSX.Element => {
  const {
    sessionStore,
    userStore,
    companyStore: { company },
    keyPerformanceIndicatorStore,
  } = useMst();
  const { allKPIs } = keyPerformanceIndicatorStore;
  const {
    fadedYellow,
    fadedGreen,
    fadedRed,
    successGreen,
    poppySunrise,
    warningRed,
    primary100,
    backgroundGrey,
    greyActive,
    white,
    tango,
    dairyCream,
  } = baseTheme.colors;
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    async function setUp() {
      setLoading(true);
      await keyPerformanceIndicatorStore.load();
      setLoading(false);
    }
    setUp();
  }, []);
  const year = company.yearForCreatingAnnualInitiatives;
  const setDefaultSelectionQuarter = week => {
    return week == 13 ? 1 : week == 26 ? 2 : week == 39 ? 3 : 4;
  };
  const largeNumToText = (n: number) => {
    if (n === Infinity) {
      return n;
    } else if (n >= 1000000000000) {
      return `${Math.round((n / 1000000000000 + Number.EPSILON) * 100) / 100}T`;
    } else if (n >= 1000000000) {
      return `${Math.round((n / 1000000000 + Number.EPSILON) * 100) / 100}B`;
    } else if (n >= 1000000) {
      return `${Math.round((n / 1000000 + Number.EPSILON) * 100) / 100}M`;
    } else if (n >= 1000) {
      return `${Math.round((n / 1000 + Number.EPSILON) * 100) / 100}K`;
    } else {
      return `${n}`;
    }
  };

  const quarter = setDefaultSelectionQuarter(company.currentFiscalWeek);
  const participants = new Set();
  if (!userStore.users.length || loading) {
    return <Loading />;
  }

  const formatKpiType = kpiType => titleCase(kpiType);

  const checkInArtifactLogs = insightsToShow
    .map(artifact => {
      if (artifact.checkInArtifactLogs[0]) {
        return {
          ...artifact.checkInArtifactLogs[0],
          ownedBy: artifact.ownedById,
          updatedAt: artifact.updatedAt,
        };
      }
    })
    .filter(Boolean);

  const findUser = owner_id => {
    return userStore.users.find(user => user.id == owner_id);
  };

  const getScorePercent = (value: number, target: number, greaterThan: boolean) =>
    greaterThan ? (value / target) * 100 : ((target + target - value) / target) * 100;

  const formatValue = (unitType: string, value: number) => {
    switch (unitType) {
      case "percentage":
        return `${Math.round(value * 1000) / 1000}%`;
      case "currency":
        return `$${value.toFixed(2)}`;
      default:
        return `${value}`;
    }
  };

  const keys = ["fiscalQuarter", "week", "fiscalYear", "userId", "keyPerformanceIndicatorId"];

  return (
    <Container>
      <HeaderContainer>
        <HeaderText>KPIs</HeaderText>
      </HeaderContainer>
      <KpisContainer>
        {checkInArtifactLogs.map(artifactLog => {
          const user = findUser(artifactLog.ownedBy);

          return (
            <>
              <KpiComponent>
                {artifactLog.scorecardLogsFull.length > 0 ? (
                  <AvatarContainer>
                    <Avatar
                      size={32}
                      marginLeft={"0px"}
                      marginTop={"0px"}
                      marginRight={"16px"}
                      firstName={user.firstName}
                      lastName={user.lastName}
                      defaultAvatarColor={user.defaultAvatarColor}
                      avatarUrl={user.avatarUrl}
                    />
                    <StyledText>{`${user.firstName} ${user.lastName}`}</StyledText>
                  </AvatarContainer>
                ) : (
                  <></>
                )}
                <Divider />

                <DataContainer>
                  <Table>
                    {artifactLog.scorecardLogsFull.length > 0 ? (
                      <TableHead>
                        <TableRow>
                          <TableHeadText pb="2em" left={true} scope="col">
                            KPIs
                          </TableHeadText>
                          <TableHeadText pb="2em" scope="col">
                            Status
                          </TableHeadText>
                          <TableHeadText pb="2em" scope="col">
                            Score
                          </TableHeadText>
                          <TableHeadText pb="2em" scope="col">
                            Week {artifactLog?.scorecardLogsFull[0]?.week}
                          </TableHeadText>
                        </TableRow>
                      </TableHead>
                    ) : (
                      <></>
                    )}
                    <TableBody>
                      {artifactLog.scorecardLogsFull
                        ?.sort(sortByDate)
                        .filter(
                          (s => o => (k => !s.has(k) && s.add(k))(keys.map(k => o[k]).join("|")))(
                            new Set(),
                          ),
                        )
                        .map(log => {
                          participants.add(log.ownedBy);
                          const kpi = log.keyPerformanceIndicator;
                          const getStatusValue = (percentScore, needsAttentionThreshold) => {
                            const percent = Math.round(percentScore);
                            if (percentScore === null) {
                              return {
                                color: greyActive,
                                background: backgroundGrey,
                                percent,
                                text: "No Update",
                              };
                            } else if (percentScore >= 100) {
                              return {
                                color: successGreen,
                                background: fadedGreen,
                                percent,
                                text: "On Track",
                              };
                            } else if (percentScore >= needsAttentionThreshold) {
                              return {
                                color: poppySunrise,
                                background: fadedYellow,
                                percent,
                                text: "Needs Attention",
                              };
                            } else {
                              return {
                                color: warningRed,
                                background: fadedRed,
                                percent,
                                text: "Behind",
                              };
                            }
                          };

                          const findKPI = kpi => {
                            return toJS(allKPIs).find(e => kpi.id == e.id);
                          };

                          const foundKpi = findKPI(kpi);
                          const weeks = Object.values(foundKpi?.period?.[year] || {});

                          const calcQuarterAverageScores = (
                            weeks: any,
                            target: number,
                            greaterThan: boolean,
                            parentType: string,
                          ) => {
                            const quarterScores = [
                              [null, 0],
                              [null, 0],
                              [null, 0],
                              [null, 0],
                            ];
                            weeks.forEach(({ week, score }) => {
                              const q = Math.floor((week - 1) / 13);
                              if (target == 0) {
                                quarterScores[q][0] -= score;
                                quarterScores[q][1]++;
                              } else if (quarterScores[q]) {
                                quarterScores[q][0] += score;
                                quarterScores[q][1]++;
                              }
                            });
                            return quarterScores.map(tuple =>
                              tuple[0] === null
                                ? null
                                : target == 0 && tuple[0] == 0
                                ? 100
                                : target == 0 && tuple[0] != 0
                                ? tuple[0]
                                : getScorePercent(tuple[0] / tuple[1], target, greaterThan),
                            );
                          };
                          const percentScores = calcQuarterAverageScores(
                            weeks,
                            kpi.targetValue,
                            kpi.greaterThan,
                            kpi.parentType,
                          ).map(score => getStatusValue(score, kpi.needsAttentionThreshold));

                          const quarterValue = percentScores[quarter - 1];

                          const currrentScore =
                            foundKpi?.scorecardLogs[foundKpi?.scorecardLogs.length - 1]?.score;

                          return (
                            <TableRow>
                              <TableData left>
                                <KpiNameContainer>
                                  <KpiName>
                                    {kpi.title}{" "}
                                    {kpi.parentType && `[${formatKpiType(kpi.parentType)}]`}
                                  </KpiName>
                                  <KpiDescription>
                                    {" "}
                                    {kpi.greaterThan
                                      ? `Greater than or equal
                                  to  ${formatValue(kpi.unitType, kpi.targetValue)}`
                                      : `Less than or equal to ${formatValue(
                                          kpi.unitType,
                                          kpi.targetValue,
                                        )}`}
                                  </KpiDescription>
                                </KpiNameContainer>
                              </TableData>
                              <TableData>
                                <StatusBadge
                                  background={quarterValue?.background}
                                  color={quarterValue?.color}
                                >
                                  {quarterValue?.text}
                                </StatusBadge>
                              </TableData>
                              <TableData>
                                <StatusBadge
                                  fontSize={"12px"}
                                  background={quarterValue?.background}
                                  color={quarterValue?.color}
                                >
                                  {/* {quarterValue?.percent} */}
                                  {kpi.parentKpi.length > foundKpi?.relatedParentKpis.length
                                    ? "—"
                                    : quarterValue?.percent
                                    ? `${largeNumToText(quarterValue?.percent)}%`
                                    : kpi.greaterThan
                                    ? "0%"
                                    : "—"}
                                </StatusBadge>
                              </TableData>
                              <TableData>
                                <WeekContainer>
                                  <WeekText color={quarterValue?.color}>
                                    {"" + currrentScore}
                                  </WeekText>
                                </WeekContainer>
                              </TableData>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </DataContainer>
              </KpiComponent>
            </>
          );
          // });
        })}
      </KpisContainer>
      <Divider />
      <InfoContainer>
        <InfoText>{participants?.size} total response(s)</InfoText>
      </InfoContainer>
    </Container>
  );
};

const Container = styled.div`
  box-shadow: 0px 3px 6px #00000029;
  background: ${props => props.theme.colors.white};
  border-radius: 8px;
  padding: 16px 0;
  margin-bottom: 16px;
  // height: 250px;
`;

const HeaderContainer = styled.div`
  padding: 0 1em;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HeaderText = styled.span`
  color: ${props => props.theme.colors.black};
  font-size: 20px;
  font-weight: bold;
  display: inline-block;
`;

const AvatarContainer = styled.div`
  padding: 0 1em;
  display: flex;
  align-items: center;
  margin-bottom: 1em;
`;

const KpisContainer = styled.div``;

const KpiComponent = styled.div``;

const Divider = styled.div`
  border-top: 1px solid ${props => props.theme.colors.grey40};
`;

const InfoContainer = styled.div`
  display: flex;
  padding: 0 1em;
  margin-top: 0.5em;
`;

const InfoText = styled.span`
  font-size: 12px;
  color: ${props => props.theme.colors.grey40};
  margin-left: auto;
`;

const StyledText = styled(Text)`
  font-weight: bold;
  font-size: 12px;
  margin: 0;
`;

const Table = styled.table`
  table-layout: fixed;
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  margin-bottom: 24px;
`;

const TableRow = styled.tr``;

const TableBody = styled.tbody``;

type TableHeadTextProps = {
  left?: boolean;
  pb?: string;
};

const TableHeadText = styled.th<TableHeadTextProps>`
  font-size: 16px;
  text-align: ${props => (props.left ? "left" : "center")};
  padding-bottom: ${props => (props.pb ? props.pb : "")};
`;

type TableDataProps = {
  left?: boolean;
};

const TableData = styled.td<TableDataProps>`
  text-align: ${props => (props.left ? "left" : "center")};
  padding-bottom: 1em;
`;

const DataContainer = styled.div`
  padding: 1em 2em;
`;

const KpiNameContainer = styled.div``;
const KpiName = styled(Text)`
  font-weight: bold;
  font-size: 14px;
  margin: 0;
`;

const KpiDescription = styled.span`
  font-size: 10px;
  color: ${props => props.theme.colors.grey100};
`;

const WeekContainer = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

type WeekTextProps = {
  color: string;
};

const WeekText = styled.p<WeekTextProps>`
  color: ${props => props.color};
  font-size: 14px;
`;

const RowContainer = styled.div`
  margin-bottom: 1em;
`;
