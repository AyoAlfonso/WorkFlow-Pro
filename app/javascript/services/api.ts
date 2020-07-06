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

  async getCompany(companyId) {
    return this.client.get(`/companies/${companyId}`);
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

  async createKeyActivity(keyActivityObject) {
    return this.client.post("/key_activities", keyActivityObject);
  }

  async updateKeyActivityStatus(keyActivity, value) {
    return this.client.patch(`/key_activities/${keyActivity.id}`, {
      completed: value,
    });
  }

  async getAllGoals() {
    return this.client.get("/goals");
  }

  //async setJWT(jwt) {}
}
