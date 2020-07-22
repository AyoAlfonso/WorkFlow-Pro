import React, { useState } from "react";
import styled from "styled-components";
import Popup from "reactjs-popup";
import { CSSProperties } from "react";

export const PopupContainer = styled.div`
  background-color: white;
  display: flex;
  left: -8px;
  flex-direction: column;
  margin-left: 6px;
  overflow-x: hidden;
  position: absolute;
  width: 215px;
`;

export const PopupTriggerContainer = styled.div`
  :hover {
    cursor: pointer;
  }
`;

const popupStyle: CSSProperties = {
  borderRadius: 8,
  border: "none",
  boxShadow: "none",
};

const SideNavDrawer = styled.div`
  background-color: white;
  box-shadow: 0px 0px 1px #00000029;
  display: ${props => (props.isOpen ? "inherit" : "none")};
  left: 128px;
  height: 100%;
  position: absolute;
  width: 216px;
`;

interface ISideNavChildPopupProps {
  trigger: JSX.Element;
}
export const SideNavChildPopup: React.FunctionComponent<ISideNavChildPopupProps> = ({
  children,
  trigger,
}) => {
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);
  return (
    <>
      <SideNavDrawer isOpen={drawerIsOpen} />
      <Popup
        arrow={false}
        closeOnDocumentClick
        // Had errors trying to do .styled(Popup): https://github.com/yjose/reactjs-popup/issues/118#issuecomment-533941132
        contentStyle={popupStyle}
        // defaultOpen={true}
        mouseLeaveDelay={10000}
        mouseEnterDelay={0}
        offsetY={-50}
        on={"click"}
        onClose={() => setDrawerIsOpen(false)}
        onOpen={() => setDrawerIsOpen(true)}
        position={"right center"}
        trigger={<PopupTriggerContainer>{trigger}</PopupTriggerContainer>}
      >
        <PopupContainer>{children}</PopupContainer>
      </Popup>
    </>
  );
};
