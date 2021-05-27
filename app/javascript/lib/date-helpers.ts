import * as moment from "moment";

export const today = moment().format("MMMM D");

//TODO: decide if we need a fancier yesterday calculation to last working day
export const yesterday = moment()
  .subtract(1, "days")
  .format("MMMM D");

export const tomorrow = moment()
  .add(1, "days")
  .format("MMMM D");

export const todaysDateFull = moment().format("YYYY-MM-DD");
export const yesterdaysDateFull = moment()
  .subtract(1, "days")
  .format("YYYY-MM-DD");
