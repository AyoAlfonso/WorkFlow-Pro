import React, { useState, useEffect } from "react";
import * as R from "ramda";
import styled from "styled-components";
import moment from "moment";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { useRef } from "react";
import ContentEditable from "react-contenteditable";
import Modal from "styled-react-modal";
import { useMst } from "~/setup/root";
import { StatusBadge } from "~/components/shared/status-badge";
import { Loading } from "~/components/shared/loading";
import { Avatar } from "~/components/shared/avatar";
import { Icon } from "~/components/shared/icon";
import { Line } from "react-chartjs-2";
import { baseTheme } from "~/themes/base";
import { getScorePercent } from "../scorecard-table-view";
import { UpdateKPIModal } from "./update-kpi-modal";
import { TrixEditor } from "react-trix";
import { OwnedBySection } from "~/components/domains/goals/shared/owned-by-section";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import { toJS } from "mobx";
import { titleCase } from "~/utils/camelize";
import { ScorecardKPIDropdownOptions } from "./scorecard-dropdown-options";
interface ViewEditKPIModalProps {
  kpiId: number;
  setViewEditKPIModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  viewEditKPIModalOpen: boolean;
  setKpis: any;
}

export const ViewEditKPIModal = observer(
  ({
    kpiId,
    setViewEditKPIModalOpen,
    viewEditKPIModalOpen,
    setKpis,
  }: ViewEditKPIModalProps): JSX.Element => {
    const {
      companyStore: { company },
      keyPerformanceIndicatorStore,
      scorecardStore,
      descriptionTemplateStore: { descriptionTemplates },
    } = useMst();

    const [kpi, setKpi] = useState(null);
    const descriptionTemplatesFormatted = toJS(descriptionTemplates);
    const [loading, setLoading] = useState(true);

    const [header, setHeader] = useState("");
    const [value, setValue] = useState<number>(undefined);
    const [logic, setLogic] = useState("");
    const [updateKPIModalOpen, setUpdateKPIModalOpen] = useState(false);
    const [data, setData] = useState(null);
    const [description, setDescription] = useState<string>("");
    const [showDropdownOptionsContainer, setShowDropdownOptionsContainer] = useState<boolean>(
      false,
    );

    const headerRef = useRef(null);

    if (R.isNil(keyPerformanceIndicatorStore)) {
      return <></>;
    }

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
      grey100,
    } = baseTheme.colors;

    const formatValue = (value: number, unitType: string) => {
      if (value === undefined) {
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
    };

    const formatKpiType = kpiType => titleCase(kpiType);

    const renderStatus = () => {
      if (!kpi) {
        return;
      }
      if (value === undefined) {
        return (
          <StatusBadgeContainer>
            <StatusBadge color={greyActive} background={backgroundGrey}>
              No Update
            </StatusBadge>
          </StatusBadgeContainer>
        );
      }
      const scorePercent = getScorePercent(value, kpi.targetValue, kpi.greaterThan);
      if (scorePercent >= 100) {
        return (
          <StatusBadgeContainer>
            <StatusBadge color={successGreen} background={fadedGreen}>
              On Track
            </StatusBadge>
          </StatusBadgeContainer>
        );
      } else if (scorePercent >= 90) {
        return (
          <StatusBadgeContainer>
            <StatusBadge color={poppySunrise} background={fadedYellow}>
              Needs Attention
            </StatusBadge>
          </StatusBadgeContainer>
        );
      } else {
        return (
          <StatusBadgeContainer>
            <StatusBadge color={warningRed} background={fadedRed}>
              Behind
            </StatusBadge>
          </StatusBadgeContainer>
        );
      }
    };
    const renderNewValue = value => {
      setValue(value);
      drawGraph(kpi);
    };

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
    };

    const renderDropdownOptions = (): JSX.Element => {
      return (
        <DropdownOptionsContainer
          onClick={() => setShowDropdownOptionsContainer(!showDropdownOptionsContainer)}
        >
          <StyledOptionIcon icon={"Options"} size={"16px"} iconColor={"grey80"} />
          {showDropdownOptionsContainer && (
            <ScorecardKPIDropdownContainer>
              <ScorecardKPIDropdownOptions
                setShowDropdownOptions={setShowDropdownOptionsContainer}
                setModalOpen={setViewEditKPIModalOpen}
              />
            </ScorecardKPIDropdownContainer>
          )}
        </DropdownOptionsContainer>
      );
    };

    const weekToDate = (week: number): string =>
      moment(company.fiscalYearStart)
        .add(week, "w")
        .startOf("week" as moment.unitOfTime.StartOf)
        .format("MMM D");

    const setCurrentLog = (step = 1) => {
      const Log = kpi?.scorecardLogs[kpi?.scorecardLogs.length - step];
      Log ? renderNewValue(Log?.score) : null;
    };

    useEffect(() => {
      if (kpiId !== null) {
        const rollupKPI = scorecardStore.kpis.find(kpi => kpi.id == kpiId && kpi.parentType);

        keyPerformanceIndicatorStore.getKPI(kpiId).then(value => {
          const KPI = rollupKPI || keyPerformanceIndicatorStore?.kpi;
          setDescription(
            KPI.description ||
              descriptionTemplatesFormatted?.find(t => t.templateType == "kpi")?.body.body,
          );
          setCurrentLog();
          setKpi(KPI);
          setLoading(false);
        });
      }
    }, [kpiId]);

    const saveKPI = body => {
      keyPerformanceIndicatorStore.updateKPI(Object.assign({}, kpi, body));
    };

    const drawGraph = KPI => {
      const startWeek = (company.currentFiscalQuarter - 1) * 13 + 1;
      const weekNumbers = R.range(startWeek, company.currentFiscalWeek + 1);
      const weeks = KPI?.period.get(company.currentFiscalYear)?.toJSON();
      const currentQuarterData = weekNumbers.map(week => (weeks?.[week] ? weeks[week].score : 0));
      setData({
        labels: R.range(startWeek, startWeek + 13).map(weekToDate),
        datasets: [
          {
            label: "Current Quarter",
            data: currentQuarterData,
            fill: false,
            backgroundColor: white,
            borderColor: primary100,
            borderWidth: 1.5,
            tension: 0,
          },
        ],
      });
    };

    const closeModal = () => {
      setViewEditKPIModalOpen(false);
    };

    useEffect(() => {
      if (!kpi) {
        return;
      }
      const weeks = kpi.period.get(company.currentFiscalYear)?.toJSON();
      drawGraph(kpi);
      const targetText = formatValue(kpi.targetValue, kpi.unitType);
      setLogic(
        kpi.greaterThan
          ? `Greater than or equal to ${targetText}`
          : `Less than or equal to ${targetText}`,
      );
      setHeader(`${kpi.title}`);
      const currentWeek = weeks?.[company.currentFiscalWeek];
      const score = currentWeek ? currentWeek?.score : undefined;
      setValue(score);
    }, [kpi]);

    return (
      <>
        <StyledModal
          isOpen={viewEditKPIModalOpen}
          style={{ width: "60rem", maxHeight: "80%", overflow: "auto" }}
          onBackgroundClick={e => {
            closeModal();
          }}
        >
          <Container>
            {loading ? (
              <Loading />
            ) : (
              kpi && (
                <>
                  <HeaderContainer>
                    <Header>
                      <StyledContentEditable
                        innerRef={headerRef}
                        html={kpi.title}
                        disabled={false}
                        onChange={e => {
                          if (!e.target.value.includes("<div>")) {
                            keyPerformanceIndicatorStore.updateKPITitle(
                              "title",
                              headerRef.current.innerText?.trim(),
                            );
                          }
                        }}
                        onKeyDown={key => {
                          if (key.keyCode == 13) {
                            headerRef.current.blur();
                          }
                        }}
                        onBlur={() => keyPerformanceIndicatorStore.update()}
                      />
                    </Header>
                    <DropdownOptions>
                      {renderDropdownOptions()}
                      <CloseIconContainer
                        onClick={() => {
                          closeModal();
                        }}
                      >
                        <Icon icon={"Close"} size={"16px"} iconColor={"grey80"} />
                      </CloseIconContainer>
                    </DropdownOptions>
                  </HeaderContainer>
                  <OwnerAndLogicContainer>
                    {renderStatus()}
                    <OwnerAndLogicText>
                      <OwnedBySection
                        marginLeft={"0px"}
                        marginRight={"0px"}
                        marginTop={"auto"}
                        marginBottom={"auto"}
                        ownedBy={kpi.ownedBy}
                        type={"scorecard"}
                      />
                    </OwnerAndLogicText>
                    <Icon icon={"Stats"} iconColor={greyInactive} size={16} />
                    <OwnerAndLogicText style={{ textTransform: "capitalize" }}>
                      {R.uniq(kpi.viewers.map(viewer => viewer.type)).join(", ")} KPI
                    </OwnerAndLogicText>

                    <Icon icon={"Initiative"} iconColor={greyInactive} size={16} />
                    <OwnerAndLogicText>{logic}</OwnerAndLogicText>
                    {kpi?.parentType && (
                      <KPITypeContainer>
                        <KPITypeIcon icon={"Function"} size={16} iconColor={greyInactive} />
                        <KPIParentTypeText> {formatKpiType(kpi?.parentType)} </KPIParentTypeText>
                      </KPITypeContainer>
                    )}
                  </OwnerAndLogicContainer>
                  <ValueAndUpdateContainer>
                    <ValueText>{formatValue(value, kpi.unitType)}</ValueText>

                    <UpdateProgressButton
                      disabled={kpi?.parentType}
                      onClick={() => {
                        setUpdateKPIModalOpen(true);
                      }}
                    >
                      <Icon icon={"Edit"} iconColor={white} size={16} style={{ marginRight: 16 }} />
                      <div>Update Progress</div>
                    </UpdateProgressButton>
                  </ValueAndUpdateContainer>
                  <ChartContainer>
                    {data && <Line data={data} options={chartOptions} />}
                  </ChartContainer>
                  <SubHeader>Description</SubHeader>
                  {description && (
                    <TrixEditorContainer>
                      <TrixEditor
                        className={"trix-kpi-modal"}
                        autoFocus={false}
                        placeholder={"Add a description..."}
                        onChange={description => {
                          setDescription(description);
                          saveKPI({ description });
                        }}
                        value={description}
                        mergeTags={[]}
                      />
                    </TrixEditorContainer>
                  )}
                  <SubHeader>Activity</SubHeader>
                  <ActivityLogsContainer>
                    {R.sort(R.descend(R.prop("createdAt")), kpi.scorecardLogs).map(log => {
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
                              <b>
                                {log.user.firstName} {log.user.lastName}
                              </b>{" "}
                              added an update of{" "}
                              <b>
                                <u>{formatValue(log.score, kpi.unitType)}</u>
                              </b>{" "}
                              for week <b>{log.week}</b>
                            </ActivityLogText>
                            <ActivityLogText mb={4}>
                              <i>{log.note}</i>
                            </ActivityLogText>
                            <ActivityLogText>
                              <ActivityLogDate>
                                {moment(log.createdAt).format("MMM D, YYYY")}
                              </ActivityLogDate>
                              <ActivityLogDelete
                                onClick={() => {
                                  keyPerformanceIndicatorStore
                                    .deleteScorecardLog(log.id)
                                    .then(() => {
                                      setCurrentLog();
                                    });
                                }}
                              >
                                {" "}
                                Delete
                              </ActivityLogDelete>
                            </ActivityLogText>
                          </ActivityLogTextContainer>
                        </ActivityLogContainer>
                      );
                    })}
                  </ActivityLogsContainer>
                </>
              )
            )}
          </Container>
        </StyledModal>
        {kpi && (
          <UpdateKPIModal
            kpiId={kpi.id}
            ownedById={kpi.ownedById}
            unitType={kpi.unitType}
            year={company.currentFiscalYear}
            week={company.currentFiscalWeek}
            currentValue={value}
            renderNewValue={renderNewValue}
            headerText={"Update Current Week"}
            updateKPIModalOpen={updateKPIModalOpen}
            setKpis={setKpis}
            setUpdateKPIModalOpen={setUpdateKPIModalOpen}
          />
        )}
      </>
    );
  },
);

const Container = styled.div`
  width: 100%;
`;

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
`;

const StyledContentEditable = styled(ContentEditable)`
  font-weight: bold;
  font-size: 20px;
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 4px;
  padding-right: 4px;
  margin-right: -4px;
`;

const Header = styled.div`
  margin: 0px;
  margin-bottom: 16px;
  font-family: Exo, Lato, sans-serif;
  font-size: 20px;
  font-weight: bold;
`;

const OwnerAndLogicContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  margin-bottom: 32px;
`;

const OwnerAndLogicText = styled.div`
  font-size: 12px;
  color: ${props => props.theme.colors.grey100};
  margin-left: 8px;
  margin-right: 16px;
`;

const ValueAndUpdateContainer = styled.div`
  width: 100%;
  display: flex;
  margin-bottom: 22px;
`;

const ValueText = styled.p`
  margin: 0px;
  margin-right: 16px;
  font-size: 32px;
  font-weight: bold;
`;

const StatusBadgeContainer = styled.div`
  margin-top: auto;
  margin-bottom: auto;
  margin-right: 16px;
  ${StatusBadge} {
    font-size: 16px;
  }
`;

type UpdateProgressButtonProps = {
  disabled?: boolean;
};
const UpdateProgressButton = styled.div<UpdateProgressButtonProps>`
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
  opacity: ${props => (props.disabled ? "0.5" : "1.0")};
  pointer-events: ${props => (props.disabled ? "none" : "all")};
  &:hover {
    cursor: pointer;
    background: ${props => props.theme.colors.primary80};
  }
`;

const SubHeader = styled.p`
  margin-top: 32px;
  margin-bottom: 16px;
  font-size: 12px;
  font-weight: bold;
`;

const ActivityLogsContainer = styled.div`
  width: 100%;
  margin-top: 24px;
`;

const ActivityLogContainer = styled.div`
  display: flex;
  margin-bottom: 16px;
`;

const ActivityLogTextContainer = styled.div``;

const ActivityLogDate = styled.span`
  font-size: 9px;
  color: ${props => props.theme.colors.grey100};
`;

const ActivityLogDelete = styled.span`
  font-size: 9px;
  color: ${props => props.theme.colors.grey100};
  margin-left: 8px;
  &:hover {
    color: ${props => props.theme.colors.warningRed};
    cursor: pointer;
  }
`;

type ActivityLogTextProps = {
  mb?: number;
};

const ActivityLogText = styled.p<ActivityLogTextProps>`
  font-size: 12px;
  margin-top: 0px;
  margin-bottom: ${props => props.mb || 0}px;
`;

const TrixEditorContainer = styled.div`
  margin-top: 4px;
  width: 100%;
`;

const DropdownOptions = styled.div`
  display: flex;
`;

const DropdownOptionsContainer = styled.div`
  margin-right: 16px;
  &: hover {
    cursor: pointer;
  }
`;
const ScorecardKPIDropdownContainer = styled.div`
  margin-left: -50px;
`;

const StyledOptionIcon = styled(Icon)`
  transform: rotate(90deg);
`;

const CloseIconContainer = styled.div`
  &:hover {
    cursor: pointer;
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const KPITypeContainer = styled.div`
  display: flex;
  color: ${props => props.theme.colors.grey100};
`;
const KPITypeIcon = styled(Icon)``;

const KPIParentTypeText = styled.div`
  font-size: 12px;
  padding: 4px;
`;
