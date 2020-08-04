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
    return this.client.put(`/users/${formData.id}`, formData);
  }

  async updateAvatar(formData) {
    return this.client.put("/avatar", formData);
  }

  async deleteAvatar() {
    return this.client.delete("/avatar");
  }

  async getCompany(companyId) {
    return this.client.get(`/companies/${companyId}`);
  }

  async updateCompany(formData) {
    return this.client.put(`/companies/${formData.id}`, formData);
  }

  async deleteLogo(companyId) {
    return this.client.delete(`/companies/${companyId}/logo`);
  }

  async signOut() {
    return this.client.delete("/users/sign_out");
  }

  async createIssue(issueObject) {
    return this.client.post("/issues", issueObject);
  }

  async updateIssueStatus(issue, value) {
    return this.client.patch(`/issues/${issue.id}`, { completed: value });
  }

  async updateIssue(issueObject) {
    return this.client.patch(`/issues/${issueObject.id}`, issueObject);
  }

  async destroyIssue(id) {
    return this.client.delete(`/issues/${id}`);
  }

  async createKeyActivity(keyActivityObject) {
    return this.client.post("/key_activities", keyActivityObject);
  }

  async updateKeyActivityStatus(keyActivity, value) {
    return this.client.patch(`/key_activities/${keyActivity.id}`, {
      completed: value,
    });
  }

  async updateKeyActivity(keyActivityObject) {
    return this.client.patch(`/key_activities/${keyActivityObject.id}`, keyActivityObject);
  }

  async destroyKeyActivity(id) {
    return this.client.delete(`/key_activities/${id}`);
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

  async createQuarterlyGoal(quarterlyGoalObject) {
    return this.client.post(`/quarterly_goals`, quarterlyGoalObject);
  }

  async createMilestones(quarterlyGoalId) {
    return this.client.post(`/quarterly_goals/create_milestones/${quarterlyGoalId}`);
  }

  //async setJWT(jwt) {}
}
