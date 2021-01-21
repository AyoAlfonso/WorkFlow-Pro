import React, { useState } from "react";
import styled from "styled-components";
import Popup from "reactjs-popup";
import { CSSProperties } from "react";
import { SideNavDrawer } from "./side-nav-drawer";

export const PopupContainer = styled.div`
  background-color: white;
  display: flex;
  flex-direction: column;
  margin-left: 16px;
  overflow-x: hidden;
  position: absolute;
  width: 200px;
`;

export const PopupTriggerContainer = styled.div`
  :hover {
    cursor: pointer;
  }
`;

const Container = styled.div`
  margin: 16px;
`;

const popupStyle: CSSProperties = {
  borderRadius: 8,
  border: "none",
  boxShadow: "none",
};

interface ISideNavChildPopupProps {
  trigger: JSX.Element;
  navOpen: boolean;
  setNavOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setOtherNavOpen: Array<React.Dispatch<React.SetStateAction<boolean>>>;
}
export const SideNavChildPopup: React.FunctionComponent<ISideNavChildPopupProps> = ({
  children,
  trigger,
  navOpen,
  setNavOpen,
  setOtherNavOpen,
}) => {
  //const [drawerIsOpen, setDrawerIsOpen] = useState(false);
  return (
    <Container>
      <SideNavDrawer isOpen={navOpen} />
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
        open={navOpen}
        onClose={() => setNavOpen(false)}
        onOpen={() => {
          setNavOpen(true);
          setOtherNavOpen.forEach(setOpen => setOpen(false));
        }}
        position={"right center"}
        trigger={<PopupTriggerContainer>{trigger}</PopupTriggerContainer>}
      >
        <PopupContainer>
          {React.Children.map(children, child =>
            //@ts-ignore
            React.cloneElement(child, {
              onClick: () => {
                setNavOpen(false);
              },
            }),
          )}
        </PopupContainer>
      </Popup>
    </Container>
  );
};
