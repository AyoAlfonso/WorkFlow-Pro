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

	const data = useMemo(
		() => [
			{
				title: "Example",
				owner: "Christopher Pang",
				status: "Needs Attention",
			}
		],
		[]
	)
	console.log("Score")
	const columns = useMemo(
		() => [
			{
				Header: "KPIs",
				accessor: "title",
			},
			{
				Header: "Owner",
				accessor: "owner",
			},
			{
				Header: "Status",
				accessor: "status",
			},
			...R.range(1, 13).map(n => ({
				Header: `WK ${n}`,
				accessor: `wk_${n}`
			}))
		],
		[]
	)

	const tableInstance = useTable({ columns, data })

	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		rows,
		prepareRow,
	} = tableInstance

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
					setSelection={setQuarter}
					id={"scorecard-quarter-selection"}
				>
					{R.range(1,5).map((n: number) => (<option value={n}>Q{n} {company.currentFiscalYear}</option>))}
				</Select>
			</TopRow>
			<Table {...getTableProps()}>
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
			</Table>
			<StyledButton
				small
				variant={"grey"}
				onClick={() => {}}
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

const Table = styled.table``

const TableHead = styled.thead``

const TableBody = styled.tbody``

const TableHeader = styled.th``

const TableRow = styled.tr``

type StyledButtonType = {
  width?: string;
};
const StyledButton = styled(Button)<StyledButtonType>`
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
