import React from "react";
import styled from "styled-components";
import Popup from "reactjs-popup";
import "~/stylesheets/modules/reactjs-popup.css";
import { CSSProperties } from "react";
// import { SideNavDrawer } from "./side-nav-drawer";

export const PopupContainer = styled.div`
  background-color: ${props => props.theme.colors.primary100};
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  margin-left: -10px;
  padding-top: 8px;
  padding-bottom: 8px;
  width: 256px;
  transition: 0.3s;
  box-shadow: 0px 3px 6px #00000029;
`;

export const PopupTriggerContainer = styled.div`
  margin: 0px;
  padding: 0px;
  :hover {
    cursor: pointer;
  }
`;

const popupStyle: CSSProperties = {
  border: "none",
  boxShadow: "none",
};

interface ISideNavChildPopupProps {
  trigger: JSX.Element;
  navOpen: boolean;
  setNavOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setOtherNavOpen: Array<React.Dispatch<React.SetStateAction<boolean>>>;
  children?: React.ReactNode;
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
    <>
      <Popup
        arrow={false}
        closeOnDocumentClick
        // Had errors trying to do .styled(Popup): https://github.com/yjose/reactjs-popup/issues/118#issuecomment-533941132
        contentStyle={popupStyle}
        mouseLeaveDelay={300}
        mouseEnterDelay={0}
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
    </>
  );
};
