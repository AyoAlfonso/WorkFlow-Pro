import { RoleAdministrator, RoleCEO, RoleNormalUser } from "~/lib/constants";
// Reference: https://auth0.com/blog/role-based-access-control-rbac-and-react-apps/#Role-Based-Access-Control-Example-in-React-Apps

export const rules = {
  [RoleAdministrator]: {
    static: ["update-company-details"],
    dynamic: [],
  },
  [RoleCEO]: {
    static: ["update-company-details"],
    dynamic: [],
  },
  [RoleNormalUser]: {
    static: [],
    dynamic: [],
  },
};
