import * as humps from "humps";

export const camelizeResponse = data => {
  return humps.camelizeKeys(data);
};

export const decamelizeRequest = params => {
  return humps.decamelizeKeys(params);
};

export const titleCase = str => {
  return str
    .split(" ")
    .map(w => w[0].toUpperCase() + w.substr(1).toLowerCase())
    .join(" ");
};
