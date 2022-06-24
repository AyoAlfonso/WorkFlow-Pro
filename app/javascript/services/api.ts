import { create, ApisauceInstance } from "apisauce";
import { camelizeResponse, decamelizeRequest } from "../utils";
import * as R from "ramda";

//  `?note=${getNote(metadata)}`;
function getNote(metadata: any) {
  return metadata?.note || "";
}
interface IScorecardProps {
  ownerType: string;
  ownerId: number;
  showAll: boolean;
}
export class Api {
  client: ApisauceInstance;
  token: string;
  client2: ApisauceInstance;

  constructor() {
    const companyId = localStorage.getItem("companyId");
    this.client = create({
      baseURL: "/api",
      headers: {
        "Cache-Control": "no-cache",
        "Content-Type": "application/json",
        "Current-Company-ID": companyId == "undefined" || !companyId ? "" : companyId,
      },
      timeout: 30000,
      withCredentials: true, //allow cookies to be sent if its from same domain
    });

    this.client.axiosInstance.interceptors.request.use(
      config => {
        const token = localStorage?.getItem("Authorization") || {};
        if (!R.isEmpty(token)) {
          config.headers.Authorization = token;
        }
        return config;
      },
      error => {
        Promise.reject(error);
      },
    );

    this.client.addResponseTransform(response => {
      response.data = camelizeResponse(response.data);
    });

    this.client.addRequestTransform(request => {
      request.params = decamelizeRequest(request.params);
    });

    this.client2 = create({
      baseURL: "/",
      headers: {
        "Cache-Control": "no-cache",
        "Content-Type": "application/json",
        "Current-Company-ID": companyId == "undefined" || !companyId ? "" : companyId,
      },
      timeout: 30000,
      withCredentials: true, //allow cookies to be sent if its from same domain
    });

    this.client2.addResponseTransform(response => {
      response.data = camelizeResponse(response.data);
    });

    this.client2.addRequestTransform(request => {
      request.params = decamelizeRequest(request.params);
    });
  }

  addMonitor(monitor) {
    this.client.addMonitor(monitor);
  }

  async getUser(userId) {
    return this.client.get(`/users/${userId}`);
  }

  async getUsers() {
    return this.client.get("/users");
  }

  async logInWithProvider(provider, response) {
    // this.client.setBaseURL("/");
    return this.client2.post(`/auth/${provider}/callback`, response);
  }

  async getIssues() {
    return this.client.get("/issues");
  }

  async duplicateIssue(id, query = "") {
    return this.client.post(`/issues/duplicate/${id}${query}`, {});
  }

  async createCommentLog(log) {
    return this.client.post(`/comment_logs`, log);
  }

  async getCommentLogs(page: number, type: string, id: number) {
    return this.client.get(`/comment_logs/page/${page}?type=${type}&id=${id}&per=10`);
  }

  async deleteCommentLog(id) {
    return this.client.delete(`/comment_logs/${id}`);
  }

  async getKeyActivities(completed) {
    return this.client.get("/key_activities", { completed });
  }
  async getKeyActivity(id) {
    return this.client.get(`/key_activities/show/${id}`);
  }

  async login(email, password) {
    return this.client.post("/users/sign_in", { user: { email, password } });
  }

  async resetPassword(email) {
    return this.client.patch("/users/reset_password", { email: email });
  }

  async profile() {
    const response = await this.client.get("/profile");
    localStorage.setItem("companyId", R.path(["data", "sessionCompanyProfileId"], response));
    return response;
  }

  async updateUser(formData, metadata) {
    return this.client.patch(`/users/${formData.id}?note=${getNote(metadata)}`, formData);
  }

  async updateUserTeamLeadRole(userId, teamId, role, metadata) {
    return this.client.patch(`/update_user_team_lead_role`, { userId, teamId, role }, metadata);
  }

  async updateUserTeamManager(userId, teamId, status, metadata) {
    return this.client.patch(`/update_user_team_manager?note=${getNote(metadata)}`, {
      userId,
      teamId,
      status,
      metadata,
    });
  }

  async updateUserCompanyFirstTimeAccess(params) {
    return this.client.patch(`/update_company_first_time_access`, params);
  }

  async updateAvatar(formData, metadata) {
    return this.client.patch(`/avatar?note=${getNote(metadata)}`, formData);
  }

  async deleteAvatar(metadata) {
    return this.client.delete(`/avatar?note=${getNote(metadata)}`);
  }

  async getCompany(companyId) {
    return this.client.get(`/companies/${companyId}`);
  }

  async createCompany(formData) {
    return this.client.post(`/companies`, formData);
  }

  async updateCompany(formData, metadata) {
    return this.client.patch(`/companies/${formData.id}?note=${getNote(metadata)}`, formData);
  }

  async updateCompanyLogo(companyId, formData, metadata) {
    return this.client.patch(`/companies/${companyId}/logo?note=${getNote(metadata)}`, formData);
  }

  async deleteLogo(companyId, metadata) {
    return this.client.delete(`/companies/${companyId}/logo?note=${getNote(metadata)}`);
  }

  async getOnboardingCompany() {
    return this.client.get("/onboarding");
  }

  async getOnboardingCompanyGoals(companyId) {
    return this.client.get(`/onboarding/${companyId}/goals`);
  }

  async updateOnboardingCompanyGoals(companyId, goalData) {
    return this.client.post(`/onboarding/${companyId}/goals/`, goalData);
  }

  async getOnboardingKeyActivities(companyId) {
    return this.client.get(`/onboarding/${companyId}/key_activities`);
  }

  async updateOnboardingKeyActivities(companyId, keyActivityData) {
    return this.client.post(`/onboarding/${companyId}/key_activities`, keyActivityData);
  }

  async createOnboardingTeamAndInviteUsers(companyId, teamData) {
    return this.client.post(`/onboarding/${companyId}/team`, teamData);
  }

  async inviteUser(formData) {
    return this.client.post(`/users`, formData);
  }

  async deactivateUser(userId, metadata) {
    return this.client.delete(`/users/${userId}?note=${getNote(metadata)}`);
  }

  async resendInvitation(userId, metadata) {
    return this.client.patch(`/users/${userId}/resend_invitation?note=${getNote(metadata)}`, {});
  }

  async signOut() {
    this.client.setHeaders({
      "Current-Company-ID": "",
    });
    return this.client.delete("/users/sign_out");
  }

  async switchCompanies(id) {
    localStorage.setItem("companyId", id);
    return true;
  }

  async createIssue(issueObject) {
    return this.client.post("/issues", issueObject);
  }

  async updateIssueStatus(issue, value, fromTeamMeeting) {
    return this.client.patch(`/issues/${issue.id}`, { completed: value, fromTeamMeeting });
  }

  async upvoteIssue(id) {
    return this.client.patch(`/issues/toggle_vote/${id}`, {});
  }

  async updateIssue(issueObject) {
    return this.client.patch(`/issues/${issueObject.id}`, issueObject);
  }

  async destroyIssue(issueObject) {
    return this.client.delete(`/issues/${issueObject.id}`, issueObject);
  }

  async getIssuesForMeeting(meetingId) {
    return this.client.get(`/issues/issues_for_meeting`, {
      meetingId: meetingId,
    });
  }

  async getIssuesForTeam(teamId) {
    return this.client.get(`/issues/issues_for_team`, {
      teamId: teamId,
    });
  }

  async getTeamIssues(teamId) {
    return this.client.get(`/team_issues`, { teamId: teamId });
  }

  async getTeamIssueMeetingEnablements(meetingId) {
    return this.client.get(`/team_issue_meeting_enablements`, { meetingId });
  }

  async updateTeamIssuePosition(teamIssueId, params) {
    return this.client.patch(`/team_issues/${teamIssueId}`, params);
  }

  async resortIssues(sortParams) {
    return this.client.patch(`issues`, sortParams);
  }

  async createKeyActivity(keyActivityObject) {
    return this.client.post("/key_activities", keyActivityObject);
  }

  async updateKeyActivityStatus(keyActivity, value, fromTeamMeeting) {
    return this.client.patch(`/key_activities/${keyActivity.id}`, {
      completed: value,
      fromTeamMeeting,
    });
  }

  async updateKeyActivitiesToComplete(keyActivitiesIdsString) {
    return this.client.patch(`/key_activities/update_multiple`, {
      idsToUpdate: keyActivitiesIdsString,
      completed: true,
    });
  }

  async duplicateKeyActivity(id) {
    return this.client.post(`/key_activities/duplicate/${id}`, {});
  }

  async updateKeyActivity(keyActivityObject) {
    return this.client.patch(`/key_activities/${keyActivityObject.id}`, keyActivityObject);
  }

  async destroyKeyActivity(keyActivityObject) {
    return this.client.delete(`/key_activities/${keyActivityObject.id}`, keyActivityObject);
  }

  async getKeyActivitiesFromMeeting(meeting_id) {
    return this.client.get(`/key_activities/created_in_meeting/`, {
      meeting_id: meeting_id,
    });
  }

  async resortKeyActivities(sortParams) {
    return this.client.patch(`key_activities`, sortParams);
  }

  async getAllGoals(status: string) {
    return this.client.get(`/goals?status=${status}`);
  }

  async getObjectiveLogs(page: number, type: string, id: number) {
    return this.client.get(`/objective_logs/page/${page}?type=${type}&id=${id}&per=10`);
  }

  async getAnnualInitiative(id) {
    return this.client.get(`/annual_initiatives/${id}`);
  }

  async updateAnnualInitiative(annualInitiative) {
    const parsedAnnualInitiative = {
      ...annualInitiative,
      keyElementsAttributes: annualInitiative.keyElements,
    };

    return this.client.patch(`/annual_initiatives/${annualInitiative.id}`, parsedAnnualInitiative);
  }

  async closeAnnualInitiative(id) {
    return this.client.patch(`/annual_initiatives/close_initiative/${id}`, {});
  }

  async duplicateAnnualInitiative(id) {
    return this.client.post(`/annual_initiatives/duplicate/${id}`, {});
  }

  async createAnnualInitiative(annualInitiativeObject) {
    return this.client.post(`/annual_initiatives`, annualInitiativeObject);
  }

  async deleteAnnualInitiative(id) {
    return this.client.delete(`/annual_initiatives/${id}`);
  }

  async createAnnualInitiativeKeyElement(id, params) {
    return this.client.post(`/annual_initiatives/create_key_element/${id}`, params);
  }

  async updateAnnualInitiativeKeyElement(id, keyElementId, params) {
    return this.client.post(`/annual_initiatives/${id}/update_key_element/${keyElementId}`, params);
  }

  async deleteAnnualInitiativeKeyElement(keyElementId) {
    return this.client.delete(`/annual_initiatives/delete_key_element/${keyElementId}`);
  }

  async createInitiativeLog(objectiveLogs) {
    return this.client.post(`/objective_logs`, objectiveLogs);
  }

  async deleteInitiativeLog(id) {
    return this.client.delete(`/objective_logs/${id}`);
  }

  async getQuarterlyGoal(id) {
    return this.client.get(`/quarterly_goals/${id}`);
  }

  async updateQuarterlyGoal(quarterlyGoal) {
    const parsedQuarterlyGoal = {
      ...quarterlyGoal,
      keyElementsAttributes: quarterlyGoal.keyElements,
      milestonesAttributes: quarterlyGoal.milestones,
    };

    return this.client.patch(`/quarterly_goals/${quarterlyGoal.id}`, parsedQuarterlyGoal);
  }

  async closeQuarterlyGoal(id) {
    return this.client.patch(`/quarterly_goals/close_goal/${id}`, {});
  }

  async duplicateQuarterlyGoal(id) {
    return this.client.post(`/quarterly_goals/duplicate/${id}`, {});
  }

  async createQuarterlyGoalKeyElement(id, params) {
    return this.client.post(`/quarterly_goals/create_key_element/${id}`, params);
  }

  async updateQuarterlyGoalKeyElement(id, keyElementId, params) {
    return this.client.post(`/quarterly_goals/${id}/update_key_element/${keyElementId}`, params);
  }

  async deleteQuarterlyGoalKeyElement(keyElementId) {
    return this.client.delete(`/quarterly_goals/delete_key_element/${keyElementId}`);
  }

  async deleteQuarterlyGoal(id) {
    return this.client.delete(`/quarterly_goals/${id}`);
  }

  async getSubInitiative(id) {
    return this.client.get(`/sub_initiatives/${id}`);
  }

  async updateSubInitiative(subInitiative) {
    const parsedSubInitiative = {
      ...subInitiative,
      keyElementsAttributes: subInitiative.keyElements,
      milestonesAttributes: subInitiative.milestones,
    };

    return this.client.patch(`/sub_initiatives/${subInitiative.id}`, parsedSubInitiative);
  }

  async closeSubInitiative(id) {
    return this.client.patch(`/sub_initiatives/close_goal/${id}`, {});
  }

  async createSubInitiativeKeyElement(id, params) {
    return this.client.post(`/sub_initiatives/create_key_element/${id}`, params);
  }

  async updateSubInitiativeKeyElement(id, keyElementId, params) {
    return this.client.post(`/sub_initiatives/${id}/update_key_element/${keyElementId}`, params);
  }

  async deleteSubInitiativeKeyElement(keyElementId) {
    return this.client.delete(`/sub_initiatives/delete_key_element/${keyElementId}`);
  }

  async deleteSubInitiative(id) {
    return this.client.delete(`/sub_initiatives/${id}`);
  }

  async getHabits() {
    return this.client.get("/habits");
  }

  async getHabitsForPersonalPlanning() {
    return this.client.get("/habits/habits_for_personal_planning");
  }

  async createHabit(habitData) {
    return this.client.post("/habits", habitData);
  }

  async getHabit(id) {
    return this.client.get(`/habits/show_habit/${id}`);
  }

  async updateHabit(habitObject) {
    return this.client.patch(`/habits/${habitObject.id}`, habitObject);
  }

  async deleteHabit(id) {
    return this.client.delete(`/habits/${id}`);
  }

  async createQuarterlyGoal(quarterlyGoalObject) {
    return this.client.post(`/quarterly_goals`, quarterlyGoalObject);
  }

  async createQuarterlyGoalMilestones(quarterlyGoalId) {
    return this.client.post(`/quarterly_goals/create_milestones/${quarterlyGoalId}`, {});
  }

  async createSubInitiative(subInitiativeObject) {
    return this.client.post(`/sub_initiatives`, subInitiativeObject);
  }

  async createSubInitiativeMilestones(subInitiativeId) {
    return this.client.post(`/sub_initiatives/create_milestones/${subInitiativeId}`, {});
  }

  async updateHabitLog(habitId: number, logDate: string) {
    return this.client.put(`/habits/${habitId}/habit_logs/${logDate}`, {});
  }

  async getQuestionnaires() {
    return this.client.get(`/questionnaires`);
  }

  async getJournalEntries(dateFilterObj) {
    return this.client.get(`/journals`, dateFilterObj);
  }

  async updateJournalEntry(journalEntry) {
    return this.client.patch(`/journal_entries/${journalEntry.id}`, journalEntry);
  }

  async deleteJournalEntry(journalEntryId) {
    return this.client.delete(`/journal_entries/${journalEntryId}`);
  }

  async createQuestionnaireAttempt(questionnaireId, questionnaireAttemptData) {
    const questionnaireAttemptObject = {
      questionnaire_id: questionnaireId,
      ...questionnaireAttemptData,
    };
    return this.client.post(`/questionnaire_attempts`, questionnaireAttemptObject);
  }

  async getTeams() {
    return this.client.get(`/teams`);
  }

  async getTeam(id) {
    return this.client.get(`/teams/${id}`);
  }

  async updateTeam(teamId, teamName, users, metadata) {
    return this.client.patch(`/teams/${teamId}?note=${getNote(metadata)}`, {
      teamName,
      users,
    });
  }

  async updateTeamSettings(formData, metadata) {
    return this.client.patch(`/teams/${formData.id}?note=${getNote(metadata)}`, formData);
  }

  async deleteTeam(id, metadata) {
    return this.client.delete(`/teams/${id}?note=${getNote(metadata)}`);
  }

  async getMeetingTemplates() {
    return this.client.get(`/meeting_templates`);
  }

  async getDescriptionTemplates() {
    return this.client.get(`/description_templates`);
  }

  async updateDescriptiveTemplates(descriptionTemplates, metadata) {
    return this.client.post(
      `/description_templates/create_templates?note=${getNote(metadata)}`,
      descriptionTemplates,
    );
  }

  async updateDescriptiveTemplatesBody(formData, metadata) {
    return this.client.patch(
      `/description_templates/update_templates?note=${getNote(metadata)}`,
      formData,
    );
  }

  async deleteDescriptionTemplates(id) {
    return this.client.delete(`/description_templates/${id}`);
  }
  async getMeetings() {
    return this.client.get(`/meetings`);
  }

  async searchSection1Meetings(params = {}) {
    return this.client.get(`/meetings/search_section_1_meetings`, params);
  }

  async getTeamMeetings(id) {
    return this.client.get(`/meetings/team_meetings/${id}`);
  }

  async getMeeting(id) {
    return this.client.get(`/meetings/${id}`);
  }

  async createMeeting(meeting) {
    return this.client.post(`/meetings`, meeting);
  }

  async getNextMeetingFor(params) {
    return this.client.patch("/meetings/start_next_for", params);
  }

  async updateMeeting(meeting) {
    return this.client.patch(`/meetings/${meeting.id}`, meeting);
  }

  async deleteMeeting(id) {
    return this.client.delete(`/meetings/${id}`);
  }

  async getMeetingNotes(filterObj) {
    return this.client.get(`/notes`, filterObj);
  }

  async getMeetingRecap(teamId, meetingId) {
    return this.client.get(`/teams/${teamId}/meetings/${meetingId}/meeting_recap`);
  }

  async getNotifications() {
    return this.client.get(`/notifications`);
  }

  async updateNotification(notification, metadata) {
    return this.client.put(`/notifications/${notification.id}?note=${getNote(metadata)}`, {
      notification: notification,
    });
  }

  async updateMilestone(milestone) {
    return this.client.patch(`/milestones/${milestone.id}`, milestone);
  }

  async getMilestonesForPersonalMeeting() {
    return this.client.get(`/milestones/milestones_for_meeting`);
  }

  async getSummaryForPersonalMeeting() {
    return this.client.get(`questionnaire_attempts/questionnaire_summary`);
  }

  async getTeamGoals(teamId) {
    return this.client.get(`/annual_initiatives/team/${teamId}`);
  }

  async createForumMeetingsForYear(teamId, currentYear, forumType) {
    return this.client.post(`/forum/create_meetings_for_year/${forumType}`, {
      teamId,
      currentYear,
    });
  }

  async searchForumMeetingsByDateRange(startDate, endDate, teamId, meetingType) {
    return this.client.get(`/forum/search_meetings_by_date_range/${meetingType}`, {
      startDate,
      endDate,
      teamId,
    });
  }

  async getQuestionnaireAttemptsSummaryForReflections(questionnaireId) {
    return this.client.get(
      `questionnaire_attempts/questionnaire_summary?questionnaire_id=${questionnaireId}`,
    );
  }

  async getStaticData() {
    return this.client.get("/static_data");
  }

  async getLabels() {
    return this.client.get(`/labels`);
  }

  async createLabel(labelObject) {
    return this.client.post(`/labels`, { labelObject });
  }

  async inviteUsersToCompany(emailAddresses, teamId, metadata) {
    return this.client.post(`/invite_users_to_company?note=${getNote(metadata)}`, {
      emailAddresses,
      teamId,
    });
  }

  async createTeamAndInviteUsers(teamName, users, metadata) {
    return this.client.post(`/create_team_and_invite_users?note=${getNote(metadata)}`, {
      teamName,
      users,
    });
  }

  async getEmotionAdjectives() {
    return this.client.get(`/user_pulses/emotion_adjectives`);
  }

  async updateUserPulse(pulseObject) {
    return this.client.post(`/update_user_pulse`, pulseObject);
  }

  async getUserPulseByDate(date) {
    return this.client.get(`/user_pulse_by_date`, { date });
  }
  async getSelectedDailyLogByDate(date) {
    return this.client.get(`/daily_logs`, { date });
  }
  async getKPI(id) {
    return this.client.get(`/key_performance_indicator/${id}`);
  }

  async getKPIs() {
    return this.client.get(`/key_performance_indicator`);
  }

  async createKPI(KPI) {
    return this.client.post(`/key_performance_indicator`, KPI);
  }

  async updateKPI(KPI) {
    return this.client.patch(`/key_performance_indicator/${KPI.id}`, KPI);
  }

  async deleteKPI(id) {
    return this.client.delete(`/key_performance_indicator/${id}`);
  }
  async toggleKPIStatus(id) {
    return this.client.patch(`/key_performance_indicator/toggle_status/${id}`, {});
  }
  async openKPI(id) {
    return this.client.patch(`/key_performance_indicator/open_kpi/${id}`, {});
  }

  async createScorecardLog(scorecardLog, manualInputDate, createGoalYearNumber: number) {
    return this.client.post(
      `scorecard_logs?manual_input_date=${manualInputDate}&?year_number=${createGoalYearNumber}`,
      scorecardLog,
    );
  }

  async deleteScorecardLog(id) {
    return this.client.delete(`scorecard_logs/${id}`);
  }

  async getScorecard(props: IScorecardProps) {
    return this.client.get(
      `scorecard/${props.ownerType}/${props.ownerId}?show_all=${props.showAll}`,
    );
  }

  async getCheckInTemplates() {
    return this.client.get(`/check_in_templates`);
  }

  async getWeeklyCheckInData(userId, dueDate) {
    return this.client.get(`/weekly-check-in/${userId}/${dueDate}`);
  }

  async getWeeklyCheckinMilestones(weekOf) {
    return this.client.get(`milestones/check_in/${weekOf}`);
  }

  async getWeeklyCheckinKeyElements() {
    return this.client.get(`/key_elements/check_in`);
  }

  async updateWeeklyCheckInKeyElements(id, value) {
    return this.client.put(`/key_elements/${id}`, value);
  }

  async getAuditLogs(params) {
    return this.client.get(`/audit_logs/${params}`);
  }

  async createCheckinTemplate(checkinTemplate) {
    return this.client.post(`/check-in-templates`, checkinTemplate);
  }

  async runCheckin(id) {
    return this.client.post(`/check_in_templates/run/${id}`);
  }
  //async setJWT(jwt) {}
}
