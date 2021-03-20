import styled from "styled-components";

export const MonthContainer = styled.div`
  width: 315px;
  margin-top: auto;
  margin-bottom: auto;
`;

export const ColumnContainer = styled.div`
  width: 50%;
  min-width: 240px;
  margin-right: 16px;
`;

export const ColumnContainerCenterAligned = styled(ColumnContainer)`
  margin-top: auto;
  margin-bottom: auto;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  margin-top: 16px;
  height: 100px;
`;

export const Divider = styled.div`
  height: 1px;
  width: 100%;
  background-color: lightgrey;
`;
