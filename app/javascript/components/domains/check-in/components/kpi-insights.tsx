import React from "react";
import styled from "styled-components";
import { Avatar, Text } from "~/components/shared";
import { StatusBadge } from "~/components/shared/status-badge";
import { useMst } from "~/setup/root";
import { baseTheme } from "~/themes";

export const KpiInsights = () => {
  const { sessionStore } = useMst();
  return (
    <Container>
      <HeaderContainer>
        <HeaderText>KPIs</HeaderText>
      </HeaderContainer>
      <KpisContainer>
        <KpiComponent>
          <AvatarContainer>
            <Avatar
              size={32}
              marginLeft={"0px"}
              marginTop={"0px"}
              marginRight={"16px"}
              firstName={sessionStore.profile.firstName}
              lastName={sessionStore.profile.lastName}
              defaultAvatarColor={sessionStore.profile.defaultAvatarColor}
              avatarUrl={sessionStore.profile.avatarUrl}
            />
            <StyledText>{`${sessionStore.profile.firstName} ${sessionStore.profile.lastName}`}</StyledText>
          </AvatarContainer>
          <Divider />
          <DataContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeadText pb="2em" left={true} scope="col">
                    KPIs
                  </TableHeadText>
                  <TableHeadText pb="2em" scope="col">
                    Status
                  </TableHeadText>
                  <TableHeadText pb="2em" scope="col">
                    Score
                  </TableHeadText>
                  <TableHeadText pb="2em" scope="col">
                    Week 16
                  </TableHeadText>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableData left>
                    <KpiNameContainer>
                      <KpiName>Booked Work $1500</KpiName>
                      <KpiDescription>Greater than or equal to $5000</KpiDescription>
                    </KpiNameContainer>
                  </TableData>
                  <TableData>
                    <StatusBadge
                      background={baseTheme.colors.fadedYellow}
                      color={baseTheme.colors.poppySunrise}
                    >
                      Needs Attention
                    </StatusBadge>
                  </TableData>
                  <TableData>
                    <StatusBadge
                      fontSize={"12px"}
                      background={baseTheme.colors.fadedYellow}
                      color={baseTheme.colors.poppySunrise}
                    >
                      84%
                    </StatusBadge>
                  </TableData>
                  <TableData>
                    <WeekContainer>
                      <WeekText color={baseTheme.colors.successGreen}>$1500</WeekText>
                    </WeekContainer>
                  </TableData>
                </TableRow>
                <TableRow>
                  <TableData left>
                    <KpiNameContainer>
                      <KpiName>Booked Work $1500</KpiName>
                      <KpiDescription>Greater than or equal to $5000</KpiDescription>
                    </KpiNameContainer>
                  </TableData>
                  <TableData>
                    <StatusBadge
                      background={baseTheme.colors.fadedYellow}
                      color={baseTheme.colors.poppySunrise}
                    >
                      Needs Attention
                    </StatusBadge>
                  </TableData>
                  <TableData>
                    <StatusBadge
                      fontSize={"12px"}
                      background={baseTheme.colors.fadedYellow}
                      color={baseTheme.colors.poppySunrise}
                    >
                      84%
                    </StatusBadge>
                  </TableData>
                  <TableData>
                    <WeekContainer>
                      <WeekText color={baseTheme.colors.successGreen}>$1500</WeekText>
                    </WeekContainer>
                  </TableData>
                </TableRow>
              </TableBody>
            </Table>
          </DataContainer>
        </KpiComponent>
      </KpisContainer>
      <Divider />
      <InfoContainer>
        <InfoText>2 total responses</InfoText>
      </InfoContainer>
    </Container>
  );
};

const Container = styled.div`
  box-shadow: 0px 3px 6px #00000029;
  background: ${props => props.theme.colors.white};
  border-radius: 8px;
  padding: 16px 0;
  margin-bottom: 16px;
  // height: 250px;
`;

const HeaderContainer = styled.div`
  padding: 0 1em;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HeaderText = styled.span`
  color: ${props => props.theme.colors.black};
  font-size: 20px;
  font-weight: bold;
  display: inline-block;
`;

const AvatarContainer = styled.div`
  padding: 0 1em;
  display: flex;
  align-items: center;
  margin-bottom: 1em;
`;

const KpisContainer = styled.div``;

const KpiComponent = styled.div``;

const Divider = styled.div`
  border-top: 1px solid ${props => props.theme.colors.grey40};
`;

const InfoContainer = styled.div`
  display: flex;
  padding: 0 1em;
  margin-top: 0.5em;
`;

const InfoText = styled.span`
  font-size: 12px;
  color: ${props => props.theme.colors.grey40};
  margin-left: auto;
`;

const StyledText = styled(Text)`
  font-weight: bold;
  font-size: 12px;
  margin: 0;
`;

const Table = styled.table`
  table-layout: fixed;
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  margin-bottom: 24px;
`;

const TableRow = styled.tr``;

const TableBody = styled.tbody``;

type TableHeadTextProps = {
  left?: boolean;
  pb?: string;
};

const TableHeadText = styled.th<TableHeadTextProps>`
  font-size: 16px;
  text-align: ${props => (props.left ? "left" : "center")};
  padding-bottom: ${props => (props.pb ? props.pb : "")};
`;

type TableDataProps = {
  left?: boolean;
};

const TableData = styled.td<TableDataProps>`
  text-align: ${props => (props.left ? "left" : "center")};
  padding-bottom: 1em;
`;

const DataContainer = styled.div`
  padding: 1em 2em;
`;

const KpiNameContainer = styled.div``;
const KpiName = styled(Text)`
  font-weight: bold;
  font-size: 14px;
  margin: 0;
`;

const KpiDescription = styled.span`
  font-size: 10px;
  color: ${props => props.theme.colors.grey100};
`;

const WeekContainer = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

type WeekTextProps = {
  color: string;
};

const WeekText = styled.p<WeekTextProps>`
  color: ${props => props.color};
  font-size: 14px;
`;

const RowContainer = styled.div`
  margin-bottom: 1em;
`