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
import { DummyOwnedBy } from "./shared/dummy-scorecard-owned-by";
import { Loading } from "../../shared/loading";
import { StatusBadge } from "~/components/shared/status-badge";
import { AddKPIDropdown } from "./shared/add-kpi-dropdown";
import { ViewEditKPIModal } from "./shared/view-kpi-modal";
import { MiniUpdateKPIModal } from "./shared/update-kpi-modal";
import { AddExistingManualKPIModal } from "./shared/edit-existing-manual-kpi-modal";
import { titleCase } from "~/utils/camelize";
import { toJS } from "mobx";
import Tooltip from '@material-ui/core/Tooltip';
import { BeenhereOutlined } from "@material-ui/icons";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

type DummyScorecardTableViewProps = {
};

export const DummyScorecardTableView = observer(
  ({
  }: DummyScorecardTableViewProps): JSX.Element => {
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

    function createData( update, kpi, score, status, owner, wk1, wk2, wk3, wk4, wk5, wk6, wk7, wk8, wk9, wk10, wk11, wk12, wk13 ) {
      return { update, kpi, score, status, owner, wk1, wk2, wk3, wk4, wk5, wk6, wk7, wk8, wk9, wk10, wk11, wk12, wk13};
    }
   // <DummyOwnedBy ownedBy={value} marginLeft={"0px"} disabled />
    const rows = [
      createData(<BlueUpdateKpiIcon icon={"Update_KPI_New"} size={16}/> , "example", <StatusContainer> <StatusBadge fontSize={"12px"} background={fadedGreen} color={successGreen}> 100% </StatusBadge> </StatusContainer>, <StatusContainer> <StatusBadge fontSize={"12px"} background={fadedGreen} color={successGreen}> OnTrack </StatusBadge> </StatusContainer>, "ownedby", <WeekText color={successGreen}> 10 </WeekText>, " ", " ", " ", <WeekText color={successGreen}> 10 </WeekText>, <WeekText color={successGreen}> 10 </WeekText>, <WeekText color={successGreen}> 10 </WeekText>, <WeekText color={successGreen}> 10 </WeekText>, <WeekText color={successGreen}> 10 </WeekText>, <WeekText color={successGreen}> 10 </WeekText>, <WeekText color={successGreen}> 10 </WeekText>, <WeekText color={successGreen}> 10 </WeekText>, <WeekText color={successGreen}> 10 </WeekText> ),
      createData(<BlueUpdateKpiIcon icon={"Update_KPI_New"} size={16}/> , "example", <StatusContainer> <StatusBadge fontSize={"12px"} background={fadedRed} color={warningRed}> 40% </StatusBadge> </StatusContainer>, <StatusContainer> <StatusBadge fontSize={"12px"} background={fadedRed} color={warningRed}> Behind </StatusBadge> </StatusContainer>, "ownedby", <WeekText color={successGreen}> 10 </WeekText>, <WeekText color={successGreen}> 10 </WeekText>, <WeekText color={successGreen}> 10 </WeekText>, <WeekText color={successGreen}> 10 </WeekText>, <WeekText color={successGreen}> 10 </WeekText>, <WeekText color={successGreen}> 10 </WeekText>, <WeekText color={successGreen}> 10 </WeekText>, <WeekText color={successGreen}> 10 </WeekText>, <WeekText color={successGreen}> 10 </WeekText>, <WeekText color={successGreen}> 10 </WeekText>, <WeekText color={successGreen}> 10 </WeekText>, <WeekText color={successGreen}> 10 </WeekText>, <WeekText color={successGreen}> 10 </WeekText> ),
      createData(<BlueUpdateKpiIcon icon={"Update_KPI_New"} size={16}/> , "example", <StatusContainer> <StatusBadge fontSize={"12px"} background={backgroundGrey} color={greyActive}> - </StatusBadge> </StatusContainer>, <StatusContainer> <StatusBadge fontSize={"12px"} background={backgroundGrey} color={greyActive}> Broken </StatusBadge> </StatusContainer>, "ownedby", <WeekText color={successGreen}> 10 </WeekText>, <WeekText color={successGreen}> 10 </WeekText>, <WeekText color={successGreen}> 10 </WeekText>, <WeekText color={successGreen}> 10 </WeekText>, <WeekText color={successGreen}> 10 </WeekText>, <WeekText color={successGreen}> 10 </WeekText>, <WeekText color={successGreen}> 10 </WeekText>, <WeekText color={successGreen}> 10 </WeekText>, <WeekText color={successGreen}> 10 </WeekText>, <WeekText color={successGreen}> 10 </WeekText>, <WeekText color={successGreen}> 10 </WeekText>, <WeekText color={successGreen}> 10 </WeekText>, <WeekText color={successGreen}> 10 </WeekText> ),
      createData(<BlueUpdateKpiIcon icon={"Update_KPI_New"} size={16}/> , "example", <StatusContainer> <StatusBadge fontSize={"12px"} background={fadedYellow} color={poppySunrise}> 60% </StatusBadge> </StatusContainer>, <StatusContainer> <StatusBadge fontSize={"12px"} background={fadedYellow} color={poppySunrise}> Needs Attention </StatusBadge> </StatusContainer>, "ownedby", <WeekText color={successGreen}> 10 </WeekText>, <WeekText color={successGreen}> 10 </WeekText>, <WeekText color={successGreen}> 10 </WeekText>, <WeekText color={successGreen}> 10 </WeekText>, <WeekText color={successGreen}> 10 </WeekText>, <WeekText color={successGreen}> 10 </WeekText>, <WeekText color={successGreen}> 10 </WeekText>, <WeekText color={successGreen}> 10 </WeekText>, <WeekText color={successGreen}> 10 </WeekText>, <WeekText color={successGreen}> 10 </WeekText>, <WeekText color={successGreen}> 10 </WeekText>, <WeekText color={successGreen}> 10 </WeekText>, <WeekText color={successGreen}> 10 </WeekText> ),
    ];
    <WeekText color={successGreen}> 10 </WeekText>
    function BasicTable() {
      return (
        <Container>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell align="right">KPIs</TableCell>
                <TableCell align="right">Score</TableCell>
                <TableCell align="right">Status</TableCell>
                <TableCell align="right">Owner</TableCell>
                <TableCell align="right">WK</TableCell>
                <TableCell align="right">WK</TableCell>
                <TableCell align="right">WK</TableCell>
                <TableCell align="right">WK</TableCell>
                <TableCell align="right">WK</TableCell>
                <TableCell align="right">WK</TableCell>
                <TableCell align="right">WK</TableCell>
                <TableCell align="right">WK</TableCell>
                <TableCell align="right">WK</TableCell>
                <TableCell align="right">WK</TableCell>
                <TableCell align="right">WK</TableCell>
                <TableCell align="right">WK</TableCell>
                <TableCell align="right">WK</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow>
                  <TableCell component="th" scope="row">{row.update}</TableCell>
                  <TableCell align="right">{row.kpi}</TableCell>
                  <TableCell align="right">{row.score}</TableCell>
                  <TableCell align="right">{row.status}</TableCell>
                  <TableCell align="right">{row.owner}</TableCell>
                  <TableCell align="right">{row.wk1}</TableCell>
                  <TableCell align="right">{row.wk2}</TableCell>
                  <TableCell align="right">{row.wk3}</TableCell>
                  <TableCell align="right">{row.wk4}</TableCell>
                  <TableCell align="right">{row.wk5}</TableCell>
                  <TableCell align="right">{row.wk6}</TableCell>
                  <TableCell align="right">{row.wk7}</TableCell>
                  <TableCell align="right">{row.wk8}</TableCell>
                  <TableCell align="right">{row.wk9}</TableCell>
                  <TableCell align="right">{row.wk10}</TableCell>
                  <TableCell align="right">{row.wk11}</TableCell>
                  <TableCell align="right">{row.wk12}</TableCell>
                  <TableCell align="right">{row.wk13}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        </Container>
      );
    }

    return (<div>{BasicTable()}</div>);
  }
);

const Container = styled.div`
  width: 100%;
  font-family: Lato;
  z-index: -100;
  //border: 1px solid black;
`;

// const TableContainer = styled.div`
//   width: 100%;
//   font-family: Lato;
//   //border: 1px solid black;
// `;

// const TopRow = styled.div`
//   width: 100%;
//   display: flex;
//   justify-content: space-between;
//   margin-bottom: 16px;
//   //border: 1px solid black;
// `;

// const TabContainer = styled.div`
//   display: flex;
//   visibility: hidden;
//   //border: 1px solid black;
// `;

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
  //border: 1px solid black;
  ${props =>
    props.active &&
    `border-bottom: 2px solid ${props.theme.colors.primary80};
		opacity: 1;`}
`;

// const Table = styled.table`
//   border-collapse: collapse;
//   display: -webkit-box;
//   padding-bottom: 16px;
//   font-size: 12px;
//   overflow-x: auto;
//   width: 100%;
//   //border: 1px solid black;
// `;

// const TableHead = styled.thead`
//   width: 100%;
// `;

// const TableBody = styled.tbody`
//   width: 100%;
// `;

// const TableHeader = styled.th`
//   border: 1px solid ${props => props.theme.colors.borderGrey};
//   padding: 16px 8px;
// `;

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

// const TableRow = styled.tr<TableRowProps>`
//   width: 100%;
//   height: 48px;
//   ${props =>
//     props.hover &&
//     `&:hover {
// 		background: ${props.theme.colors.backgroundBlue};
// 		${KPITitle} {
// 			font-weight: 800;
// 			text-decoration: underline;
// 		}
// 	}`}
// `;

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
  margin: auto;
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
