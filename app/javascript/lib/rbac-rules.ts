import { RoleAdministrator, RoleRegularUser } from "~/lib/constants";
// Reference: https://auth0.com/blog/role-based-access-control-rbac-and-react-apps/#Role-Based-Access-Control-Example-in-React-Apps

export const rules = {
  [RoleAdministrator]: {
    static: ["timesheet:advanced-search"],
    dynamic: [],
  },
  [RoleRegularUser]: {
    static: [],
    dynamic: [],
  },
};
