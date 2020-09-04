import { RoleAdministrator, RoleCEO, RoleNormalUser, RoleLeadership } from "~/lib/constants";
// Reference: https://auth0.com/blog/role-based-access-control-rbac-and-react-apps/#Role-Based-Access-Control-Example-in-React-Apps

export const rules = {
  [RoleAdministrator]: {
    static: ["update-company-details", "create-user"],
    dynamic: {
      "edit-team-settings": ({ team, user }) => {
        return team.isALead(user);
      },
    },
  },
  [RoleCEO]: {
    static: ["update-company-details", "create-user"],
    dynamic: {
      "edit-team-settings": ({ team, user }) => {
        return team.isALead(user);
      },
    },
  },
  [RoleNormalUser]: {
    static: [],
    dynamic: {},
  },
  [RoleLeadership]: {
    static: [],
    dynamic: {},
  },
};
