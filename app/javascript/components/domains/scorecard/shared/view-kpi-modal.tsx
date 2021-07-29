import React, { useState, useEffect } from "react";
import * as R from "ramda";
import styled from "styled-components";
import moment from "moment"
import { observer } from "mobx-react"
import { useTranslation } from "react-i18next";
import Modal from "styled-react-modal"
import { useMst } from "~/setup/root"
import { StatusBadge } from "~/components/shared/status-badge"
import { Loading } from "~/components/shared/loading"
import { Icon } from "~/components/shared/icon"
import { Line } from "react-chartjs-2"
import { baseTheme } from "~/themes/base"

interface ViewEditKPIModalProps {
  kpiId: number;
  setViewEditKPIModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  viewEditKPIModalOpen: boolean;
}

export const ViewEditKPIModal = observer(
  ({
    kpiId,
    setViewEditKPIModalOpen,
    viewEditKPIModalOpen,
  }: ViewEditKPIModalProps): JSX.Element => {
    const { companyStore } = useMst();
    const [data, setData] = useState(null);
    const [chartOptions, setChartOptions] = useState({});

    useEffect(() => {
    }, [kpiId])

    const {
      backgroundGrey,
      fadedRed,
      fadedYellow,
      fadedGreen,
      greyActive,
      warningRed,
      poppySunrise,
      successGreen,
    } = baseTheme.colors

    return (
      <StyledModal
        isOpen={viewEditKPIModalOpen}
        style={{ width: "60rem", maxHeight: "90%", overflow: "auto" }}
        onBackgroundClick={e => {
          setViewEditKPIModalOpen(false)
        }}
      >
        <Container>
          <Header>Placeholder</Header>
          <OwnerAndLogicContainer>
          </OwnerAndLogicContainer>
          <ValueAndUpdateContainer>
            <ValueText>45</ValueText>
            <StatusBadgeContainer>
              <StatusBadge color={poppySunrise} background={fadedYellow}>Needs Attention</StatusBadge>
            </StatusBadgeContainer>
            <UpdateProgressButton>Update Progress</UpdateProgressButton>
          </ValueAndUpdateContainer>
          <ChartContainer>
            {data && (
              <Line data={data} options={chartOptions} />
            )}
          </ChartContainer>
          <SubHeader>Description</SubHeader>
          <SubHeader>Activity</SubHeader>
        </Container>
      </StyledModal>
    )
  }
)

const Container = styled.div`
  height: fit-content;
  padding: 32px;
  width: calc(100% - 64px);
  overflow-y: auto;
  
`

const StyledModal = Modal.styled`
  width: 30rem;
  min-height: 100px;
  border-radius: 8px;
  background-color: ${props => props.theme.colors.white};
`;

const ChartContainer = styled.div`
  width: 100%;
`

const Header = styled.p`
  margin: 0px;
  margin-bottom: 9px;
  font-family: Exo, Lato, sans-serif;
  font-size: 20px;
  font-weight: bold;
`

const OwnerAndLogicContainer = styled.div`
  width: 100%;
`

const ValueAndUpdateContainer = styled.div`
  width: 100%;
  display: flex;
`

const ValueText = styled.p`
  margin: 0px;
  margin-right: 16px;
  font-size: 32px;
`

const StatusBadgeContainer = styled.div`
  margin-top: auto;
  margin-bottom: auto;
  margin-right: 16px;
  ${StatusBadge} {
    font-size: 16px;
  }
`

const UpdateProgressButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: ${props => props.theme.colors.white};
  border-radius: 4px;
  background: ${props => props.theme.colors.primary100};
  margin-top: auto;
  margin-bottom: auto;
  padding: 8px;

  &:hover {
    cursor: pointer;
  }
`

const SubHeader = styled.p`
  margin-top: 32px;
  margin-bottom: 16px;
  font-size: 12px;
  font-weight: bold;
`

const ActivityLogsContainer = styled.div`
  width: 100%;
`
