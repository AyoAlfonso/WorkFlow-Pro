import styled from "styled-components";
import { Accordion } from "~/components/shared/accordion-components";
import { Heading } from "~/components/shared";

export const StyledOverviewAccordion = styled(Accordion)`
  width: 100%;
  min-width: 224px;
  display: flex;
  flex-direction: column;
`;

export const ToolsWrapper = styled.div`
  flex-direction: column;
  width: 25%;
  margin-left: 20px;
  margin-right: 5px;
  height: 100%;
`;

export const ToolsHeader = styled(Heading)`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
  margin-bottom: 40px;
`;

export const SnapshotHeading = styled(Heading)`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
  border-bottom: 1px solid ${props => props.theme.colors.borderGrey};
`;
