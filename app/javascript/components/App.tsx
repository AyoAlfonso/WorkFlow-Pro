import * as React from "react";
import * as R from "ramda";
import { observer } from "mobx-react";
//import { RouterModel } from "mst-react-router";
import { Route, Switch } from "react-router-dom";
import { usePageViews } from "~/components/shared/analytics";
import { ThemeProvider } from "styled-components";
import { DragDropContext } from "react-beautiful-dnd";

// stores
import { IUserStore } from "../stores/user-store";
// theme
import {} from "styled-components/cssprop";
import { baseTheme } from "../themes/base";
import { GlobalStyles } from "./global-styles";

// components
import { HomeContainer } from "./domains/home/home-container";
import { useMst } from "../setup/root";
import styled from "styled-components";
import { IIssueStore } from "../stores/issue-store";
import { LoginForm } from "./domains/user/login-form";
import { IKeyActivityStore } from "../stores/key-activity-store";
import { ModalProvider } from "styled-react-modal";
import { Toaster } from "./shared/toaster";

import { AccountabilityChart } from "./domains/company/accountability-chart";
import { StrategicPlan } from "./domains/company/strategic-plan";

import { AccountSettings } from "./domains/account/account-settings";

import { HeaderBar } from "./domains/nav/header-bar";
import { SideNav } from "./domains/nav";
import { Placeholder } from "./shared/placeholder";
import { GoalsIndex } from "./domains/goals/goals-index";
import { TeamOverview } from "./domains/meetings/team-overview";
import { Meeting } from "./domains/meetings/meeting";
import { PersonalPlanning } from "./domains/meetings/personal-planning";
import { JournalIndex } from "~/components/domains/journal/journal-index";
import { NotesIndex } from "~/components/domains/notes/notes-index";

import { Section1 } from "./domains/meetings-forum/section-1";
import { Section2 } from "./domains/meetings-forum/section-2";
import { ForumNotSetup } from "./domains/meetings-forum/not-setup";
import { ForumAgenda } from "./domains/meetings-forum/forum-agenda";
import { WizardLayout } from "./layouts/wizard-layout";
import { ForumWelcomeModal } from "./shared/forum-welcome-modal";

const Container = styled.div`
  margin-left: 136px;
  margin-right: 40px;
  margin-bottom: 50px;
  padding-top: 96px;
  height: inherit;
`;

export interface IAppProps {
  userStore?: IUserStore;
  issueStore?: IIssueStore;
  keyActivityStore?: IKeyActivityStore;
}

export const App = observer(
  (props: IAppProps): JSX.Element => {
    usePageViews();
    const { issueStore, keyActivityStore, sessionStore } = useMst();
    const loggedIn = sessionStore.loggedIn; //if logged in show switch

    const onDragEnd = result => {
      const { destination, source, draggableId } = result;

      if (!result.destination) {
        return;
      }

      let newPosition = destination.index;
      if (newPosition === source.index && destination.droppableId === source.droppableId) {
        return;
      }

      if (R.includes("keyActivity", draggableId)) {
        const keyActivityId = parseInt(R.replace("keyActivity-", "", draggableId));
        keyActivityStore.updateKeyActivityState(keyActivityId, "position", newPosition + 1);
        if (destination.droppableId === "weekly-activities") {
          keyActivityStore.startLoading("weekly-activities");
          keyActivityStore.updateKeyActivityState(keyActivityId, "weeklyList", true);
          keyActivityStore.updateKeyActivityState(keyActivityId, "todaysPriority", false);
        } else if (destination.droppableId === "master-activities") {
          keyActivityStore.startLoading("master-activities");
          keyActivityStore.updateKeyActivityState(keyActivityId, "weeklyList", false);
          keyActivityStore.updateKeyActivityState(keyActivityId, "todaysPriority", false);
        } else if (destination.droppableId === "todays-priorities") {
          keyActivityStore.startLoading("todays-priorities");
          keyActivityStore.updateKeyActivityState(keyActivityId, "weeklyList", false);
          keyActivityStore.updateKeyActivityState(keyActivityId, "todaysPriority", true);
        }
        keyActivityStore.updateKeyActivity(keyActivityId);
      } else if (R.includes("team_issue", draggableId)) {
        //something to handle team issue meeting enablement creation / deletion depnding on droppable type
        //in the create simply create it
        //in the delete simply remove it

        if (destination.droppableId == "team-parking-lot-issues") {
          const draggableIdList = draggableId.split(":");
          const teamIssueId = parseInt(R.replace("team_issue-", "", draggableIdList[0]));
          const meetingId = parseInt(R.replace("meeting_id-", "", draggableIdList[1]));

          issueStore.updateTeamIssuePosition(teamIssueId, newPosition + 1, {
            meetingId,
            meetingEnabled: false,
          });
        } else if (destination.droppableId == "team-scheduled-issues") {
          const draggableIdList = draggableId.split(":");
          const teamIssueId = parseInt(R.replace("team_issue-", "", draggableIdList[0]));
          const meetingId = parseInt(R.replace("meeting_id-", "", draggableIdList[1]));
          //meetingId is used to determine if a team issue meeting enablement is or not created
          issueStore.updateTeamIssuePosition(teamIssueId, newPosition + 1, {
            meetingId,
            meetingEnabled: true,
          });
        } else {
          //standard team issue functionality. Used in companies.
          //Technically assumes meetingEnabled is not a thing in this case.
          const teamIssueId = parseInt(R.replace("team_issue-", "", draggableId));
          issueStore.updateTeamIssuePosition(teamIssueId, newPosition + 1);
        }
      } else if (R.includes("issue", draggableId)) {
        const issueId = parseInt(R.replace("issue-", "", draggableId));
        issueStore.updateIssuePosition(issueId, newPosition + 1);
      }
    };
    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <ThemeProvider theme={baseTheme}>
          <ModalProvider>
            <GlobalStyles />
            <Toaster position="bottom-right" />
            {loggedIn ? (
              /* <SideNav />
                <HeaderBar />

                <Switch>
                  <Route
                    exact
                    path={[
                      "/",
                      "/wikis/:wikiId",
                      "/wikis/:wikiId/folders/:folderId",
                      "/wikis/:wikiId/articles/:articleId",
                      "/wikis/:wikiId/playlists",
                      "/wikis/:wikiId/playlists/:playlistId",
                    ]}
                  >
                    <MainLayout>
                      <Route exact path="/" component={WikiHomeView} />
                      <Route exact path="/wikis/:wikiId" component={WikiHomeView} />
                      <Route exact path="/wikis/:wikiId/folders/:folderId" component={FolderCardView} />
                      <Route exact path="/wikis/:wikiId/articles/:articleId" component={ArticleView} />
                      <Route exact path="/wikis/:wikiId/playlists" component={PlaylistsView} />
                      <Route
                        exact
                        path="/wikis/:wikiId/playlists/:playlistId"
                        component={PlaylistDetailsView}
                      />
                    </MainLayout>
                  </Route>

                  <Route exact path={["/wikis/:wikiId/playlists/:playlistId/articles/:articleId"]}>
                    <ReadingLayout>
                      <Route
                        exact
                        path="/wikis/:wikiId/playlists/:playlistId/articles/:articleId"
                        component={PlaylistReadingView}
                      />
                    </ReadingLayout>
                  </Route>

                  <Route exact path={["/account"]}>
                    <TopNavLayout>
                      <Route exact path="/account" component={AccountView} />
                    </TopNavLayout>
                  </Route>

                  {/* Handle all other 404 cases  */
              //   <Route>
              //     <EmptyLayout>
              //       <NotFoundView />
              //     </EmptyLayout>
              //   </Route>
              // </Switch> */}

              <Switch>
                <Route
                  exact
                  path={[
                    "/",
                    "/personal_planning/:meeting_id",
                    "/team/:team_id",
                    "/account",
                    "/company/accountability",
                    "/company/strategic_plan",
                    "/goals",
                    "/journals",
                    "/notes",
                    "/forum",
                    "/forum/:team_id",
                    "/meetings/agenda",
                    "/meetings/section_1",
                    "/meetings/section_1/:team_id",
                    "/meetings/section_2",
                    "/meetings/section_2/:team_id",
                  ]}
                >
                  <>
                    <SideNav />
                    <HeaderBar />
                    <ForumWelcomeModal />
                    <Container>
                      <Route exact path="/" component={HomeContainer} />
                      <Route
                        exact
                        path="/personal_planning/:meeting_id"
                        component={PersonalPlanning}
                      />

                      <Route exact path="/team/:team_id" component={TeamOverview} />
                      <Route exact path="/account" component={AccountSettings} />
                      <Route exact path="/company/accountability" component={AccountabilityChart} />
                      <Route exact path="/company/strategic_plan" component={StrategicPlan} />
                      <Route exact path="/goals" component={GoalsIndex} />
                      <Route exact path="/journals" component={JournalIndex} />
                      <Route exact path="/notes" component={NotesIndex} />
                      <Route exact path="/forum" component={ForumNotSetup} />
                      <Route exact path="/forum/:team_id" component={TeamOverview} />
                      <Route exact path="/meetings/agenda" component={ForumAgenda} />
                      <Route exact path="/meetings/section_1" component={Section1} />
                      <Route exact path="/meetings/section_1/:team_id" component={Section1} />
                      <Route exact path="/meetings/section_2" component={Section2} />
                      <Route exact path="/meetings/section_2/:team_id" component={Section2} />
                    </Container>
                  </>
                </Route>
                <Route exact path={["/team/:team_id/meeting/:meeting_id"]}>
                  <>
                    <Route exact path="/team/:team_id/meeting/:meeting_id" component={Meeting} />
                  </>
                </Route>
              </Switch>
            ) : (
              <Switch>
                <Route
                  exact
                  path={"/"}
                  render={() => {
                    return <LoginForm />;
                  }}
                />
                <Route
                  path={"/test_template"}
                  render={() => {
                    return (
                      <WizardLayout
                        title={"Goals"}
                        description={
                          "Goals are things you (and your company) want to achieve in the next 3-12 months."
                        }
                        showSkipButton={false}
                        leftBodyComponents={<> Left Component </>}
                        rightBodyComponents={<> Right Component </>}
                        steps={[
                          "Tell us more about yourself",
                          "Your company's Foundation Four \u2122",
                          "Create your first Goal",
                          "Add your first Pyn (todo)",
                          "Add your Team",
                        ]}
                        currentStep={1}
                      />
                    );
                  }}
                />
              </Switch>
            )}
          </ModalProvider>
        </ThemeProvider>
      </DragDropContext>
    );
  },
);
