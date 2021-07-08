import * as React from "react";
import { useMst } from "~/setup/root";
import styled from "styled-components";
import { Heading, Icon } from "~/components/shared";

export const CreateKeyElementBody = observer(
         ({ store, object, renderKeyElementsIndex, setModalOpen, editable }): JSX.Element => {
           show ? (
             <KeyElementsTabContainer>
               <KeyElementsFormHeader>
                 <TextDiv mb={"8px"} fontSize={"16px"} fontWeight={600}>
                   Add A Key Result
                 </TextDiv>
                 <KeyElementFormBackButtonContainer
                   onClick={() => {
                     setModalOpen(false);
                   }}
                 >
                   <StyledIcon
                     icon={"Close"}
                     size={"12px"}
                     style={{ marginLeft: "8px", marginTop: "8px" }}
                   />
                 </KeyElementFormBackButtonContainer>
               </KeyElementsFormHeader>
               <KeyElementContentContainer>
                 <KeyElementForm
                   onCreate={store.createKeyElement}
                   onClose={() => setModalOpen(false)}
                 />
               </KeyElementContentContainer>
             </KeyElementsTabContainer>
           ) : (
             <KeyElementsTabContainer>
               {object.keyElements.length > 0 && (
                 <KeyElementContentContainer>{renderKeyElementsIndex()}</KeyElementContentContainer>
               )}
               {editable && (
                 <ButtonContainer
                   onClick={() => {
                     setModalOpen(true);
                   }}
                 >
                   <RoundButton backgroundColor={"primary100"} size={"32px"}>
                     <Icon
                       icon={"Plus"}
                       size={"16px"}
                       iconColor={baseTheme.colors.white}
                       style={{ marginLeft: "8px", marginTop: "8px" }}
                     />
                   </RoundButton>
                   <TextDiv color={"primary100"} fontSize={"16px"} ml={"8px"}>
                     Add a Key Result
                   </TextDiv>
                 </ButtonContainer>
               )}
             </KeyElementsTabContainer>
           );
         },
       );