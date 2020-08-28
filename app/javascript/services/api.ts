import { create, ApisauceInstance } from "apisauce";
import { camelizeResponse, decamelizeRequest } from "../utils";

export class Api {
  client: ApisauceInstance;
  token: string;

  constructor() {
    this.client = create({
      baseURL: "/api",
      headers: {
        "Cache-Control": "no-cache",
        "Content-Type": "application/json",
      },
      timeout: 30000,
      withCredentials: true, //allow cookies to be sent if its from same domain
    });

    this.client.addResponseTransform(response => {
      response.data = camelizeResponse(response.data);
    });

    this.client.addRequestTransform(request => {
      request.params = decamelizeRequest(request.params);
    });
  }

  addMonitor(monitor) {
    this.client.addMonitor(monitor);
  }

  async getUsers() {
    return this.client.get("/users");
  }

  async getIssues() {
    return this.client.get("/issues");
  }

  async getKeyActivities() {
    return this.client.get("/key_activities");
  }

  async login(email, password) {
    return this.client.post("/users/sign_in", { user: { email, password } });
  }

  async profile() {
    return this.client.get("/profile");
  }

  async updateProfile(formData) {
    return this.client.patch(`/users/${formData.id}`, formData);
  }

  async updateAvatar(formData) {
    return this.client.patch("/avatar", formData);
  }

  async deleteAvatar() {
    return this.client.delete("/avatar");
  }

  async getCompany(companyId) {
    return this.client.get(`/companies/${companyId}`);
  }

  async updateCompany(formData) {
    return this.client.patch(`/companies/${formData.id}`, formData);
  }

  async updateCompanyLogo(companyId, formData) {
    return this.client.patch(`/companies/${companyId}/logo`, formData);
  }

  async deleteLogo(companyId) {
    return this.client.delete(`/companies/${companyId}/logo`);
  }

  async inviteUser(formData) {
    return this.client.post(`/users`, formData);
  }

  async resendInvitation(userId) {
    return this.client.patch(`/users/${userId}/resend_invitation`);
  }

  async signOut() {
    return this.client.delete("/users/sign_out");
  }

  async createIssue(issueObject) {
    return this.client.post("/issues", issueObject);
  }

  async updateIssueStatus(issue, value, fromTeamMeeting) {
    return this.client.patch(`/issues/${issue.id}`, { completed: value, fromTeamMeeting });
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

  async createKeyActivity(keyActivityObject) {
    return this.client.post("/key_activities", keyActivityObject);
  }

  async updateKeyActivityStatus(keyActivity, value, fromTeamMeeting) {
    return this.client.patch(`/key_activities/${keyActivity.id}`, {
      completed: value,
      fromTeamMeeting,
    });
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

  async getAllGoals() {
    return this.client.get("/goals");
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

  async createAnnualInitiative(annualInitiativeObject) {
    return this.client.post(`/annual_initiatives`, annualInitiativeObject);
  }

  async deleteAnnualInitiative(id) {
    return this.client.delete(`/annual_initiatives/${id}`);
  }

  async createAnnualInitiativeKeyElement(id) {
    return this.client.post(`/annual_initiatives/create_key_element/${id}`);
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

  async createQuarterlyGoalKeyElement(id) {
    return this.client.post(`/quarterly_goals/create_key_element/${id}`);
  }

  async deleteQuarterlyGoal(id) {
    return this.client.delete(`/quarterly_goals/${id}`);
  }

  async getHabits() {
    return this.client.get("/habits");
  }

  async createHabit(habitData) {
    return this.client.post("/habits", habitData);
  }

  async getHabit(id) {
    return this.client.get(`/habits/${id}`);
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

  async createMilestones(quarterlyGoalId) {
    return this.client.post(`/quarterly_goals/create_milestones/${quarterlyGoalId}`);
  }

  async updateHabitLog(habitId: number, logDate: string) {
    return this.client.put(`/habits/${habitId}/habit_logs/${logDate}`);
  }

  async getQuestionnaires() {
    return this.client.get(`/questionnaires`);
  }

  async createQuestionnaireAttempt(questionnaireId, questionnaireAttemptData) {
    const questionnaireAttemptObject = {
      questionnaire_id: questionnaireId,
      answers: questionnaireAttemptData.values,
      rendered_steps: questionnaireAttemptData.renderedSteps,
      steps: questionnaireAttemptData.steps,
    };
    return this.client.post(`/questionnaire_attempts`, questionnaireAttemptObject);
  }

  async getTeams() {
    return this.client.get(`/teams`);
  }

  async getTeam(id) {
    return this.client.get(`/teams/${id}`);
  }

  async getMeetingTemplates() {
    return this.client.get(`/meeting_templates`);
  }

  async getMeetings() {
    return this.client.get(`/meetings`);
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

  async updateMeeting(meeting) {
    return this.client.patch(`/meetings/${meeting.id}`, meeting);
  }

  async deleteMeeting(id) {
    return this.client.delete(`/meetings/${id}`);
  }

  async getNotifications() {
    return this.client.get(`/notifications`);
  }

  async updateNotification(notification) {
    return this.client.put(`/notifications/${notification.id}`, {
      notification: notification,
    });
  }

  async getTeamGoals(teamId) {
    return this.client.get(`/annual_initiatives/team/${teamId}`);
  }
  //async setJWT(jwt) {}
}
