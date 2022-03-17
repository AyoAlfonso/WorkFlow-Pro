import { isToday, isTomorrow, isBefore, parseISO } from "date-fns";
import * as R from "ramda";
import moment from "moment";
import { baseTheme } from "~/themes/base";

export const findNextMonday = date => {
  const daysOfWeek = [1, 7, 6, 5, 4, 3, 2];
  const monday = new Date(date);
  monday.setDate(monday.getDate() + daysOfWeek[monday.getDay()]);
  return monday;
};

export const resetYearOfDateToCurrent = (date, currentFiscalYear, interceptor = "-") => {
  return date
    .split(interceptor)
    .map((e, i) => {
      if (i == 0) {
        return currentFiscalYear || new Date().getFullYear();
      } else {
        return e;
      }
    })
    .join(interceptor);
};

moment.updateLocale("en", {
  week: {
    dow: 1,
  },
});

function sub(num) {
  if (num <= 52) {
    return num;
  } else {
    return sub(num - 52);
  }
}

export const addInverse = (num: number): number => {
  if (num <= 0) {
    return addInverse(52 + num);
  } else {
    return num;
  }
};
const MILLISECONDS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;
const DAYS_OF_WEEK = 7;
export const getWeekDiff = (to, from) => {
  const dateDiff = Math.abs(+to - +new Date(from));
  return sub(Math.ceil(dateDiff / (1000 * 60 * 60 * 24) / DAYS_OF_WEEK));
};

export const dateStringToSeconds = dateString => {
  return new Date(dateString).getTime() / MILLISECONDS_PER_SECOND;
};

export const nowInSeconds = () => Math.round(Date.now() / MILLISECONDS_PER_SECOND);

export const nowAsUTCString = () => new Date().toUTCString();

export const noonTodayInSeconds = () => new Date().setHours(12, 0, 0, 0) / MILLISECONDS_PER_SECOND;

export const daysInMilliseconds = days =>
  days * MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE * MINUTES_PER_HOUR * HOURS_PER_DAY;

export const parseKeyActivityDueDate = keyActivity => {
  const dueDate = keyActivity.dueDate;
  const parsedDate = parseISO(dueDate);
  const { cautionYellow, greyActive, warningRed, successGreen } = baseTheme.colors;

  if (R.isNil(dueDate)) {
    return { text: "", color: greyActive };
  } else if (isToday(parsedDate)) {
    return { text: "Today", color: cautionYellow };
  } else if (isTomorrow(parsedDate)) {
    return { text: "Tomorrow", color: successGreen };
  } else if (isBefore(parsedDate, new Date())) {
    return { text: "Overdue", color: warningRed };
  } else {
    return { text: moment(parsedDate).format("MMM Do, YYYY"), color: greyActive };
  }
};

export const getWeekOf = () => {
  const currentWeekOf = moment().startOf("isoWeek");
  const formatedCurrentWeekOf = moment(currentWeekOf).format("YYYY-MM-DD");
  return formatedCurrentWeekOf;
};

export const getWeekNumber = (d, fiscalYearStart) => {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  fiscalYearStart = new Date(fiscalYearStart);
  const yearStart = new Date(
    Date.UTC(d.getUTCFullYear(), fiscalYearStart.getMonth(), fiscalYearStart.getDate()),
  ) as any;
  return addInverse(Math.ceil(((d - yearStart) / 86400000 + 1) / 7));
};

export const validateWeekOf = (weekOf, history, id) => {
  const currentWeekOf = getWeekOf();
  if (!moment(weekOf, "YYYY-MM-DD", true).isValid()) {
    return history.push(`/weekly-check-in/${id}/${currentWeekOf}`);
  }
  if (moment(weekOf, "YYYY-MM-DD", true).isValid() && currentWeekOf !== weekOf) {
    return history.push(`/weekly-check-in/${id}/${currentWeekOf}`);
  }
};
