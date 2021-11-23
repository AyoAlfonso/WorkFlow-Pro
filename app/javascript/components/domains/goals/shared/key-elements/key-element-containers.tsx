import styled from "styled-components";

export const KeyElementContentContainer = styled.div`
  padding: 16px;
  position: relative;
`;

export const KeyElementsTabContainer = styled.div`
  height: 100%;
  width: 100%;
`;

export const KeyElementsFormHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 16px;
  width: auto;
  padding-right: 16px;
  padding-top: 8px;
  height: 24px;
  border-bottom: ${({ theme: { colors } }) => `1px solid ${colors.borderGrey}`};
`;

export const KeyElementFormBackButtonContainer = styled.div`
  margin-right: 4px;
  margin-bottom: 8px;
  &:hover {
    cursor: pointer;
  }
`;
