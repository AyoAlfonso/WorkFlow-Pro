import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { observer } from "mobx-react";
import { Icon } from "~/components/shared";
interface IKPIModalHeader {
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  KPIs: any[];
  kpiModalType: string;
}

export const KPIModalHeader = observer(
  (props): JSX.Element => {
    const [KPIs, setKPIs] = useState(props.KPIs);
    const [selectedTagInputCount, setSelectedTagInputCount] = useState(0);

    const removeTagInput = id => {
      setKPIs(KPIs.filter(kpi => kpi.id != id));
    };

    useEffect(() => {
      setKPIs(props.KPIs);
      setSelectedTagInputCount(props.KPIs.length - 3);
    }, [props.KPIs]);

    const renderTaggedInput = (): Array<JSX.Element> => {
      return KPIs.map((kpi, key)=> {
        return (
          <TagInput id={key} key={key}>
            {kpi.name}
            <TagInputClose onClick={() => removeTagInput(kpi.id)}> x </TagInputClose>
          </TagInput>
        );
      });
    };
    return (
      <HeaderContainer>
        <SubHeaderContainer>
          <StyledSubHeader>{props.kpiModalType}</StyledSubHeader>
        </SubHeaderContainer>
        <SelectionBox>
          <MultiTagInputContainer>
            {/* {renderTaggedInput()} */}
            <TagInput>
              MG - Deals closed
              <TagInputClose>x</TagInputClose>
            </TagInput>

            <TagInput>
              SA - Deals closed
              <TagInputClose>x</TagInputClose>
            </TagInput>
            {selectedTagInputCount > 0 ? (
              <SelectedTagInputCount> {selectedTagInputCount}+ </SelectedTagInputCount>
            ) : (
              <> </>
            )}
          </MultiTagInputContainer>
          <StyledClose>
            <CloseIconContainer onClick={() => props.setModalOpen(false)}>
              <StyledIcon icon={"Close"} size={18} />
            </CloseIconContainer>
          </StyledClose>
        </SelectionBox>
      </HeaderContainer>
    );
  },
);

const StyledIcon = styled(Icon)`
  color: ${props => props.theme.colors.grey60};
`;

const StyledSubHeader = styled.h3`
  color: #000;
`;

const CloseIconContainer = styled.span`
  &:hover ${StyledIcon} {
    color: ${props => props.theme.colors.greyActive};
  }
`;

const SelectionBox = styled.div`
  background-color: #ffffff;
  display: grid;
  grid-template-columns: 11fr 1fr;
  height: 100%;
  align-items: center;
  padding: 0rem 1.2rem;
  border-top-right-radius: 10px;

  @media only screen and (min-width: 280px) and (max-width: 767px) {
    padding: 0.7em 0.3rem;
    width: 100%;
  }
`;

const StyledClose = styled.div`
  justify-self: right;
`;

const TagInput = styled.span`
  border: 1px solid #1065f6;
  color: #1065f6;
  padding: 0.2rem 0.5rem;
  border-radius: 5px;
  font-size: 0.8rem;
  display: flex;
  height: 1.5rem;
  align-items: center;
`;

const TagInputClose = styled.span`
  font-size: 1rem;
  color: #cdd1dd;
  font-weight: 600;
  margin-left: 0.2rem;
  display: flex;
  height: 1.5rem;
  align-items: center;
`;

const SelectedTagInputCount = styled.span`
  background: #1065f6;
  color: #ffffff;
  padding: 0.2rem 0.4rem;
  border-radius: 5px;
`;

const MultiTagInputContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  height: 100%;
  align-items: center;
`;

const StyledOperation = styled.span`
  border: 1px solid #1065f6;
  color: #1065f6;
  padding: 0.2rem 0.5rem;
  border-radius: 5px;
  font-size: 0.8rem;
  display: flex;
  height: 1.5rem;
  align-items: center;
`;

const HeaderContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  border-bottom: 1px solid #ccc;

  @media only screen and (min-width: 280px) and (max-width: 767px) {
    width: 100%;
    display: flex;
    align-items: center;
  }
`;
const SubHeaderContainer = styled.div`
  background-color: #f8f8f9;
  padding: 0rem 1rem;
  border-top-left-radius: 10px;
`;
