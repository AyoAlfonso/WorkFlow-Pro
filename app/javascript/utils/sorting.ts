import * as R from "ramda";

export const sortByPosition = R.sortBy(R.prop("position"));

export const sortByDate = (a:any, b:any) => {
  if (a.createdAt < b.createdAt) {
    return 1;
  }
  if (a.createdAt > b.createdAt) {
    return -1;
  }
  return 0;
}

export const sortByDateReverse = (a: any, b: any) => {
  if (a.createdAt < b.createdAt) {
    return -1;
  }
  if (a.createdAt > b.createdAt) {
    return 1;
  }
  return 0;
};