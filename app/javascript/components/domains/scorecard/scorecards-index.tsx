import React, { useState, useEffect } from "react"
import styled from "styled-components";
import { useMst } from "../../../setup/root"
import { Loading } from "../../shared/loading"
import { observer } from "mobx-react"
import { ScorecardTableView } from "./scorecard-table-view"

export const ScorecardsIndex = observer(
	(): JSX.Element => {
		const { companyStore, sessionStore } = useMst();

		const [loading, setLoading] = useState<boolean>(true);

		useEffect(() => {
			companyStore.load().then(() => setLoading(false))
		});

    if (loading || !companyStore.company) {
      return <Loading />;
    }

		return (
			<Container>
				<h2>Scorecards</h2>
				<ScorecardTableView />
			</Container>
		)
	}
)

const Container = styled.div``;
