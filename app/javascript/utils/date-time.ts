const MILLISECONDS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;

export const dateStringToSeconds = dateString => {
  return new Date(dateString).getTime() / MILLISECONDS_PER_SECOND;
};

export const nowInSeconds = () => Math.round(Date.now() / MILLISECONDS_PER_SECOND);

export const nowAsUTCString = () => new Date().toUTCString();

export const noonTodayInSeconds = () => new Date().setHours(12, 0, 0, 0) / MILLISECONDS_PER_SECOND;

export const daysInMilliseconds = days =>
  days * MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE * MINUTES_PER_HOUR * HOURS_PER_DAY;
