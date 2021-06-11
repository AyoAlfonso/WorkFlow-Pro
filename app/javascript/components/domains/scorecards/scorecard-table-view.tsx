import React, { useState, useMemo } from "react"
import * as R from "ramda"
import styled from "styled-components"
import { useMst } from "../../../setup/root"
import Select from "./scorecard-select"

export const ScorecardTableView = (

): JSX.Element => {
	const { companyStore: { company } } = useMst();
	const [quarter, setQuarter] = useState<number>(company.currentFiscalQuarter)
	const columns = useMemo(
		() => [
			{
				Header: "KPIs",
				accessor: "",
			},
			{
				Header: "Owner",
				accessor: "",
			},
			{
				Header: "Status",
				accessor: "",
			},
			...R.range(1, 13).map(n => ({
				Header: `WK ${n}`,
				accessor: `wk_${n}`
			}))
		],
		[]
	)

	return (
		<Container>
			<Select
				selection={quarter}
				setSelection={setQuarter}
				id={"scorecard-quarter-selection"}
			>
			{R.range(1,5).map(n => (<option value={n}>Q{n} {company.currentFiscalYear}</option>))}
			</Select>
		</Container>
	)
}

const Container = styled.div`

`

const Tab = styled.button`
`
