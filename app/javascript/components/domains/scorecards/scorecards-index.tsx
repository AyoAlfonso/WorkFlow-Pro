import React, { useState, useEffect } from "react"
import styled from "styled-components";
import { useMst } from "../../../setup/root"
import { Loading } from "../../shared/loading"
import { observer } from "mobx-react"

export const ScorecardsIndex = observer(
	(): JSX.Element => {
		const { companyStore, sessionStore } = useMst();

		const [loading, setLoading] = useState<boolean>(true);

		useEffect(() => {
			// TODO: Loading logic for scorecards store
		});

		return (
			<Container>
				<h2>Scorecards</h2>
			</Container>
		)
	}
)

const Container = styled.div``;
