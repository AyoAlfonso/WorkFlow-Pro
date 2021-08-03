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
import { OwnedBy } from "./scorecard-owned-by"
import { StatusBadge } from "~/components/shared/status-badge"
import { AddKPIDropdown } from "./shared/add-kpi-dropdown"
import { ViewEditKPIModal } from "./shared/view-kpi-modal"

export const getScorePercent = (value: number, target: number, greaterThan: boolean) =>
  greaterThan ? (value / target) * 100 : (target + target - value) / target * 100;

type ScorecardTableViewProps = {
	kpis: any
}

export const ScorecardTableView = ({
	kpis
}: ScorecardTableViewProps): JSX.Element => {
	const { t } = useTranslation();
	const { companyStore: { company }, scorecardStore } = useMst();
	const [year, setYear] = useState<number>(company.currentFiscalYear)
	const [quarter, setQuarter] = useState<number>(company.currentFiscalQuarter)
	const [tab, setTab] = useState<string>("KPIs")
	const [viewEditKPIModalOpen, setViewEditKPIModalOpen] = useState(false);
	const [viewEditKPIId, setViewEditKPIID] = useState(undefined);
	const tabs = [
		t("scorecards.tabs.kpis"),
		t("scorecards.tabs.people"),
	]
	const {
		fadedYellow,
		fadedGreen,
		fadedRed,
		successGreen,
		poppySunrise,
		cautionYellow,
		warningRed,
	} = baseTheme.colors

	const formatValue = (unitType: string, value: number) => {
		switch (unitType) {
			case "percentage":
				return `${Math.round(value * 1000) / 1000}%`;
			case "currency":
				return `$${value.toFixed(2)}`
			default:
				return `${value}`;
		}
	}

	const averageScorePercent = (scores: [number], target: number, greaterThan: boolean) => {
		return Math.min(
			Math.floor(getScorePercent(
				scores.reduce((acc, score) => acc + score, 0) / scores.length,
				target,
				greaterThan
			)),
			100
		)
	}

	const getStatusValue = (percentScore) => {
		if (percentScore >= 100) {
			return {
				color: successGreen,
				background: fadedGreen,
				text: "On Track",
			}
		}
		else if (percentScore >= 90) {
			return {
				color: poppySunrise,
				background: fadedYellow,
				text: "Needs Attention",
			}
		}
		else {
			return {
				color: warningRed,
				background: fadedRed,
				text: "Behind",
			}
		}
	}

	const getScoreValue = (percentScore) => {
		if (percentScore >= 100) {
			return {
				color: successGreen,
			}
		}
		else if (percentScore >= 90) {
			return {
				color: cautionYellow,
			}
		}
		else {
			return {
				color: warningRed,
			}
		}
	}

	const getPercentScoreValue = (percentScore) => {
		if (percentScore >= 100) {
			return {
				background: successGreen,
				percent: percentScore,
			}
		}
		else if (percentScore >= 90) {
			return {
				background: cautionYellow,
				percent: percentScore,
			}
		}
		else {
			return {
				background: warningRed,
				percent: percentScore,
			}
		}
	}

	const data = useMemo(
		() => kpis.map((kpi: any, index: number) => {
			const targetText = formatValue(kpi.unitType, kpi.targetValue)
			const description = `${kpi.description} ${kpi.greaterThan ? "≥" : "≤"} ${targetText}`
			const logic = kpi.greaterThan ? `Greater than or equal to ${targetText}` : `Less than or equal to ${targetText}`
			const row: any = {
				title: {
					description,
					logic,
					id: kpi.id,
				},
				owner: kpi.ownedBy,
			}
			const weeks = Object.values(kpi.period[year])
			weeks.forEach((week: any) => {
				const percentScore = getScorePercent(week.score, kpi.targetValue, kpi.greaterThan)
				row[`wk_${week.week}`] = {
					score: formatValue(kpi.unitType, week.score),
					color: getScoreValue(percentScore).color,
				}
			})
			const percentScore = averageScorePercent(
				weeks.map((w: any) => w.score) as [number],
				kpi.targetValue,
				kpi.greaterThan
			)
			row.score = getPercentScoreValue(percentScore)
			row.status = getStatusValue(percentScore)
			return row
		}),
		[kpis]
	)
	const columns = useMemo(
		() => [
			{
				Header: "",
				id: "updateKPI",
				width: "31px",
				minWidth: "31px",
			},
			{
				Header: () => (
					<div style={{ textAlign: "left" }}>KPIs</div>
				),
				accessor: "title",
				Cell: ({ value }) => {
					return (
						<KPITitleContainer onClick={() => {
							setViewEditKPIID(value.id);
							setViewEditKPIModalOpen(true);
						}}>
							<KPITextContainer>
								<KPIDescription>
									{value.description}
								</KPIDescription>
								<KPILogic>
									{value.logic}
								</KPILogic>
							</KPITextContainer>
						</KPITitleContainer>
					);
				},
				width: "21%",
				minWidth: "216px",
			},
			{
				Header: "Score",
				accessor: "score",
				width: "8%",
				minWidth: "86px",
				Cell: ({ value }) => {
					return (
						<ScoreContainer background={value.background}>
							<Score>{`${value.percent}%`}</Score>
						</ScoreContainer>
					);
				}
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
			{
				Header: "Owner",
				accessor: "owner",
				Cell: ({ value }) => {
					return (
						<OwnerContainer>
							<OwnedBy user={value} marginLeft={"0px"} />
						</OwnerContainer>
					);
				},
				width: "17%",
				minWidth: "160px",
			},
			...R.range(1, 53).map(n => ({
				Header: `WK ${n}`,
				accessor: `wk_${n}`,
				Cell: ({ value }) => {
					// return (<WeekText color={value.color} background={value.background}>{value.score}</WeekText>);
					if (value === undefined) {
						return (<EmptyWeekContainer><EmptyWeek /></EmptyWeekContainer>);
					}
					return (
						<WeekContainer>
							<WeekText color={value.color}>{value.score}</WeekText>
						</WeekContainer>
					);
				},
				width: "1fr",
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
		<>
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
						{R.range(1, 5).map((n: number) => (<option key={n} value={n}>Q{n} {company.currentFiscalYear}</option>))}
					</Select>
				</TopRow>
				{tab == "KPIs" && (
					<TableContainer>
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
										<TableRow hover={true} {...row.getRowProps()}>
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
						<AddKPIDropdown />
					</TableContainer>
				)}
			</Container>
			{viewEditKPIId && (
			<ViewEditKPIModal
				kpiId={viewEditKPIId}
				viewEditKPIModalOpen={viewEditKPIModalOpen}
				setViewEditKPIModalOpen={setViewEditKPIModalOpen}
			/>
			)
			}
		</>
	)
}

const Container = styled.div`
	width: 100%;
	font-family: Lato;
`

const TableContainer = styled.div`
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
	width: 100%;
`

const TableBody = styled.tbody`
	width: 100%;
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

type TableRowProps = {
	hover?: boolean,
}

const TableRow = styled.tr<TableRowProps>`
	width: 100%;
	height: 48px;
	${props => props.hover && `&:hover {
		background: ${props.theme.colors.backgroundBlue};
		${KPIDescription} {
			font-weight: 800;
			text-decoration: underline;
		}
	}`}
`

const UpdateKPIContainer = styled.div`

`

const UpdateKPI = styled.div`

`

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

type ScoreContainerProps = {
	background: string,
}

const ScoreContainer = styled.div<ScoreContainerProps>`
	display: flex;
	width: 32px;
	height: 32px;
	background: ${props => props.background};
	justify-content: center;
	align-items: center;
	margin: auto;
	border-radius: 4px;
`

const Score = styled.p`
	color: ${props => props.theme.colors.white};
	font-size: 12px;
	font-weight: bold;
`

const OwnerContainer = styled.div`
	display: flex;
	height: 100%;
	width: 100%;
	justify-content: center;
	align-items: center;
`

const StatusContainer = styled.div`
	display: flex;
	height: 100%;
	width: 100%;
	justify-content: center;
	align-items: center;
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
	font-size: 12px;
`
