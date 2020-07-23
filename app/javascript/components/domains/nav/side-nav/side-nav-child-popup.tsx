import React, { useState } from "react";
import styled from "styled-components";
import Popup from "reactjs-popup";
import { CSSProperties } from "react";
import { SideNavDrawer } from "./side-nav-drawer";

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
        open={drawerIsOpen}
        onClose={() => setDrawerIsOpen(false)}
        onOpen={() => setDrawerIsOpen(true)}
        position={"right center"}
        trigger={<PopupTriggerContainer>{trigger}</PopupTriggerContainer>}
      >
        <PopupContainer>
          {React.Children.map(children, child =>
            //@ts-ignore
            React.cloneElement(child, {
              onClick: () => {
                setDrawerIsOpen(false);
              },
            }),
          )}
        </PopupContainer>
      </Popup>
    </>
  );
};
