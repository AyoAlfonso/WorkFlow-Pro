export const getCadence = cad => {
  switch (cad) {
    case "every-weekday":
      return "Every Weekday";
    case "weekly":
      return "Weekly";
    case "daily":
      return "daily";
    case "once":
      return "Once";
    case "monthly":
      return "Monthly";
    case "bi-weekly":
      return "Bi-weekly";
    case "quarterly":
      return "Quarterly";
    default:
      return "";
  }
};

export const getTimezone = {
  0: "user",
  1: "account",
};

export const getTotalNumberOfResponses = (question, logs, questionType) => {
  const totalNumberOfResponses = logs.reduce((acc, log) => {
    const response = log.responses?.find(
      response => response.prompt == question && response.questionType == questionType,
    );
    if (response) {
      return acc + 1;
    } else return acc;
  }, 0);
  return totalNumberOfResponses;
};

export const getPercentage = responseArray => {
  const percentages = Object.entries(
    responseArray.reduce((map, item) => ((map[item] = (map[item] || 0) + 1), map), {}),
  ).map(([item, count]) => {
    const calc = (Number(count) * 100) / responseArray.length;
    return { value: item, percentage: calc };
  });
  return percentages;
};

export const getAverage = ansArr => ansArr.reduce((acc, ans) => acc + ans, 0) / ansArr.length;

export const getResponses = (question, logs, questionType) => {
  const responseArray = [];
  logs.forEach(log => {
    const response = log.responses?.find(
      response => response.prompt == question && response.questionType == questionType,
    );
    if (response) {
      responseArray.push(response.response);
    }
  });
  return responseArray;
};
