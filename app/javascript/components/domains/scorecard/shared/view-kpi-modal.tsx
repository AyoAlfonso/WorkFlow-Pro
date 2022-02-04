import React, { useState, useEffect, useRef } from "react";
import * as R from "ramda";
import styled from "styled-components";
import moment from "moment";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import ContentEditable from "react-contenteditable";
import Modal from "styled-react-modal"; //Use this to minimize issues around closing modals
import { useMst } from "~/setup/root";
import { StatusBadge } from "~/components/shared/status-badge";
import { Loading } from "~/components/shared/loading";
import { Avatar } from "~/components/shared/avatar";
import { Icon } from "~/components/shared/icon";
import { Line } from "react-chartjs-2";
import { baseTheme } from "~/themes/base";
import { getScorePercent } from "../scorecard-table-view";
import { MiniUpdateKPIModal } from "./update-kpi-modal";
import ReactQuill from "react-quill";
import { OwnedBySection } from "~/components/domains/goals/shared/owned-by-section";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import { toJS } from "mobx";
import { titleCase } from "~/utils/camelize";
import { ScorecardKPIDropdownOptions } from "./scorecard-dropdown-options";
import "~/stylesheets/modules/trix-editor.css";
import { debounce } from "lodash";
import { Button } from "~/components/shared/button";
import { kpiPopup } from "./parent-kpi-popup";
import { kpiViewerName } from "./parent-kpi-popup";

interface ViewEditKPIModalProps {
  kpiId: number;
  setViewEditKPIModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  viewEditKPIModalOpen: boolean;
  setKpis: any;
  setShowEditExistingKPIContainer: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentSelectedKpi?: React.Dispatch<any>;
}

export const ViewEditKPIModal = observer(
  ({
    kpiId,
    setViewEditKPIModalOpen,
    viewEditKPIModalOpen,
    setKpis,
    setShowEditExistingKPIContainer,
    setCurrentSelectedKpi,
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
    const [value, setValue] = useState<number>(undefined);
    const [logic, setLogic] = useState("");
    const [updateKPIModalOpen, setUpdateKPIModalOpen] = useState(false);
    const [data, setData] = useState(null);
    const descriptionTemplateForKPI = descriptionTemplatesFormatted.find(
      t => t.templateType == "kpi",
    )?.body.body;
    const [description, setDescription] = useState<string>("");
    const [showDropdownOptionsContainer, setShowDropdownOptionsContainer] = useState<boolean>(
      false,
    );
    const [open, setOpen] = useState(false);

    const headerRef = useRef(null);

    if (R.isNil(keyPerformanceIndicatorStore) || R.isNil(kpiId)) {
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
      tango,
    } = baseTheme.colors;

    const [functionColor, setFunctionColor] = useState(greyInactive);

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
    const deleteKPI = () => {
      if (confirm(`Are you sure you want to delete this KPI`)) {
        keyPerformanceIndicatorStore.deleteKPI().then(() => {
          closeModal();
        });
      }
    };

    const closeKPI = () => {
      if (confirm(`Are you sure you want to archive this KPI`)) {
        keyPerformanceIndicatorStore.toggleKPIStatus().then(() => {
          closeModal();
        });
      }
    };

    const updateKPI = () => {
      if (confirm(`Are you sure you want to edit this KPI`)) {
        closeModal();
        setShowEditExistingKPIContainer(true);
      }
    };

    const openKPI = () => {
      if (confirm(`Are you sure you want to open this KPI`)) {
        keyPerformanceIndicatorStore.toggleKPIStatus().then(() => {
          closeModal();
        });
      }
    };

    const formatKpiType = kpiType => titleCase(kpiType);
    const renderStatus = () => {
      if (!kpi) {
        return;
      }

      if (kpi?.parentKpi.length > kpi?.relatedParentKpis.length) {
        return (
          <StatusBadgeContainer>
            <BrokenCircleIcon />
            <StatusBadge fontSize={"21px"} color={tango} background={white}>
              Broken
            </StatusBadge>
          </StatusBadgeContainer>
        );
      }
      if (value === undefined) {
        return (
          <StatusBadgeContainer>
            <StatusBadge fontSize={"21px"} color={greyActive} background={backgroundGrey}>
              No Update
            </StatusBadge>
          </StatusBadgeContainer>
        );
      }
      const scorePercent = getScorePercent(value, kpi.targetValue, kpi.greaterThan);
      if (scorePercent >= 100) {
        return (
          <StatusBadgeContainer>
            <StatusBadge fontSize={"21px"} color={successGreen} background={fadedGreen}>
              On Track
            </StatusBadge>
          </StatusBadgeContainer>
        );
      } else if (scorePercent >= kpi.needsAttentionThreshold) {
        return (
          <StatusBadgeContainer>
            <StatusBadge fontSize={"21px"} color={poppySunrise} background={fadedYellow}>
              Needs Attention
            </StatusBadge>
          </StatusBadgeContainer>
        );
      } else {
        return (
          <StatusBadgeContainer>
            <StatusBadge fontSize={"21px"} color={warningRed} background={fadedRed}>
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
                setShowEditExistingKPIContainer={setShowEditExistingKPIContainer}
              />
            </ScorecardKPIDropdownContainer>
          )}
        </DropdownOptionsContainer>
      );
    };

    const weekToDate = (week: number): string =>
      moment(company.fiscalYearStart)
        .add(week, "w")
        .year(company.currentFiscalYear)
        .startOf("week" as moment.unitOfTime.StartOf)
        .format("MMM D");

    const setCurrentLog = (step = 1) => {
      const Log = kpi?.scorecardLogs[kpi?.scorecardLogs.length - step];
      Log ? renderNewValue(Log?.score) : null;
    };

    useEffect(() => {
      setLoading(true);
      if (!R.isNil(kpiId)) {
        const advancedKPI = scorecardStore.kpis.find(kpi => kpi.id == kpiId && kpi.parentType);
        keyPerformanceIndicatorStore.getKPI(kpiId).then(value => {
          const KPI = advancedKPI || keyPerformanceIndicatorStore?.kpi;
          if (KPI) {
            setDescription(KPI.description || descriptionTemplateForKPI);
            setCurrentLog();
            setKpi(KPI);
            setLoading(false);
          }
        });
      }
    }, [kpiId]);

    const saveKPI = body => {
      debounce(() => {
        keyPerformanceIndicatorStore.updateKPI(Object.assign({}, kpi, body), true);
      }, 500)();
    };

    const drawGraph = KPI => {
      const startWeek = (company.currentFiscalQuarter - 1) * 13 + 1;
      const weekNumbers = R.range(startWeek, company.currentFiscalWeek + 1);
      const weeks = KPI?.period.get(company.yearForCreatingAnnualInitiatives)?.toJSON();
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

    const closePopup = () => {
      setOpen(false);
    };

    const closeModal = () => {
      setViewEditKPIModalOpen(false);
      closePopup();
    };

    useEffect(() => {
      if (!kpi) {
        return;
      }
      setLoading(true);
      const weeks = kpi.period.get(company.yearForCreatingAnnualInitiatives)?.toJSON();
      drawGraph(kpi);
      const targetText = formatValue(kpi.targetValue, kpi.unitType);
      setLogic(
        kpi.greaterThan
          ? `Greater than or equal to ${targetText}`
          : `Less than or equal to ${targetText}`,
      );
      const currentWeek = weeks?.[company.currentFiscalWeek];
      const score = currentWeek ? currentWeek?.score : undefined;
      setValue(score);
      setLoading(false);
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
                      {R.uniq(kpi?.viewers.map(viewer => kpiViewerName(viewer))).join(", ")} KPI
                    </OwnerAndLogicText>

                    <Icon icon={"Initiative"} iconColor={greyInactive} size={16} />
                    <OwnerAndLogicText>{logic}</OwnerAndLogicText>
                    {kpi?.parentType && (
                      <KPITypeContainer>
                        <KPITypeWrapper onMouseEnter={() => {setFunctionColor(primary100)}}
                                        onMouseLeave={() => {setFunctionColor(greyInactive)}}
                                        onClick={() => {setOpen(!open)}}
                        >
                          <KPITypeIcon icon={"Function"} size={16} iconColor={functionColor}/>
                          <KPIParentTypeText> {formatKpiType(kpi?.parentType)} </KPIParentTypeText>
                        </KPITypeWrapper>
                        <Pop><PopupContainer>{kpiPopup(kpi, open, setOpen, setCurrentSelectedKpi, setViewEditKPIModalOpen)}</PopupContainer></Pop>
                      </KPITypeContainer>
                    )}
                  </OwnerAndLogicContainer>
                  {kpi?.parentKpi.length > kpi?.relatedParentKpis.length && (
                    <MissingParentsErrorContainer shadow={true}>
                      <MissingKPIIcon icon={"Warning-PO"} size={"24px"} iconColor={greyInactive} />
                      <MissingParentsTexts>
                        <MissingParentsErrorTitle>
                          {" "}
                          {kpi.closedAt ? "This KPI is closed" : "This KPI is Broken"}
                        </MissingParentsErrorTitle>
                        <MissingParentsErrorBody>
                          {kpi.closedAt
                            ? `You have closed this KPI. If this was a mistake, click on "Open KPI" to reactivate this. You can also delete the KPI if you don't wish to keep the date for future reference.`
                            : `One or more KPIs related to this Advacned Function KPI are removed. As a
                          result this KPI cannot be calculated. We should open this KPI for you to continue using it to track your scorecard 
                          to fix this issue`}
                        </MissingParentsErrorBody>
                      </MissingParentsTexts>
                      <MissingParentsButtons>
                        <ButtonContainer>
                          {kpi.closedAt ? (
                            <KPIButton
                              small
                              variant={"primary"}
                              m={1}
                              style={{ width: "90%", fontSize: "12px", fontWeight: "bold" }}
                              onClick={() => {
                                openKPI();
                              }}
                            >
                              Open
                            </KPIButton>
                          ) : (
                            <KPIButton
                              small
                              variant={"primary"}
                              m={1}
                              style={{ width: "90%", fontSize: "12px", fontWeight: "bold" }}
                              onClick={() => {
                                updateKPI();
                              }}
                            >
                              Edit
                            </KPIButton>
                          )}

                          <KPIButton
                            small
                            variant={"redOutline"}
                            m={1}
                            style={{ width: "90%", fontSize: "12px", fontWeight: "bold" }}
                            onClick={() => {
                              deleteKPI();
                            }}
                          >
                            Delete
                          </KPIButton>
                        </ButtonContainer>
                      </MissingParentsButtons>
                    </MissingParentsErrorContainer>
                  )}
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
                  <TrixEditorContainer>
                    <ReactQuill
                      onBlur={() => {
                        saveKPI({ description });
                      }}
                      className="trix-kpi-modal"
                      theme="snow"
                      value={description}
                      onChange={(content, delta, source, editor) => {
                        setDescription(editor.getHTML());
                      }}
                    />
                  </TrixEditorContainer>
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
                            <ActivityLogText fontSize={"14px"} mb={kpi.description ? 8 : 0}>
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
          <MiniUpdateKPIModal
            kpiId={kpi.id}
            ownedById={kpi.ownedById}
            unitType={kpi.unitType}
            year={company.yearForCreatingAnnualInitiatives}
            week={company.currentFiscalWeek}
            currentValue={value}
            headerText={"Update Current Week"}
            updateKPIModalOpen={updateKPIModalOpen}
            setUpdateKPIModalOpen={setUpdateKPIModalOpen}
            setKpis={setKpis}
          />
        )}
      </>
    );
  },
);

const PopupContainer = styled.div`
  position: absolute;
  padding-top: 15px;
  //border: 1px solid black;
`;

const Pop = styled.div`
  position: relative;
  //padding-top: 15px;
  //border: 1px solid black;
`;

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
  margin-bottom: 16px;
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
  display: flex;
  align-items: center;
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
  font-size: 14px;
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
  font-size: 14px;
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
  fontSize?: string;
};
type MissingParentsErrorContainerProps = {
  shadow: boolean;
};
const ActivityLogText = styled.p<ActivityLogTextProps>`
  font-size: ${props => props.fontSize || "12px"};
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

const KPITypeWrapper = styled.div`
display: flex;
  &:hover {
    cursor: pointer;
    color: ${props => props.theme.colors.primary100};
  }
`;

const KPITypeIcon = styled(Icon)``;

const KPIParentTypeText = styled.div`
  font-size: 12px;
  padding: 4px;
`;

const BrokenCircleIcon = styled.div`
  display: inline-flex;
  background: ${props => props.theme.colors.tango};
  width: 21px;
  height: 21px;
  border-radius: 50%;
  font-size: 21px;
`;

const MissingParentsErrorContainer = styled.div<MissingParentsErrorContainerProps>`
  width: 95%;
  display: inline-flex;
  background: ${props => props.theme.colors.grey10};
  height: 75px;
  padding: 20px;
  margin: 0px 0px 15px;
  border-radius: 8px;
  box-shadow: ${props => (props.shadow ? "1px 3px 4px 2px rgba(0, 0, 0, .1)" : "0")};
`;

const MissingParentsErrorTitle = styled.div`
  display: block;
  color: ${props => props.theme.colors.grey100};
  margin: 0 15px;
`;

const MissingParentsErrorBody = styled.div`
  display: block;
  color: #000;
  margin: 15px;
  font-size: 12px;
`;

const MissingParentsTexts = styled.div`
  width: 90%;
  display: inline-block;
  margin-right: 80px;
`;

const MissingParentsButtons = styled.div`
  display: inline-flex;
`;

const ButtonContainer = styled.div`
  display: inline-block;
  flex-direction: row;
  align-items: baseline;
`;

const KPIButton = styled(Button)`
  width: 90%;
  font-size: 12px;
  font-weight: bold;
`;

const MissingKPIIcon = styled(Icon)`
  align-items: flex-start;
`;
