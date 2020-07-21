import * as React from "react";
import styled from "styled-components";
import Popup from "reactjs-popup";

export const PopupContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const PopupTriggerContainer = styled.div`
  :hover {
    cursor: pointer;
  }
`;

interface ISideNavChildPopupProps {
  trigger: JSX.Element;
}
export const SideNavChildPopup: React.FunctionComponent<ISideNavChildPopupProps> = ({
  children,
  trigger,
}) => (
  <Popup
    arrow={false}
    closeOnDocumentClick
    // Had errors trying to do .styled(Popup): https://github.com/yjose/reactjs-popup/issues/118#issuecomment-533941132
    contentStyle={{ borderRadius: 8, border: "none", boxShadow: "none" }}
    // defaultOpen={true}
    mouseLeaveDelay={10000}
    mouseEnterDelay={0}
    offsetY={-20}
    on={"click"}
    position={"right center"}
    trigger={<PopupTriggerContainer>{trigger}</PopupTriggerContainer>}
  >
    <PopupContainer>{children}</PopupContainer>
  </Popup>
);
