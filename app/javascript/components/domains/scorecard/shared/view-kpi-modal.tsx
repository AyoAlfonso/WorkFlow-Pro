import React, { useState, useEffect } from "react";
import * as R from "ramda";
import styled from "styled-components";
import moment from "moment"
import { observer } from "mobx-react"
import { useTranslation } from "react-i18next";
import Modal from "styled-react-modal"
import { useMst } from "~/setup/root"
import { StatusBadge } from "~/components/shared/status-badge"
import { Loading } from "~/components/shared/loading"
import { Avatar } from "~/components/shared/avatar"
import { Icon } from "~/components/shared/icon"
import { Line } from "react-chartjs-2"
import { baseTheme } from "~/themes/base"
import { getScorePercent } from "../scorecard-table-view"

interface ViewEditKPIModalProps {
  kpiId: number;
  setViewEditKPIModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  viewEditKPIModalOpen: boolean;
}

export const ViewEditKPIModal = observer(
  ({
    kpiId,
    setViewEditKPIModalOpen,
    viewEditKPIModalOpen,
  }: ViewEditKPIModalProps): JSX.Element => {
    const { companyStore: { company }, keyPerformanceIndicatorStore } = useMst();
    const [loading, setLoading] = useState(true);
    const [kpi, setKpi] = useState(null);
    const [header, setHeader] = useState("");
    const [value, setValue] = useState<number>(undefined)
    const [logic, setLogic] = useState("");
    const [viewers, setViewers] = useState("");
    const [data, setData] = useState(null);

    const {
      backgroundGrey,
      fadedRed,
      fadedYellow,
      fadedGreen,
      greyInactive,
      greyActive,
      warningRed,
      poppySunrise,
      successGreen,
      primary100,
      white,
    } = baseTheme.colors

    const formatValue = (value: number, unitType: string) => {
      if(value === undefined) {
        return "...";
      }
      switch (unitType) {
        case "percentage":
          return `${Math.round(value * 1000) / 1000}%`;
        case "currency":
          return `$${value.toFixed(2)}`;
        default:
          return `${value}`;
      }
    }

    const renderStatus = () => {
      if(!kpi) {
        return
      }
      if(value === undefined) {
        return (
          <StatusBadgeContainer>
            <StatusBadge color={greyActive} background={backgroundGrey}>No Update</StatusBadge>
          </StatusBadgeContainer>
        )
      }
      const scorePercent = getScorePercent(value, kpi.targetValue, kpi.greaterThan)
      if(scorePercent >= 100) {
        return (
          <StatusBadgeContainer>
            <StatusBadge color={successGreen} background={fadedGreen}>On Track</StatusBadge>
          </StatusBadgeContainer>
        )
      }
      else if(scorePercent >= 90) {
        return (
          <StatusBadgeContainer>
            <StatusBadge color={poppySunrise} background={fadedYellow}>Needs Attention</StatusBadge>
          </StatusBadgeContainer>
        )
      }
      else {
        return (
          <StatusBadgeContainer>
            <StatusBadge color={warningRed} background={fadedRed}>Behind</StatusBadge>
          </StatusBadgeContainer>
        )
      }
    }

    const chartOptions = {
      legend: {
        display: false,
      },
      scales: {
        x: {
          autoSkip: false,
        },
      },
      responsive: true,
      maintainAspectRatio: false,
    }

    const weekToDate = (week: number): string =>
      moment(company.fiscalYearStart)
        .add(week, "w")
        .startOf("week" as moment.unitOfTime.StartOf)
        .format("MMM D");

    useEffect(() => {
      if (kpiId !== null) {
        keyPerformanceIndicatorStore.getKPI(kpiId).then((value) => {
          setLoading(false)
          setKpi(keyPerformanceIndicatorStore.kpi)
        })
      }
    }, [kpiId])

    useEffect(() => {
      if (!kpi) {
        return
      }
      const startWeek = (company.currentFiscalQuarter - 1) * 13 + 1;
      const weekNumbers = R.range(startWeek, company.currentFiscalWeek)
      const weeks = kpi.period.get(company.currentFiscalYear).toJSON()
      const currentQuarterData = weekNumbers.map(week => weeks?.[week] ? weeks[week].score : 0)

      setData({
        labels: R.range(startWeek, startWeek + 13).map(weekToDate),
        datasets: [{
          label: "Current Quarter",
          data: currentQuarterData,
          fill: false,
          backgroundColor: white,
          borderColor: primary100,
          borderWidth: 1.5,
          tension: 0,
        }],
      })
      const targetText = formatValue(kpi.targetValue, kpi.unitType)
      setLogic(kpi.greaterThan ? `Greater than or equal to ${targetText}` : `Less than or equal to ${targetText}`)
      setHeader(`${kpi.description} ${kpi.greaterThan ? "≥" : "≤"} ${targetText}`)
      const currentWeek = weeks?.[company.currentFiscalWeek]
      setValue(currentWeek ? currentWeek.score : undefined)
    }, [kpi])

    return (
      <StyledModal
        isOpen={viewEditKPIModalOpen}
        style={{ width: "60rem", maxHeight: "90%", overflow: "auto" }}
        onBackgroundClick={e => {
          setViewEditKPIModalOpen(false)
        }}
      >
        <Container>
          {loading ? (
            <Loading />
          ) : (kpi && (<>
            <Header>{header}</Header>
            <OwnerAndLogicContainer>
              <Icon icon={"Stats"} iconColor={greyInactive} size={16} />
              <OwnerAndLogicText style={{ textTransform: "capitalize" }}>
                {R.uniq(kpi.viewers.map(viewer => viewer.type)).join(", ")} KPI
              </OwnerAndLogicText>
              <Avatar
                firstName={kpi.ownedBy.firstName}
                lastName={kpi.ownedBy.lastName}
                avatarUrl={kpi.ownedBy.avatarUrl}
                size={16}
                marginLeft={"0px"}
                defaultAvatarColor={kpi.ownedBy.defaultAvatarColor}
              />
              <OwnerAndLogicText>
                {kpi.ownedBy.firstName} {kpi.ownedBy.lastName}
              </OwnerAndLogicText>
              <Icon icon={"Initiative"} iconColor={greyInactive} size={16} />
              <OwnerAndLogicText>
                {logic}
              </OwnerAndLogicText>
            </OwnerAndLogicContainer>
            <ValueAndUpdateContainer>
              <ValueText>{formatValue(value, kpi.unitType)}</ValueText>
              {renderStatus()}
              <UpdateProgressButton>
                <Icon icon={"Edit"} iconColor={white} size={16} style={{ marginRight: 16 }} />
                <div>
                  Update Progress
                </div>
              </UpdateProgressButton>
            </ValueAndUpdateContainer>
            <ChartContainer>
              {data && (
                <Line data={data} options={chartOptions} />
              )}
            </ChartContainer>
            <SubHeader>Description</SubHeader>
            <SubHeader>Activity</SubHeader>
            <ActivityLogsContainer>
              {kpi.scorecardLogs.map(log => {
                return (
                  <ActivityLogContainer key={log.id}>
                    <Avatar
                      size={32}
                      marginLeft={"0px"}
                      marginTop={"0px"}
                      marginRight={"16px"}
                      firstName={log.user.firstName}
                      lastName={log.user.lastName}
                      defaultAvatarColor={log.user.defaultAvatarColor}
                      avatarUrl={log.user.avatarUrl}
                    />
                    <ActivityLogTextContainer>
                      <ActivityLogText mb={kpi.description ? 8 : 0}>
                        <b>{log.user.firstName} {log.user.lastName}</b> added an update of <b><u>{formatValue(log.score, kpi.unitType)}</u></b> for week <b>{log.week}</b>
                      </ActivityLogText>
                      <ActivityLogText mb={4}>
                        <i>{log.description}</i>
                      </ActivityLogText>
                      <ActivityLogText>
                        <ActivityLogDate>{moment(log.createdAt).format("MMM D, YYYY")}</ActivityLogDate>
                        <ActivityLogDelete> Delete</ActivityLogDelete>
                      </ActivityLogText>
                    </ActivityLogTextContainer>
                  </ActivityLogContainer>
                )
              }
              )}
            </ActivityLogsContainer>
          </>))}
        </Container>
      </StyledModal>
    )
  }
)

const Container = styled.div`
  width: 100%;
`

const StyledModal = Modal.styled`
  width: 30rem;
  min-height: 100px;
  border-radius: 8px;
  padding: 32px;
  background-color: ${props => props.theme.colors.white};
`;

const ChartContainer = styled.div`
  width: 100%;
  height: 240px;
`

const Header = styled.p`
  margin: 0px;
  margin-bottom: 16px;
  font-family: Exo, Lato, sans-serif;
  font-size: 20px;
  font-weight: bold;
`

const OwnerAndLogicContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  margin-bottom: 32px;
`

const OwnerAndLogicText = styled.div`
  font-size: 9px;
  color: ${props => props.theme.colors.grey100};
  margin-left: 8px;
  margin-right: 16px;
`

const ValueAndUpdateContainer = styled.div`
  width: 100%;
  display: flex;
  margin-bottom: 22px;
`

const ValueText = styled.p`
  margin: 0px;
  margin-right: 16px;
  font-size: 32px;
  font-weight: bold;
`

const StatusBadgeContainer = styled.div`
  margin-top: auto;
  margin-bottom: auto;
  margin-right: 16px;
  ${StatusBadge} {
    font-size: 16px;
  }
`

const UpdateProgressButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  color: ${props => props.theme.colors.white};
  border-radius: 4px;
  background: ${props => props.theme.colors.primary100};
  margin-top: auto;
  margin-bottom: auto;
  padding: 8px;

  &:hover {
    cursor: pointer;
    background: ${props => props.theme.colors.primary80};
  }
`

const SubHeader = styled.p`
  margin-top: 32px;
  margin-bottom: 16px;
  font-size: 12px;
  font-weight: bold;
`

const ActivityLogsContainer = styled.div`
  width: 100%;
  margin-top: 24px;
`

const ActivityLogContainer = styled.div`
  display: flex;
  margin-bottom: 16px;
`

const ActivityLogTextContainer = styled.div`

`

const ActivityLogDate = styled.span`
  font-size: 9px;
  color: ${props => props.theme.colors.grey100};
`

const ActivityLogDelete = styled.span`
  font-size: 9px;
  color: ${props => props.theme.colors.grey100};
  margin-left: 8px;
  &:hover {
    color: ${props => props.theme.colors.warningRed};
    cursor: pointer;
  }
`

type ActivityLogTextProps = {
  mb: number,
}

const ActivityLogText = styled.p<ActivityLogTextProps>`
  font-size: 12px;
  margin-top: 0px;
  margin-bottom: ${props => props.mb}px;
`
