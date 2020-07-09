//Reference: https://auth0.com/blog/role-based-access-control-rbac-and-react-apps/
import * as React from "react";
import { rules } from "~/lib/rbac-rules";
import { useMst } from "~/setup/root";

interface CanProps {
  yes: JSX.Element;
  no: JSX.Element;
  action: string;
  data?: any;
  additionalClause?: boolean;
}

export const check = (role: string, action: string, data: any): boolean => {
  const permissions = rules[role];

  if (!permissions) {
    return false;
  }
  const staticPermissions = permissions.static;
  if (staticPermissions && staticPermissions.includes(action)) {
    return true;
  }

  const dynamicPermissions = permissions.dynamic;
  if (dynamicPermissions) {
    const permissionCondition = dynamicPermissions[action];
    if (!permissionCondition) {
      return false;
    }
    return permissionCondition(data);
  }

  return false;
};

export const Can = ({ action, data, no, yes }: CanProps): JSX.Element => {
  const { sessionStore } = useMst();
  const { role } = sessionStore.profile;
  return check(role, action, data) ? yes : no;
};
