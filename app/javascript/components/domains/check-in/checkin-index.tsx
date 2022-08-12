import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { observer } from "mobx-react";
import { useMst } from "../../../setup/root";
import Select from "../../shared/select";
import { CheckInCard } from "./components/checkin-card";
import { Loading } from "~/components/shared";
import { toJS } from "mobx";

export const CheckIn = observer(
  (): JSX.Element => {
    const [activeTab, setActiveTab] = useState("active");
    const [selection, setSelection] = useState("");
    const [loading, setLoading] = useState(true);

    const { checkInTemplateStore, teamStore, userStore } = useMst();

    const { checkIns, archivedCheckIns } = checkInTemplateStore;

    useEffect(() => {
      teamStore.fetchTeams().then(() => {
        userStore.fetchUsers().then(() => {
          checkInTemplateStore.getCheckIns().then(() => {
            checkInTemplateStore.sortArtifacts("dueDate");
            setLoading(false);
          });
        });
      });
    }, []);

    useEffect(() => {
      handleSort("dueDate");
    }, [checkIns.length]);

    const handleSort = e => {
      setSelection(e);
      checkInTemplateStore.sortArtifacts(e);
    };

    const getArchivedCheckIns = () => {
      if (archivedCheckIns) return;
      setLoading(true);
      checkInTemplateStore.getArchivedCheckIns().then(() => {
        setLoading(false);
        handleSort("archivedDate");
      });
    };

    const checkInToRender = activeTab === "active" ? checkIns : archivedCheckIns;

    return (
      <Container>
        <TopContainer>
          <OverviewTabsContainer>
            <OverviewTab
              active={activeTab === "active"}
              onClick={() => {
                setActiveTab("active");
                handleSort("dueDate");
              }}
            >
              Active
            </OverviewTab>
            <OverviewTab
              active={activeTab === "archived"}
              onClick={() => {
                setActiveTab("archived");
                getArchivedCheckIns();
              }}
            >
              Archived
            </OverviewTab>
          </OverviewTabsContainer>
          <SelectContainer>
            <Select selection={selection} setSelection={handleSort}>
              {activeTab === "active" && <option value="dueDate">Sort by due date</option>}
              {activeTab === "archived" && (
                <option value="archivedDate">Sort by archived date</option>
              )}
              <option value="name">Sort by name</option>
            </Select>
          </SelectContainer>
        </TopContainer>
        <CheckinsContainer>
          {loading ? (
            <Loading />
          ) : (
            checkInToRender.map(checkIn => (
              <CheckInCard checkin={checkIn} key={checkIn.id} activeTab={activeTab} />
            ))
          )}
        </CheckinsContainer>
      </Container>
    );
  },
);

const Container = styled.div`
  @media only screen and (max-width: 768px) {
    padding: 1em;
    flex-direction: column;
  }
`;

const SelectContainer = styled.div`
  @media only screen and (max-width: 768px) {
    align-self: flex-end;
  }
`;

const TopContainer = styled.div`
  display: flex;
  justify-content: space-between;
  @media only screen and (max-width: 768px) {
    margin-top: 2em;
  }
`;

const OverviewTabsContainer = styled.div`
  display: flex;
  flex-direction: row;
  // border-bottom: 1px solid ${props => props.theme.colors.borderGrey};
  margin-bottom: 24px;
`;

type IOverviewTab = {
  active: boolean;
};

const OverviewTab = styled("span")<IOverviewTab>`
  margin-bottom: 0;
  padding: 0 15px;
  padding-bottom: 5px;
  color: ${props => (props.active ? props.theme.colors.black : props.theme.colors.greyInactive)};
  font-size: 20px;
  font-weight: bold;
  line-height: 28px;
  text-decoration: none;
  border-bottom-width: ${props => (props.active ? `2px` : `0px`)};
  border-bottom-color: ${props => props.theme.colors.primary100};
  border-bottom-style: solid;
  cursor: pointer;
  @media only screen and (max-width: 768px) {
    margin-bottom: 1em;
  }
`;

const CheckinsContainer = styled.div`
  @media only screen and (max-width: 768px) {
    margin-top: 1em;
  }
`;
