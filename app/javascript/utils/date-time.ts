export const dateStringToSeconds = dateString => {
  return new Date(dateString).getTime() / 1000;
};

export const nowInSeconds = () => Math.round(Date.now() / 1000);

export const nowAsUTCString = () => new Date().toUTCString();
