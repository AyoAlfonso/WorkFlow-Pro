import { isToday, isTomorrow, isBefore, parseISO } from "date-fns";
import * as R from "ramda";
import moment from "moment";
import { baseTheme } from "~/themes/base";
// moment.tz.setDefault("America/New_York");

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

export const sub = num => {
  if (num <= 52) {
    return num;
  } else {
    return sub(num - 52);
  }
};

export const addInverse = (num: number, repeat = false): { num: number; repeat: boolean } => {
  if (num <= 0) {
    repeat = true;
    return addInverse(52 + num, repeat);
  } else {
    return { num, repeat };
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
  console.log(d);
  console.log(d.getDate(), "DAte");
  d = new Date(d.getUTCFullYear(), d.getMonth(), d.getDate());
  console.log(d, "DAt2e");
  console.log(Date.UTC(d.getUTCFullYear(), d.getMonth(), d.getDate()));
  console.log(d);
  // console.log(typeof Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const trueDate = new Date(Date.UTC(d.getUTCFullYear(), d.getMonth(), d.getDate()));
  fiscalYearStart = new Date(fiscalYearStart);
  // const dayNum = d.getDay() || 7;
  // d.setDate(d.setDate() + 4 - dayNum);
  let yearStart: any = new Date(
    Date.UTC(d.getUTCFullYear(), fiscalYearStart.getMonth(), fiscalYearStart.getDate()),
  );
  const daysAfterSixDays = new Date(Date.UTC(d.getUTCFullYear(), d.getMonth(), d.getDate() + 6));

  console.log(d, trueDate, fiscalYearStart, yearStart);
  if (
    yearStart.getUTCFullYear() === d.getUTCFullYear() &&
    yearStart.getMonth() == 0 &&
    d.getMonth() == 11 &&
    d.getUTCFullYear() <= daysAfterSixDays.getUTCFullYear()
  ) {
    return addInverse(Math.ceil(((d - yearStart) / 86400000 + 1) / 7), true);
  }
  if (
    yearStart.getUTCFullYear() === d.getUTCFullYear() &&
    yearStart.getMonth() == 0 &&
    d.getMonth() == 0 &&
    d.getUTCFullYear() >= daysAfterSixDays.getUTCFullYear()
  ) {
    return addInverse(Math.ceil(((d - yearStart) / 86400000 + 1) / 7));
  }

  console.log(d, trueDate, fiscalYearStart, yearStart);
  console.log(
    trueDate.getTime() < yearStart.getTime(),
    trueDate.getTime() > yearStart.getTime(),
    addInverse(Math.ceil((d - yearStart + 1) / 86400000 / 7), false),
    addInverse(Math.ceil((d - yearStart + 1) / 86400000 / 7), true),
  );
  console.log(true, "ffff3");
  if (
    trueDate.valueOf() < yearStart.valueOf() &&
    trueDate.getUTCFullYear() <= yearStart.getUTCFullYear()
  ) {
    yearStart = new Date(
      Date.UTC(d.getUTCFullYear() - 1, fiscalYearStart.getMonth(), fiscalYearStart.getDate()),
    ) as any;
    return addInverse(Math.ceil(((d - yearStart) / 86400000 + 1) / 7), true);
  }

  console.log(true, "ffff1");
  if (trueDate.valueOf() > yearStart.valueOf()) {
    yearStart = new Date(
      Date.UTC(d.getUTCFullYear() - 1, fiscalYearStart.getMonth(), fiscalYearStart.getDate()),
    ) as any;
    console.log(true, "ffff-innn");
    return addInverse(Math.ceil(((d - yearStart) / 86400000 + 1) / 7), false);
  }
  console.log(addInverse(Math.ceil((d - yearStart + 1) / 86400000 / 7)), "ffff");

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
