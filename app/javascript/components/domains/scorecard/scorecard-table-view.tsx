import React, { useState, useMemo } from "react"
import * as R from "ramda"
import styled from "styled-components"
import { useMst } from "../../../setup/root"
import { useTranslation } from "react-i18next";
import { useTable } from "react-table"
import Select from "./scorecard-select"
import { Icon } from "~/components/shared/icon";
import { Button } from "~/components/shared/button";
import { TextDiv } from "~/components/shared/text";
import { baseTheme } from "~/themes/base"

export const ScorecardTableView = (

): JSX.Element => {
	const { t } = useTranslation();
	const { companyStore: { company } } = useMst();
	console.log(company)
	const [quarter, setQuarter] = useState<number>(company.currentFiscalQuarter)
	const [tab, setTab] = useState<string>("KPIs")
	const tabs = [
		t("scorecards.tabs.kpis"),
		t("scorecards.tabs.people"),
	]

	const {
		fadedYellow,
		poppySunrise,
		cautionYellow,
	} = baseTheme.colors
	const data = useMemo(
		() => [
			{
				title: {
					description: "Booked Work > $5000",
					logic: "Greater than or equal to $5000",
					highlighted: false,
				},
				owner: {
					id: 3,
					name: "Christopher Pang"
				},
				status: {
					text: "Needs Attention",
					color: poppySunrise,
					background: fadedYellow,
				},
				wk_14: {
					score: 4800,
					color: cautionYellow,
				}
			}
		],
		[]
	)
	const columns = useMemo(
		() => [
			{
				Header: () => (
					<div style={{ textAlign: "left" }}>KPIs</div>
				),
				accessor: "title",
				Cell: ({ value }) => {
					return (
						<KPITitleContainer>
							<KPITextContainer>
								<KPIDescription>
									{value.description}
								</KPIDescription>
								<KPILogic>
									{value.logic}
								</KPILogic>
							</KPITextContainer>
							<IconsContainer>
								<HighlightContainer>
									<HighlightIcon on={value.highlighted} />
								</HighlightContainer>
							</IconsContainer>
						</KPITitleContainer>);
				},
				width: "21%",
				minWidth: "216px",
			},
			{
				Header: "Owner",
				accessor: "owner",
				Cell: ({ value }) => {
					return (<OwnerContainer>{value.name}</OwnerContainer>);
				},
				width: "15%",
				minWidth: "160px",
			},
			{
				Header: "Status",
				accessor: "status",
				Cell: ({ value }) => {
					return (
						<StatusContainer>
							<StatusBadge color={value.color} background={value.background}>
								{value.text}
							</StatusBadge>
						</StatusContainer>
					);
				},
				width: "8%",
				minWidth: "86px",
			},
			...R.range(1, 53).map(n => ({
				Header: `WK ${n}`,
				accessor: `wk_${n}`,
				Cell: ({ value }) => {
					// return (<WeekText color={value.color} background={value.background}>{value.score}</WeekText>);
					if (value === undefined) {
						return (<EmptyWeekContainer><EmptyWeek/></EmptyWeekContainer>);
					}
					return (
						<WeekContainer>
							<WeekText color={value.color}>{value.score}</WeekText>
						</WeekContainer>
					);
				},
				width: "6%",
				minWidth: "64px",
			}))
		],
		[]
	)

	const getHiddenColumns = (q: number) => R.range(1, 53).filter(n => Math.floor((n - 1) / 13) != q - 1).map(n => `wk_${n}`);

	const initialState = {
		hiddenColumns: getHiddenColumns(quarter),
	}

	const tableInstance = useTable({ columns, data, initialState })

	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		rows,
		prepareRow,
		setHiddenColumns,
	} = tableInstance

	const handleQuarterSelect = (q) => {
		setQuarter(q)
		setHiddenColumns(getHiddenColumns(q))
	}

	return (
		<Container>
			<TopRow>
				<TabContainer>
					{tabs.map(elem => (
						<Tab
							key={elem}
							active={tab === elem}
							onClick={() => setTab(elem)}
						>
							{elem}
						</Tab>
					))}
				</TabContainer>
				<Select
					selection={quarter}
					setSelection={handleQuarterSelect}
					id={"scorecard-quarter-selection"}
				>
					{R.range(1, 5).map((n: number) => (<option value={n}>Q{n} {company.currentFiscalYear}</option>))}
				</Select>
			</TopRow>
			{tab == "KPIs" && (
				<>
					<Table {...getTableProps()}>
						<TableHead>
							{headerGroups.map(headerGroup => (
								<TableRow {...headerGroup.getHeaderGroupProps()}>
									{headerGroup.headers.map(column => (
										<TableHeader {...column.getHeaderProps({ style: { width: column.width, minWidth: column.minWidth } })}>
											{column.render('Header')}
										</TableHeader>
									))}
								</TableRow>
							))}
						</TableHead>
						<TableBody {...getTableBodyProps()}>
							{rows.map(row => {
								prepareRow(row)
								return (
									<TableRow {...row.getRowProps()}>
										{row.cells.map(cell => {
											return (
												<td {...cell.getCellProps()}>
													{cell.render('Cell', cell.getCellProps())}
												</td>
											)
										})}
									</TableRow>
								)
							})}
						</TableBody>
					</Table>
					<StyledButton
						small
						variant={"grey"}
						onClick={() => { }}
						width={"fill"}
					>
						<CircularIcon icon={"Plus"} size={"12px"} />
						<AddGoalText>Add KPI</AddGoalText>
					</StyledButton>
				</>
			)}
		</Container>
	)
}

const Container = styled.div`
	width: 100%;
	font-family: Lato;
`

const TopRow = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-between;
	margin-bottom: 16px;
`

const TabContainer = styled.div`
	display: flex;
`

type TabProps = {
	active: boolean;
}

const Tab = styled.button<TabProps>`
	font-size: 16px;
	font-weight: bold;
	background-color: ${props => props.theme.colors.white};
	padding: 4px 16px;
	cursor: pointer;
	color: ${props => props.theme.colors.black};
	border: 0;
	outline: 0;
	opacity: 0.6;
  ${props => props.active &&
		`border-bottom: 2px solid ${props.theme.colors.primary80};
		opacity: 1;`}
`

const Table = styled.table`
	border-collapse: collapse;
	display: -webkit-box;
	padding-bottom: 16px;
	font-size: 12px;
	overflow-x: auto;
	width: 100%;
`

const TableHead = styled.thead`
`

const TableBody = styled.tbody`
`

const TableHeader = styled.th`
	border: 1px solid ${props => props.theme.colors.borderGrey};
	padding: 16px 8px;
`

const KPIDescription = styled.div`
	display: block;
	font-size: 12px;
	margin-bottom: 4px;
	font-weight: 600;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`

const TableRow = styled.tr`
	&:hover {
		background: ${props => props.theme.colors.backgroundGrey};
		${KPIDescription} {
			font-weight: 800;
			text-decoration: underline;
		}
	}
`

type StyledButtonType = {
	width?: string;
};
const StyledButton = styled(Button) <StyledButtonType>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${props => (props.width != "fill" ? props.width : "-webkit-fill-available")};
  padding-left: 0;
  padding-right: 0;
  background-color: ${props => props.theme.colors.white};
  border-color: ${props => props.theme.colors.white};
  &: hover {
     color: ${props => props.theme.colors.primary100};
  }
`;
const CircularIcon = styled(Icon)`
 box-shadow: 2px 2px 6px 0.5px rgb(0 0 0 / 20%);
 color:  ${props => props.theme.colors.white};
 border-radius: 50%;
 height: 25px;
 width: 25px;
 background-color: ${props => props.theme.colors.primary100};
   &: hover {
    background-color: ${props => props.theme.colors.primaryActive};
  }
`
const AddGoalText = styled(TextDiv)`
  margin-left: 10px;
  white-space: break-spaces;
  color: ${props => props.theme.colors.primary100};
  font-size: 12px;
`;

const KPITitleContainer = styled.div`
	display: flex;
	min-width: 216px;
	overflow: hidden;
	justify-content: space-between;
	padding: 4px 8px;
`

const KPITextContainer = styled.div`
`
const KPILogic = styled.div`
	display: block;
	font-size: 9px;
	color: ${props => props.theme.colors.greyActive};
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`

const IconsContainer = styled.div`
	display: block;
	overflow: hidden;
`

const HighlightContainer = styled.div`
	overflow: hidden;
	position: relative;
	right: 0px;
`

const OwnerContainer = styled.div`
	min-width: 160px;
`

const StatusContainer = styled.div`
	display: flex;
	height: 100%;
	width: 100%;
	justify-content: center;
	align-items: center;
`

type StatusBadgeProps = {
	color: string;
	background: string;
}

const StatusBadge = styled.div<StatusBadgeProps>`
	display: inline-block;
	font-size: 9px;
	color: ${props => props.color};
	background: ${props => props.background};
	padding: 4px;
	border-radius: 2px;
`

const WeekContainer = styled.div`
	display: flex;
	height: 100%;
	width: 100%;
	justify-content: center;
	align-items: center;
`

const EmptyWeekContainer = styled.div`
	padding: 8px 16px;
`

const EmptyWeek = styled.div`
	background: ${props => props.theme.colors.backgroundGrey};
	height: 16px;
	width: 100%;
	border-radius: 4px;
`

type WeekTextProps = {
	color: string;
}

const WeekText = styled.p<WeekTextProps>`
	color: ${props => props.color};
	font-weight: bold;
`

interface IHighlightIconProps {
	on: boolean;
}

const HighlightIcon = ({
	on
}: IHighlightIconProps): JSX.Element => {
	return on ? (
		<Icon
			icon={"Star"}
			iconColor={baseTheme.colors.cautionYellow}
			size={16}
			disableFill={false}
		/>
	) : (<></>)
}
