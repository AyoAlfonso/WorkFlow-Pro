import React, { useState, useEffect, useMemo } from "react";
import * as R from "ramda";
import { observer } from "mobx-react";
import styled from "styled-components";
import { useMst } from "../../../setup/root";
import { useTranslation } from "react-i18next";
import { useTable } from "react-table";
import Select from "./scorecard-select";
import { RawIcon } from "~/components/shared/icon";
import { baseTheme } from "~/themes/base";
import { OwnedBy } from "./shared/scorecard-owned-by";
import { Loading } from "../../shared/loading";
import { StatusBadge } from "~/components/shared/status-badge";
import { AddKPIDropdown } from "./shared/add-kpi-dropdown";
import { ViewEditKPIModal } from "./shared/view-kpi-modal";
import { MiniUpdateKPIModal } from "./shared/update-kpi-modal";
import { AddExistingManualKPIModal } from "./shared/edit-existing-manual-kpi-modal";
import { titleCase } from "~/utils/camelize";
import { sortByDateReverse } from "~/utils/sorting";

import { toJS } from "mobx";
// TODO: figure out better function for percent scores.
export const getScorePercent = (value: number, target: number, greaterThan: boolean) =>
  greaterThan ? (value / target) * 100 : ((target + target - value) / target) * 100;

type ScorecardTableViewProps = {
  tableKPIs: any;
  allKPIs: any[];
  setKpis: any;
  setViewEditKPIModalOpen: any;
  viewEditKPIModalOpen: any;
  isMiniEmbed?: boolean;
};

export const ScorecardTableView = observer(
  ({
    tableKPIs,
    allKPIs,
    setKpis,
    viewEditKPIModalOpen,
    setViewEditKPIModalOpen,
    isMiniEmbed,
  }: ScorecardTableViewProps): JSX.Element => {
    const { t } = useTranslation();
    const {
      companyStore: { company },
    } = useMst();
    const KPIs = toJS(tableKPIs);

    //Turn this into a shared function
    const createGoalYearString =
      company.currentFiscalYear == company.yearForCreatingAnnualInitiatives
        ? `FY${company.yearForCreatingAnnualInitiatives.toString().slice(-2)}`
        : `FY${(company.currentFiscalYear - 1)
            .toString()
            .slice(-2)}/${company.currentFiscalYear.toString().slice(-2)}`;

    const createPreviousGoalYearString =
      //the step pattern makes sense define variables at top of func also
      company.currentFiscalYear == company.yearForCreatingAnnualInitiatives
        ? `FY${(company.yearForCreatingAnnualInitiatives - 1).toString().slice(-2)}`
        : `FY${(company.currentFiscalYear - 2).toString().slice(-2)}/${(
            company.currentFiscalYear - 1
          )
            .toString()
            .slice(-2)}`;
    const setDefaultSelectionQuarter = (week, q) => {
      return week == 13 ? 1 : week == 26 ? 2 : week == 39 ? 3 : q;
    };
    const [year, setYear] = useState<number>(company.yearForCreatingAnnualInitiatives);
    const [quarter, setQuarter] = useState<number>(
      setDefaultSelectionQuarter(company.currentFiscalWeek, company.currentFiscalQuarter),
    );
    const [fiscalYearStart, setFiscalYearStart] = useState<string>(company.fiscalYearStart);
    const [dropdownQuarter, setDropdownQuarter] = useState(
      company.currentFiscalQuarter + "_" + createGoalYearString,
    );
    const [targetWeek, setTargetWeek] = useState<number>(undefined);
    const [targetValue, setTargetValue] = useState<number>(undefined);
    const [tab, setTab] = useState<string>("KPIs");
    const [currentSelectedKpi, setCurrentSelectedKpi] = useState(undefined);
    const [updateKPI, setUpdateKPI] = useState(undefined);
    const [selectedKPIIcon, setSelectedKPIIcon] = useState(undefined);
    const [selectedKPIWeek, setSelectedKPIWeek] = useState(undefined);
    const [updateKPIModalOpen, setUpdateKPIModalOpen] = useState(false);
    const [showEditExistingKPIContainer, setShowEditExistingKPIContainer] = useState<boolean>(
      false,
    );
    const tabs = [t("scorecards.tabs.kpis"), t("scorecards.tabs.people")];
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
    const formatKpiType = kpiType => titleCase(kpiType);
    const averageScorePercent = (scores: [number], target: number, greaterThan: boolean) => {
      return Math.min(
        Math.floor(
          getScorePercent(
            scores.reduce((acc, score) => acc + score, 0) / scores.length,
            target,
            greaterThan,
          ),
        ),
        100,
      );
    };

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
        if (quarterScores[q]) {
          quarterScores[q][0] += score;
          quarterScores[q][1]++;
        }
      });
      return quarterScores.map(tuple =>
        tuple[0] === null ? null : getScorePercent(tuple[0] / tuple[1], target, greaterThan),
      );
    };

    const getScoreValueColor = (percentScore: number) => {
      if (percentScore >= 100) {
        return successGreen;
      } else {
        return warningRed;
      }
    };

    const data = useMemo(
      () =>
        KPIs?.sort(sortByDateReverse).map((kpi: any) => {
          const targetText = formatValue(kpi.unitType, kpi.targetValue);
          const title = `${kpi.title}`;
          const logic = kpi.greaterThan
            ? `Greater than or equal to ${targetText}`
            : `Less than or equal to ${targetText}`;

          const row: any = {
            updateKPI: {
              id: kpi.id,
              ownedById: kpi.ownedById,
              unitType: kpi.unitType,
              parentType: kpi.parentType,
              relatedParentKpis: kpi.relatedParentKpis,
              parentKpi: kpi.parentKpi,
            },
            title: {
              title,
              logic,
              parentType: kpi.parentType,
              id: kpi.id,
            },
            owner: kpi.ownedBy,
            greaterThan: kpi.greaterThan,
          };
          const weeks = Object.values(kpi?.period?.[year] || {});
          weeks.forEach((week: any) => {
            const percentScore = getScorePercent(week?.score, kpi.targetValue, kpi.greaterThan);
            row[`wk_${week.week}`] = {
              score: formatValue(kpi.unitType, week?.score),
              color: getScoreValueColor(percentScore),
              id: kpi.id,
            };
          });
          const percentScores = calcQuarterAverageScores(
            weeks,
            kpi.targetValue,
            kpi.greaterThan,
            kpi.parentType,
          ).map(score => getStatusValue(score, kpi.needsAttentionThreshold));

          row.score = percentScores;
          row.status = percentScores;
          row.updateKPI.currentValue = weeks[weeks.length - 1]
            ? weeks[weeks.length - 1]["score"]
            : 0;
          row.updateKPI.currentWeek = weeks[weeks.length - 1] || 0;
          row.updateKPI.weeks = weeks;
          return row;
        }),
      [KPIs],
    );

    const columns = useMemo(
      () => [
        {
          Header: "",
          accessor: "updateKPI",
          width: "31px",
          minWidth: "31px",
          Cell: ({ value }) => {
            return (
              <UpdateKPIWrapper
                onMouseEnter={() => {
                  setSelectedKPIIcon(value.id);
                }}
                onMouseLeave={() => {
                  setSelectedKPIIcon(null);
                }}
              >
                <UpdateKPIContainer
                  disabled={value.parentType}
                  onClick={() => {
                    if (value.parentType) return;
                    if (!isMiniEmbed) {
                      setUpdateKPI(value);
                      setUpdateKPIModalOpen(true);
                    }
                  }}
                >
                  {selectedKPIIcon == value.id ? (
                    <WhiteUpdateKpiIcon icon={"Update_KPI_New"} size={16} />
                  ) : (
                    <> </>
                  )}
                  {selectedKPIIcon !== value.id ? (
                    <BlueUpdateKpiIcon
                      icon={"Update_KPI_New"}
                      size={16}
                      hover={selectedKPIIcon == value.id}
                    />
                  ) : (
                    <> </>
                  )}
                </UpdateKPIContainer>
              </UpdateKPIWrapper>
            );
          },
        },
        {
          Header: () => (
            <div
              style={{
                textAlign: "left",
                fontSize: "14px",
              }}
            >
              KPIs
            </div>
          ),
          accessor: "title",
          Cell: ({ value }) => {
            return (
              <KPITitleContainer
                onClick={() => {
                  setCurrentSelectedKpi(value.id);
                  setViewEditKPIModalOpen(true);
                }}
              >
                <KPITextContainer>
                  <KPITitle>
                    {value.title} {value.parentType && `[${formatKpiType(value.parentType)}]`}
                  </KPITitle>
                  <KPILogic>{value.logic}</KPILogic>
                </KPITextContainer>
              </KPITitleContainer>
            );
          },
          width: "21%",
          minWidth: "216px",
        },
        {
          Header: () => <div style={{ fontSize: "14px" }}>Score</div>,
          accessor: "score",
          width: "8%",
          minWidth: "86px",
          Cell: ({ value, row }) => {
            const quarterValue = value[quarter - 1];

            const { relatedParentKpis, parentKpi } = row.original.updateKPI;
            const { greaterThan } = row.original;

            if (parentKpi.length > relatedParentKpis.length) {
              quarterValue.color = tango;
              quarterValue.background = dairyCream;
            }
            return (
              <ScoreContainer background={quarterValue.background}>
                <Score color={quarterValue.color}>
                  {parentKpi.length > relatedParentKpis.length
                    ? "—"
                    : quarterValue.percent
                    ? `${quarterValue.percent}%`
                    : greaterThan
                    ? "0%"
                    : "—"}
                </Score>
              </ScoreContainer>
            );
          },
        },
        {
          Header: () => <div style={{ fontSize: "14px" }}>Status</div>,
          accessor: "status",
          Cell: ({ value, row }) => {
            const quarterValue = value[quarter - 1];
            const { relatedParentKpis, parentKpi } = row.original.updateKPI;

            if (parentKpi.length > relatedParentKpis.length) {
              return (
                <StatusContainer>
                  <StatusBadge fontSize={"12px"} background={dairyCream} color={tango}>
                    Broken
                  </StatusBadge>
                </StatusContainer>
              );
            }
            return (
              <StatusContainer>
                <StatusBadge
                  fontSize={"12px"}
                  color={quarterValue.color}
                  background={quarterValue.background}
                >
                  {quarterValue.text}
                </StatusBadge>
              </StatusContainer>
            );
          },
          width: "8%",
          minWidth: "86px",
        },
        {
          Header: () => <div style={{ fontSize: "14px" }}>Owner</div>,
          accessor: "owner",
          Cell: ({ value }) => {
            return (
              <OwnerContainer>
                <OwnedBy ownedBy={value} marginLeft={"0px"} disabled />
              </OwnerContainer>
            );
          },
          width: "17%",
          minWidth: "160px",
        },
        ...R.range(1, 53).map((n, i) => ({
          Header: () => <div style={{ fontSize: "14px" }}> {`WK ${n}`} </div>,
          accessor: `wk_${n}`,
          Cell: ({ value, row }) => {
            const i = row.id;
            const { parentType } = row.original.updateKPI;

            if (parentType) {
              return (
                <EmptyWeekContainer>
                  {value === undefined ? (
                    <EmptyWeekContainer>
                      <EmptyWeek />
                    </EmptyWeekContainer>
                  ) : (
                    <WeekContainer>
                      <WeekText color={value.color}>{value.score}</WeekText>
                    </WeekContainer>
                  )}
                </EmptyWeekContainer>
              );
            }
            if (value === undefined) {
              if (company.currentFiscalWeek < n) {
                return (
                  <EmptyWeekContainer>
                    <EmptyWeek />
                  </EmptyWeekContainer>
                );
              }
              return (
                // TODO: REPETITION TURN INTO A PARENT COMPONENT AND PASS THE CHILDREN
                <EmptyWeekContainer
                  onMouseEnter={() => {
                    setSelectedKPIWeek(`wk_${n}_${i}`);
                  }}
                  onMouseLeave={() => {
                    setSelectedKPIWeek(null);
                  }}
                >
                  <UpdateKPICellContainer
                    disabled={parentType || false}
                    onClick={() => {
                      if (parentType) return;
                      if (!isMiniEmbed) {
                        setTargetWeek(n);
                        setTargetValue(0);
                        setUpdateKPI(row.original.updateKPI);
                        setUpdateKPIModalOpen(true);
                      }
                    }}
                    hover={selectedKPIWeek == `wk_${n}_${i}` ? true : false}
                  >
                    {selectedKPIWeek == `wk_${n}_${i}` ? (
                      <WhiteUpdateKpiIcon icon={"Update_KPI_New"} size={16} />
                    ) : (
                      <> </>
                    )}
                  </UpdateKPICellContainer>
                  {selectedKPIWeek !== `wk_${n}_${i}` ? <EmptyWeek /> : <> </>}
                </EmptyWeekContainer>
              );
            }
            return (
              <EmptyWeekContainer
                onMouseEnter={() => {
                  setSelectedKPIWeek(`wk_${n}_${i}`);
                }}
                onMouseLeave={() => {
                  setSelectedKPIWeek(null);
                }}
              >
                <UpdateKPICellContainer
                  disabled={parentType || false}
                  onClick={() => {
                    if (parentType) return;
                    if (!isMiniEmbed) {
                      setTargetWeek(n);
                      setTargetValue(value.score);
                      setUpdateKPI(row.original.updateKPI);
                      setUpdateKPIModalOpen(true);
                    }
                  }}
                  hover={selectedKPIWeek == `wk_${n}_${i}` || value}
                >
                  {selectedKPIWeek == `wk_${n}_${i}` ? (
                    <WhiteUpdateKpiIcon icon={"Update_KPI_New"} size={16} />
                  ) : (
                    <WeekContainer>
                      <WeekText color={value.color}>{value.score}</WeekText>
                    </WeekContainer>
                  )}
                </UpdateKPICellContainer>
              </EmptyWeekContainer>
            );
          },
          width: "1fr",
          minWidth: "64px",
        })),
      ],
      [quarter, year, selectedKPIIcon, selectedKPIWeek],
    );

    const getHiddenWeeks = (q: number) =>
      R.range(1, 53)
        .filter(n => Math.floor((n - 1) / 13) != q - 1)
        .map(n => `wk_${n}`);

    const initialState = {
      hiddenColumns: getHiddenWeeks(quarter),
    };

    const tableInstance = useTable({
      columns,
      data,
      initialState,
    });

    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      rows,
      prepareRow,
      setHiddenColumns,
    } = tableInstance;

    const handleQuarterSelect = dq => {
      const [q, y] = dq.split("_");
      setYear(y);
      setQuarter(q);
      setDropdownQuarter(dq);
      setHiddenColumns(getHiddenWeeks(q));
    };

    //Turn this into a shared function
    const createGoalYearString =
      company.currentFiscalYear == company.yearForCreatingAnnualInitiatives
        ? `FY${company.yearForCreatingAnnualInitiatives.toString().slice(-2)}`
        : `FY${(company.currentFiscalYear - 1)
            .toString()
            .slice(-2)}/${company.currentFiscalYear.toString().slice(-2)}`;

    return (
      <>
        <Container>
          <TopRow>
            <TabContainer>
              {tabs.map(elem => (
                <Tab key={elem} active={tab === elem} onClick={() => setTab(elem)}>
                  {elem}
                </Tab>
              ))}
            </TabContainer>
            <Select
              selection={dropdownQuarter}
              setSelection={handleQuarterSelect}
              id={"scorecard-quarter-selection"}
            >
              {R.range(1, 5).map((n: number) => (
                <option
                  key={
                    n +
                    "_" +
                    createPreviousGoalYearString +
                    "_" +
                    (company.yearForCreatingAnnualInitiatives - 1).toString()
                  }
                  value={
                    n +
                    "_" +
                    createPreviousGoalYearString +
                    "_" +
                    (company.yearForCreatingAnnualInitiatives - 1).toString()
                  }
                >
                  Q{n} {createPreviousGoalYearString}
                </option>
              ))}
              {R.range(1, 5).map((n: number) => (
                <option
                  key={
                    n +
                    "_" +
                    createGoalYearString +
                    "_" +
                    company.yearForCreatingAnnualInitiatives.toString()
                  }
                  value={
                    n +
                    "_" +
                    createGoalYearString +
                    "_" +
                    company.yearForCreatingAnnualInitiatives.toString()
                  }
                >
                  Q{n} {createGoalYearString}
                </option>
              ))}
              {/* {R.range(5, 9).map((n: number, index) => (
                <option key={n} value={n}>
                  Q{index+1} {company.currentFiscalYear}
                </option>
              ))} */}
            </Select>
          </TopRow>
          {tab == "KPIs" && (
            <TableContainer>
              <Table {...getTableProps()}>
                <TableHead>
                  {headerGroups.map(headerGroup => (
                    <TableRow {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map(column => (
                        <TableHeader
                          {...column.getHeaderProps({
                            style: {
                              width: column.width,
                              minWidth: column.minWidth,
                            },
                          })}
                        >
                          {column.render("Header")}
                        </TableHeader>
                      ))}
                    </TableRow>
                  ))}
                </TableHead>
                <TableBody {...getTableBodyProps()}>
                  {rows.map(row => {
                    prepareRow(row);
                    return (
                      <TableRow hover={true} {...row.getRowProps()}>
                        {row.cells.map(cell => {
                          return (
                            <td {...cell.getCellProps()}>
                              {cell.render("Cell", cell.getCellProps())}
                            </td>
                          );
                        })}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              {!isMiniEmbed && <AddKPIDropdown dropdownDirectionUp={true} kpis={allKPIs} />}
            </TableContainer>
          )}
        </Container>
        {currentSelectedKpi && (
          <ViewEditKPIModal
            kpiId={currentSelectedKpi}
            viewEditKPIModalOpen={viewEditKPIModalOpen}
            setKpis={setKpis}
            setViewEditKPIModalOpen={setViewEditKPIModalOpen}
            setShowEditExistingKPIContainer={setShowEditExistingKPIContainer}
          />
        )}

        {showEditExistingKPIContainer && (
          <AddExistingManualKPIModal
            kpiId={currentSelectedKpi}
            showAddManualKPIModal={showEditExistingKPIContainer}
            setShowAddManualKPIModal={setShowEditExistingKPIContainer}
            headerText={"Edit KPI"}
            kpis={allKPIs}
          />
        )}

        {updateKPI && (
          <MiniUpdateKPIModal
            kpiId={updateKPI.id}
            ownedById={updateKPI.ownedById}
            unitType={updateKPI.unitType}
            year={year || company.yearForCreatingAnnualInitiatives}
            quarter={quarter}
            week={targetWeek || company.currentFiscalWeek}
            currentValue={targetValue || updateKPI.currentValue}
            headerText={targetWeek ? `Update Week ${targetWeek}` : " Update Current Week "}
            updateKPIModalOpen={updateKPIModalOpen}
            setUpdateKPIModalOpen={setUpdateKPIModalOpen}
            setKpis={setKpis}
            updateKPI={updateKPI}
            // setUpdateKPI={setUpdateKPI}
            setTargetWeek={setTargetWeek}
            setTargetValue={setTargetValue}
            fiscalYearStart={fiscalYearStart}
            currentFiscalQuarter={quarter}
          />
        )}
      </>
    );
  },
);

const Container = styled.div`
  width: 100%;
  font-family: Lato;
`;

const TableContainer = styled.div`
  width: 100%;
  font-family: Lato;
`;

const TopRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const TabContainer = styled.div`
  display: flex;
  visibility: hidden;
`;

type TabProps = {
  active: boolean;
};

const Tab = styled.button<TabProps>`
  font-size: 16px;
  font-weight: bold;
  background-color: ${props => props.theme.colors.white};
  padding: 4px 16px;
  cursor: pointer;
  color: ${props => props.theme.colors.black};
  border: 0;
  outline: 0;
  opacity: 0.5;
  ${props =>
    props.active &&
    `border-bottom: 2px solid ${props.theme.colors.primary80};
		opacity: 1;`}
`;

const Table = styled.table`
  border-collapse: collapse;
  display: -webkit-box;
  padding-bottom: 16px;
  font-size: 12px;
  overflow-x: auto;
  width: 100%;
`;

const TableHead = styled.thead`
  width: 100%;
`;

const TableBody = styled.tbody`
  width: 100%;
`;

const TableHeader = styled.th`
  border: 1px solid ${props => props.theme.colors.borderGrey};
  padding: 16px 8px;
`;

const KPITitle = styled.div`
  display: block;
  font-size: 14px;
  margin-bottom: 4px;
  font-weight: 600;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

type TableRowProps = {
  hover?: boolean;
};

const TableRow = styled.tr<TableRowProps>`
  width: 100%;
  height: 48px;
  ${props =>
    props.hover &&
    `&:hover {
		background: ${props.theme.colors.backgroundBlue};
		${KPITitle} {
			font-weight: 800;
			text-decoration: underline;
		}
	}`}
`;

type UpdateKpiIconProps = {
  hover?: boolean;
};
const UpdateKpiIcon = styled(RawIcon)<UpdateKpiIconProps>`
   color:  ${props => (props.hover ? props.theme.colors.white : props.theme.colors.primary100)}; 
   &:hover {
    cursor: pointer;
    fill:  ${props =>
      props.hover ? props.theme.colors.white : props.theme.colors.primary100} !important;
`;

const BlueUpdateKpiIcon = styled(RawIcon)<UpdateKpiIconProps>`
   color:  ${props => props.theme.colors.primary100}; 
   display: ${props => (props.hover ? "inline-block" : "none")};
   transition: "all 0.4s ease-in";
   &:hover {
    cursor: pointer;
    fill:  ${props => props.theme.colors.primary100} !important;
`;

const WhiteUpdateKpiIcon = styled(RawIcon)<UpdateKpiIconProps>`
   color:  ${props => props.theme.colors.white}; 
   display: ${props => (props.hover ? "inline-block" : "none")};
   transition: "all 0.4s ease-in";
   &:hover {
    cursor: pointer;
    fill:  ${props => props.theme.colors.white} !important;
`;

type UpdateKPIContainerProps = {
  disabled?: boolean;
  hover?: boolean;
};

const UpdateKPIWrapper = styled.div``;
const UpdateKPIContainer = styled.div<UpdateKPIContainerProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 48px;
  height: 48px;
  opacity: ${props => (props.disabled ? "0.5" : "1.0")};
  pointer-events: ${props => (props.disabled ? "none" : "all")};
  &:hover {
    cursor: ${props => (props.disabled ? "none" : "pointer")};
    filter: brightness(1);
    background-color: ${props => props.theme.colors.primary100};
  }
`;

const UpdateKPICellContainer = styled(UpdateKPIContainer)`
  display: ${props => (props.hover ? "flex" : "none")};
  height: 34px;
  border-radius: 4px;
`;

const KPITitleContainer = styled.div`
  display: flex;
  min-width: 216px;
  overflow: hidden;
  justify-content: space-between;
  padding: 4px 8px;
  &:hover {
    cursor: pointer;
  }
`;

const KPITextContainer = styled.div``;

const KPILogic = styled.div`
  display: block;
  font-size: 12px;
  color: ${props => props.theme.colors.greyActive};
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

type ScoreContainerProps = {
  background: string;
};

const ScoreContainer = styled.div<ScoreContainerProps>`
  display: flex;
  width: auto;
  height: 32px;
  background: ${props => props.background};
  justify-content: center;
  align-items: center;
  margin: auto;
  border-radius: 4px;
`;

type ScoreProps = {
  color: string;
};

const Score = styled.p<ScoreProps>`
  color: ${props => props.color};
  font-size: 12px;
  font-weight: bold;
`;

const OwnerContainer = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const StatusContainer = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const WeekContainer = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const EmptyWeekContainer = styled.div`
  padding: 8px 16px;
`;

const EmptyWeek = styled.div`
  background: ${props => props.theme.colors.backgroundGrey};
  height: 16px;
  width: 100%;
  border-radius: 4px;
`;

type WeekTextProps = {
  color: string;
};

const WeekText = styled.p<WeekTextProps>`
  color: ${props => props.color};
  font-size: 14px;
`;
