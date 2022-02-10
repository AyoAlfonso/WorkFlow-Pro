import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useMst } from "~/setup/root";
import { Avatar } from "~/components/shared/avatar";
import { Icon } from "~/components/shared/icon";
import { baseTheme } from "~/themes/base";
import { getScorePercent } from "../scorecard-table-view";
import "~/stylesheets/modules/trix-editor.css";
import { ViewEditKPIModal } from "./view-kpi-modal";
import { StatusBadgeHover } from "./status-badge-hover";
import Tooltip from '@material-ui/core/Tooltip';

export function kpiViewerName(viewer) {
    const {
      teamStore: { teams },
      teamStore,
      userStore: { users },
      userStore,
      companyStore: { company },
    } = useMst();
    if (viewer.type == "user") {
        const userFound = users.find(user => user.id.toString() == viewer.id);
        return userFound.firstName + " " + userFound.lastName + " ";
    } else if (viewer.type == "team") {
        const teamFound = teams.find(team => team.id.toString() == viewer.id);
        return teamFound.name + " ";
    } else if (viewer.type == "company") {
        return company.name + " ";
    } else {
        return "";
    }
}

const getStatusColor = (percentScore, needsAttentionThreshold) => {
    const {
        fadedYellow,
        fadedGreen,
        fadedRed,
        successGreen,
        poppySunrise,
        warningRed,
        backgroundGrey,
        greyActive,
    } = baseTheme.colors;
      
    if (percentScore === null) {
        return [greyActive, backgroundGrey];
    } else if (percentScore >= 100) {
        return [successGreen, fadedGreen];
    } else if (percentScore >= needsAttentionThreshold) {
        return [poppySunrise,  fadedYellow];
    } else {
        return [warningRed, fadedRed];
    }
};

function convertDate(d) {
    var date = new Date(d);
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    var dt = date.getDate();
    let dts = dt.toString();
    let months: string[] = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    if (dt % 10 == 1 && dt % 100 != 11) {
      dts = dt + "st";
    } else if (dt % 10 == 2 && dt % 100 != 12) {
      dts = dt + "nd";
    } else if (dt % 10 == 3 && dt % 100 != 13) {
      dts = dt + "rd";
    } else {
      dts = dt + "th";
    }
    return ('(' + months[month - 1] + ' ' + dts +', ' + year + ')');
}

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

export function averageScore(kpi) {
    const getScore = (value: number, target: number, greaterThan: boolean) =>
        greaterThan ? value : (target + target - value);

    const {
        companyStore: { company },
    } = useMst();
    const year = company.yearForCreatingAnnualInitiatives;

    const calcQuarterAverageScores = (
        weeks: any,
        target: number,
        greaterThan: boolean,
        parentType: string,
    ) => {
        const quarterScores = [
            [null, 0],
        ];
        weeks.forEach(({ week, score }) => {
            if (quarterScores[0]) {
                quarterScores[0][0] += score;
                quarterScores[0][1]++;
            }
        });
        return quarterScores.map(tuple =>
            tuple[0] === null ? null : getScore(tuple[0] / tuple[1], target, greaterThan),
        );
    };
    const weeks = Object.values(kpi?.period?.[year] || {});
    const percentScores = calcQuarterAverageScores(
        weeks,
        kpi.targetValue,
        kpi.greaterThan,
        kpi.parentType,
    )
    return (
        ((percentScores[0] === null) ? 0 : percentScores[0])
    );
}

function progressScore(kpi) {
    const {
        companyStore: { company },
    } = useMst();
    const year = company.yearForCreatingAnnualInitiatives;

    const calcQuarterAverageScores = (
        weeks: any,
        target: number,
        greaterThan: boolean,
        parentType: string,
    ) => {
        const quarterScores = [
            [null, 0],
        ];
        weeks.forEach(({ week, score }) => {
            if (quarterScores[0]) {
                quarterScores[0][0] += score;
                quarterScores[0][1]++;
            }
        });
        return quarterScores.map(tuple =>
            tuple[0] === null ? null : getScorePercent(tuple[0] / tuple[1], target, greaterThan),
        );
    };
    const weeks = Object.values(kpi?.period?.[year] || {});
    const percentScores = calcQuarterAverageScores(
        weeks,
        kpi.targetValue,
        kpi.greaterThan,
        kpi.parentType,
    )
    return (
        ((percentScores[0] === null) ? 0 : percentScores[0])
    );
}

export function kpiPopup(kpi, open, setOpen, setCurkpi, setModalOpen) {
    const {white,} = baseTheme.colors;

    function renderPopup(list) {

        function PopupRow(props) {
            const defaultBackGroundColor = props.color[1];
            const defaultFontColor = props.color[0];
            const [backgroundColor, setBackGroundColor] = useState<string>(defaultBackGroundColor);
            const [fontColor, setFontColor] = useState<string>(defaultFontColor);
        return (
            <Row>
                <LeftAlign>
                    <Tooltip title={props.kpi.ownedBy.firstName + " " + props.kpi.ownedBy.lastName} placement="top" arrow>
                        <SpanAvatar>{props.userIcon}</SpanAvatar>
                    </Tooltip>
                    <ItemSpan>
                        <KPITitleContainer onClick={() => {setCurkpi(props.kpi.id); setModalOpen(true);}}>
                            <KPITitle>
                                {props.kpi.title}
                            </KPITitle>
                        </KPITitleContainer>
                        <LastUpdate>
                            {props.lastUpdate}
                        </LastUpdate>
                        <LastUpdateDate>
                          {props.updateDate}
                        </LastUpdateDate>
                    </ItemSpan>
                </LeftAlign>
                <RightAlign>
                    <Tooltip title={formatValue(props.kpi.unitType, averageScore(props.kpi)) + "/" + formatValue(props.kpi.unitType, props.kpi.targetValue)} placement="top" arrow>
                        <StatusContainer onMouseEnter={() => {setBackGroundColor(props.color[0]);
                                                              setFontColor(white);}}
                                         onMouseLeave={() => {setBackGroundColor(props.color[1]);
                                                              setFontColor(props.color[0]);}}
                        >
                            <StatusBadgeHover fontSize={"12px"}
                                              background={backgroundColor}
                                              color={fontColor}
                                              height={"31px"}
                                              width={"43px"}
                                              hoverWidth={"31px"}
                            >
                                {progressScore(props.kpi)} %
                            </StatusBadgeHover>
                        </StatusContainer>
                    </Tooltip>
                </RightAlign>
            </Row>
        )
    }

    if (list.length) {
      const listItems = list.map((k) =>
        <PopupRow
          userIcon={<Avatar
                      firstName={k.ownedBy.firstName}
                      lastName={k.ownedBy.lastName}
                      defaultAvatarColor={k.ownedBy.defaultAvatarColor}
                      avatarUrl={k.ownedBy.avatarUrl}
                      size={16}
                      marginLeft="7px"
                      marginRight="5px"
                      marginTop="0"
                      marginBottom="0px"
                    />}
          kpi={k}
          lastUpdate={'Last Update: '+ ((k.scorecardLogs.length > 0) ?
                                          formatValue(k.unitType, k.scorecardLogs[k.scorecardLogs.length - 1].score) : '--')}
          updateDate={(k.scorecardLogs.length > 0) ? convertDate(k.updatedAt) : '--'}
          color={getStatusColor(progressScore(k), k.needsAttentionThreshold)}
        >
            {progressScore(k).toString()}
        </PopupRow>
      );
    
      return (
        <KPIPopup>
            <PopupHeader>
                Associated KPIs
                <Spacer/>
                <CloseIconContainerdd onClick={() => {setOpen(false);}}>
                    <StyledIcon icon={"Close"} size={16} />
                </CloseIconContainerdd>
            </PopupHeader>
            {listItems}
        </KPIPopup>
      )
    }
  }

  return (
    <Parentdiv>
        {open && renderPopup(kpi?.relatedParentKpis)}
    </Parentdiv>
  )
}

const Parentdiv = styled.div`
  height: 0;
  width: 0;
  postion: absolute;
`;

const KPIPopup = styled.ul`
  width: 244px;
  height: 264px;
  transform: translatex(-25%);
  overflow-y:auto;
  border-radius: 4px;
  background-color: white;
  padding-top: 16px;
  padding-bottom: 15px;
  padding-left: 0;
  padding-right: 0;
  box-shadow: 0px 3px 4px 2px rgba(0, 0, 0, 0.1);
  z-index: 1;
`;

const PopupHeader = styled.div`
  padding-left: 11px;
  color: black;
  font-size: 16px;
  font-weight: bold;
  justify-self: right;
  margin-left: 0;
  margin-bottom: 11px;
`;

const Spacer = styled.div`
  display: inline-block;
  width: 85px;
  height: 0;
`;

const CloseIconContainerdd = styled.div`
  display: inline-block;
  justify-self: right;
  &:hover {
    cursor: pointer;
  }
`;

const StyledIcon = styled(Icon)`
  display: inline-block;
  color: ${props => props.theme.colors.grey60};
`;

const Row = styled.div`
  position: relative;
  border-bottom: 1px solid ${props => props.theme.colors.borderGrey};
  padding: 6px;
  display: flex;
  vertical-align: middle;
  justify-content: space-between;
`;

const LeftAlign = styled.div`
  display: inline-block;
  vertical-align: middle;
`;

const RightAlign = styled.div`
  display: inline-block;
  vertical-align: middle;
  margin-right: 11px;
  height: 26px;
`;

const SpanAvatar = styled.div`
  display: inline-block;
`;

const ItemSpan = styled.div`
  display: inline-block;
  vertical-align: middle;
`;

const KPITitleContainer = styled.div`
  overflow: hidden;
  &:hover {
    cursor: pointer;
  }
`;

const KPITitle = styled.div`
  text-overflow: ellipsis;
  font-size: 14px;
  color: black;
  max-width: 145px;
  overflow: hidden;
`;

const LastUpdate = styled.div`
  font-size: 9px;
  margin-top: 5px;
  color: ${props => props.theme.colors.greyActive};
`;

const LastUpdateDate = styled.div`
  font-size: 9px;
  color: ${props => props.theme.colors.greyActive};
`;

const StatusContainer = styled.div`
  display: inline-block;
  height: 31px;
  width: 43px;
  margin-top: 5px;
  justify-content: center;
  align-items: center;
  vertical-align: middle;
  overflow: hidden;
  border-radius: 2px;
`;