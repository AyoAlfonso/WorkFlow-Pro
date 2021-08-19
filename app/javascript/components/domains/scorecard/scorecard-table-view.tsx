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
import { OwnedBy } from "./shared/scorecard-owned-by"
import { StatusBadge } from "~/components/shared/status-badge"
import { AddKPIDropdown } from "./shared/add-kpi-dropdown"
import { ViewEditKPIModal } from "./shared/view-kpi-modal"
import { UpdateKPIModal } from "./shared/update-kpi-modal"

// TODO: figure out better function for percent scores.
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
	const [updateKPI, setUpdateKPI] = useState(undefined);
	const [updateKPIModalOpen, setUpdateKPIModalOpen] = useState(false);
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
		warningRed,
		primary100,
		backgroundGrey,
		greyActive,
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
		const percent = Math.round(percentScore)
		if (percentScore === null) {
			return {
				color: greyActive,
				background: backgroundGrey,
				percent,
				text: "No Update",
			}
		}
		else if (percentScore >= 100) {
			return {
				color: successGreen,
				background: fadedGreen,
				percent,
				text: "On Track",
			}
		}
		else if (percentScore >= 90) {
			return {
				color: poppySunrise,
				background: fadedYellow,
				percent,
				text: "Needs Attention",
			}
		}
		else {
			return {
				color: warningRed,
				background: fadedRed,
				percent,
				text: "Behind",
			}
		}
	}

	const calcQuarterAverageScores = (weeks: any, target: number, greaterThan: boolean) => {
		let quarterScores = [
			[null, 0],
			[null, 0],
			[null, 0],
			[null, 0],
		]
		weeks.forEach(({ week, score }) => {
			const q = Math.floor(((week) - 1) / 13)
			quarterScores[q][0] += score
			quarterScores[q][1]++
		})
		return quarterScores
		.map((tuple) => 
				 tuple[0] === null ? 
				 null : getScorePercent(tuple[0] / tuple[1], target, greaterThan))
	}

	const getScoreValueColor = (percentScore: number) => {
		if (percentScore >= 100) {
			return successGreen
		}
		else {
			return warningRed
		}
	}

	const data = useMemo(
		() => kpis.map((kpi: any) => {
			const targetText = formatValue(kpi.unitType, kpi.targetValue)
			const title = `${kpi.title} ${kpi.greaterThan ? "≥" : "≤"} ${targetText}`
			const logic = kpi.greaterThan ? `Greater than or equal to ${targetText}` : `Less than or equal to ${targetText}`
			const row: any = {
				updateKPI: {
					id: kpi.id,
					ownedById: kpi.ownedById,
					unitType: kpi.unitType,
				},
				title: {
					title,
					logic,
					id: kpi.id,
				},
				owner: kpi.ownedBy,
			}
			const weeks = Object.values(kpi?.period?.[year] || {})
			weeks.forEach((week: any) => {
				const percentScore = getScorePercent(week.score, kpi.targetValue, kpi.greaterThan)
				row[`wk_${week.week}`] = {
					score: formatValue(kpi.unitType, week.score),
					color: getScoreValueColor(percentScore),
				}
			})
			const percentScores = calcQuarterAverageScores(weeks, kpi.targetValue, kpi.greaterThan)
				.map(score => getStatusValue(score))
			row.score = percentScores
			row.status = percentScores
			return row
		}),
		[kpis]
	)
	const columns = useMemo(
		() => [
			{
				Header: "",
				accessor: "updateKPI",
				width: "31px",
				minWidth: "31px",
				Cell: ({ value }) => {
					return (
						<UpdateKPIContainer onClick={() => {
							setUpdateKPI(value);
							setUpdateKPIModalOpen(true);
						}}>
							<Icon icon={"Update_KPI"} size={16} iconColor={primary100} />
						</UpdateKPIContainer>
					)
				}
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
								<KPITitle>
									{value.title}
								</KPITitle>
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
					const quarterValue = value[quarter-1]
					return (
						<ScoreContainer background={quarterValue.background}>
							<Score color={quarterValue.color}>{quarterValue.percent ? `${quarterValue.percent}%`:"..."}</Score>
						</ScoreContainer>
					);
				}
			},
			{
				Header: "Status",
				accessor: "status",
				Cell: ({ value }) => {
					const quarterValue = value[quarter-1]
					return (
						<StatusContainer>
							<StatusBadge color={quarterValue.color} background={quarterValue.background}>
								{quarterValue.text}
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
							<OwnedBy ownedBy={value} marginLeft={"0px"} disabled/>
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
		[quarter, year]
	)

	const getHiddenWeeks = (q: number) => R.range(1, 53).filter(n => Math.floor((n - 1) / 13) != q - 1).map(n => `wk_${n}`);

	const initialState = {
		hiddenColumns: getHiddenWeeks(quarter),
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
		setHiddenColumns(getHiddenWeeks(q))
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
			)}
			{updateKPI && (
				<UpdateKPIModal
					kpiId={updateKPI.id}
					ownedById={updateKPI.ownedById}
					unitType={updateKPI.unitType}
					year={company.currentFiscalYear}
					week={company.currentFiscalWeek}
					currentValue={updateKPI.currentValue}
					headerText={"Update Current Week"}
					updateKPIModalOpen={updateKPIModalOpen}
					setUpdateKPIModalOpen={setUpdateKPIModalOpen}
				/>
			)}
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

const KPITitle = styled.div`
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
		${KPITitle} {
			font-weight: 800;
			text-decoration: underline;
		}
	}`}
`

const UpdateKPIContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	width: 48px;
	height: 48px;

	&:hover {
		cursor: pointer;
	}
`

const KPITitleContainer = styled.div`
	display: flex;
	min-width: 216px;
	overflow: hidden;
	justify-content: space-between;
	padding: 4px 8px;

	&:hover {
		cursor: pointer;
	}
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

type ScoreProps = {
	color: string,
}

const Score = styled.p<ScoreProps>`
	color: ${props => props.color};
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
