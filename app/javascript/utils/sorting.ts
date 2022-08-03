import * as R from "ramda";
import moment from "moment";

export const sortByPosition = R.sortBy(R.prop("position"));

export const sortByDate = (a: any, b: any) => {
  if (a.createdAt < b.createdAt) {
    return 1;
  }
  if (a.createdAt > b.createdAt) {
    return -1;
  }
  return 0;
};

export const sortByDateReverse = (a: any, b: any) => {
  if (a.createdAt < b.createdAt) {
    return -1;
  }
  if (a.createdAt > b.createdAt) {
    return 1;
  }
  return 0;
};

export const sortByDueDate = (a: any, b: any) => {
  if (!a.startTime || !b.startTime) return -1
  return moment(new Date(a.startTime)).diff(moment(new Date(b.startTime)));
};

export const sortByName = (a: any, b: any) => {
  if (a.checkInTemplate.name.toLowerCase() < b.checkInTemplate.name.toLowerCase()) {
    return -1;
  }
  if (a.checkInTemplate.name.toLowerCase() > b.checkInTemplate.name.toLowerCase()) {
    return 1;
  }
  return 0;
}

export const sortUsersListByName = (a: any, b: any) => {
  if (!a.firstName || !b.firstName) {
    return 0
  } else {
    return a.firstName.localeCompare(b.firstName);
  }
}