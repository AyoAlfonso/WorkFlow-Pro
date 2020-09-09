export const dateStringToSeconds = dateString => {
  return new Date(dateString).getTime() / 1000;
};

export const nowInSeconds = () => Math.round(Date.now() / 1000);

export const nowAsUTCString = () => new Date().toUTCString();

export const noonTodayInSeconds = () => new Date().setHours(12, 0, 0, 0) / 1000;
