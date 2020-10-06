import * as React from "react";
import styled from "styled-components";
import { useState, useRef } from "react";
import { observer } from "mobx-react";
import { CreateKeyActivityModal } from "../../key-activities/create-key-activity-modal";
import { useMst } from "~/setup/root";
import { Icon } from "~/components/shared";
import { color } from "styled-system";
import { KeyActivityEntry } from "../../key-activities/key-activity-entry";
import { baseTheme } from "~/themes";
import { useTranslation } from "react-i18next";
import ContentEditable from "react-contenteditable";

export const Notes = (props: {}): JSX.Element => {
  const notesRef = useRef(null);
  const [notesContent, setNotesContent] = useState<string>("");

  return (
    <StyledContentEditable
      innerRef={notesRef}
      html={notesContent}
      onChange={e => {
        setNotesContent(e.target.value);
      }}
      onBlur={() => console.log("on blur save")}
    />
  );
};

const StyledContentEditable = styled(ContentEditable)`
  font-weight: bold;
  font-size: 20px;
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 4px;
  padding-right: 4px;
  margin-right: -4px;
  height: 150px;
`;
