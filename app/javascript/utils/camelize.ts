import * as humps from "humps";

export const camelizeResponse = data => {
  return humps.camelizeKeys(data);
};

export const decamelizeRequest = params => {
  return humps.decamelizeKeys(params);
};

export const titleCase = str => {
  return str.toLowerCase().replace(/\b(\w)/g, s => s.toUpperCase());
};
