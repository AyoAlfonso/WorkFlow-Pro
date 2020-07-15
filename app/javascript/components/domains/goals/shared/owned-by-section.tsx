import * as React from "react";
import styled from "styled-components";
import { Text } from "../../../shared/text";
import { UserDefaultIcon } from "~/components/shared/user-default-icon";
import { UserType } from "~/types/user";

interface IOwnedBySectionProps {
  ownedBy: UserType;
}

export const OwnedBySection = ({ ownedBy }: IOwnedBySectionProps): JSX.Element => {
  return (
    <Container>
      <OwnedBySubHeaderContainer>
        <SubHeaderText> Owned By</SubHeaderText>
      </OwnedBySubHeaderContainer>
      <UserDefaultIcon
        firstName={ownedBy.firstName}
        lastName={ownedBy.lastName}
        size={45}
        marginLeft={"0px"}
      />
    </Container>
  );
};

const Container = styled.div`
  width: 10%;
  margin-left: 50px;
`;

const SubHeaderText = styled(Text)`
  font-size: 16px;
  font-weight: bold;
`;

const SubHeaderContainer = styled.div`
  display: flex;
`;

const OwnedBySubHeaderContainer = styled(SubHeaderContainer)`
  margin-bottom: 20px;
`;
