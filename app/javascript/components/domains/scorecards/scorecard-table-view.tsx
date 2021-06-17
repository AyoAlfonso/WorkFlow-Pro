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

export const ScorecardTableView = (

): JSX.Element => {
	const { t } = useTranslation();
	const { companyStore: { company } } = useMst();
	const [quarter, setQuarter] = useState<number>(company.currentFiscalQuarter)
	const [tab, setTab] = useState<string>("KPIs")
	const tabs = [
		t("scorecards.tabs.kpis"),
		t("scorecards.tabs.people"),
	]

	// TODO: convert the data from the KPI store into passable data for the table.
	const data = useMemo(
		() => [
			{
				title: {
					item: "Booked Work",
					logic: "< $5000",
					highlighted: true,
				},
				owner: {
					id: 3,
					name: "Christopher Pang"
				},
				status: "Needs Attention",
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
					return (<KPITitleContainer>{`${value.item} ${value.logic}`}</KPITitleContainer>);
				},
				width: "21%",
			},
			{
				Header: "Owner",
				accessor: "owner",
				Cell: ({ value }) => {
					return (<OwnerContainer>{value.name}</OwnerContainer>);
				},
				width: "15%",
			},
			{
				Header: "Status",
				accessor: "status",
				Cell: ({ value }) => {
					return (<StatusContainer>{value}</StatusContainer>);
				},
				width: "8%",
			},
			...R.range(1, 53).map(n => ({
				Header: `WK ${n}`,
				accessor: `wk_${n}`,
				Cell: ({ value }) => {
					return (<WeekContainer>{value}</WeekContainer>);
				},
				width: "6%",
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
			{/*<Table {...getTableProps()}>
				<TableHead>
				{headerGroups.map(headerGroup => (
					<TableRow {...headerGroup.getHeaderGroupProps()}>
					{headerGroup.headers.map(column => (
						<TableHeader {...column.getHeaderProps()}>
						{column.render("Header")}
						</TableHeader>
					))}
					</TableRow>
				))}
				</TableHead>
				<TableBody>
				</TableBody>
				</Table>*/}
			<Table {...getTableProps()}>
				<thead>
					{headerGroups.map(headerGroup => (
						<tr {...headerGroup.getHeaderGroupProps()}>
							{headerGroup.headers.map(column => (
								<TableHeader {...column.getHeaderProps({ style: { width: column.width } })}>
									{column.render('Header')}
								</TableHeader>
							))}
						</tr>
					))}
				</thead>
				<tbody {...getTableBodyProps()}>
					{rows.map(row => {
						prepareRow(row)
						return (
							<tr {...row.getRowProps()}>
								{row.cells.map(cell => {
									return (
										<td {...cell.getCellProps()}>
											{cell.render('Cell', cell.getCellProps())}
										</td>
									)
								})}
							</tr>
						)
					})}
				</tbody>
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
	background: white;
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
	overflow-x: scroll;
	width: 100%;
	td {
		padding: 8px 8px;
	}
`

const TableHead = styled.thead`
`

const TableBody = styled.tbody``

const TableHeader = styled.th`
	border: 1px solid ${props => props.theme.colors.borderGrey};
	padding: 16px 8px;
`

const TableRow = styled.tr``

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
	min-width: 216px;
`

const OwnerContainer = styled.div`
	min-width: 160px;
`

const StatusContainer = styled.div`
	min-width: 86px;
`

const WeekContainer = styled.div`
	min-width: 64px;
`
