export type UserType = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  defaultAvatarColor?: string;
  title?: string;
  companyProfiles?: Array<any>;
  currentCompanyUserTeams?: Array<any>
};
