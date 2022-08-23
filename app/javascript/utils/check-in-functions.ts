import moment from "moment";
import { getIconName } from "~/components/domains/check-in/data/step-data";
import { ICheckInTemplateStore } from "~/stores/check-in-template-store";

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

const formatCadence = cadence => {
  switch (cadence) {
    case "Every Weekday":
      return "every-weekday";
    case "Weekly":
      return "weekly";
    case "Daily":
      return "daily";
    case "Once":
      return "once";
    case "Monthly":
      return "monthly";
    case "Bi-weekly":
      return "bi-weekly";
    case "Quarterly":
      return "quarterly";
    default:
      return "";
  }
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

const getEntityArray = (entityArray, userStore, teamStore, companyStore) => {
  const entityArrayToReturn = [];
  entityArray.forEach(entity => {
    if (entity.type === "user") {
      const user = userStore.users?.find(user => user.id === entity.id);
      if (user) {
        entityArrayToReturn.push({
          id: user.id,
          type: "user",
          defaultAvatarColor: user.defaultAvatarColor,
          avatarUrl: user.avatarUrl,
          name: user.firstName,
          lastName: user.lastName,
        });
      }
    } else if (entity.type === "team") {
      const team = teamStore.teams?.find(team => team.id === entity.id);
      if (team) {
        entityArrayToReturn.push({
          id: team.id,
          type: "team",
          defaultAvatarColor: team.defaultAvatarColor,
          name: team.name,
        });
      }
    } else {
      companyStore.company &&
        entityArrayToReturn.push({
          id: companyStore.company?.id,
          type: "company",
          avatarUrl: companyStore.company?.logoUrl,
          name: companyStore.company?.name,
        });
    }
  });
  return entityArrayToReturn;
};

export const createTemplate = (
  template,
  checkInTemplateStore: ICheckInTemplateStore,
  history,
): void => {
  const steps = template.checkInTemplatesSteps.map(step => {
    return {
      stepType: step.stepType,
      name: step.name,
      iconName: getIconName(step.name),
      instructions: step.instructions,
      orderIndex: step.orderIndex,
      componentToRender: step.componentToRender,
      variant: step.variant,
      question: step.question,
    };
  });

  const checkIn = {
    name: template.name,
    checkInTemplatesStepsAttributes: steps,
    participants: null,
    anonymous: false,
    checkInType: "dynamic",
    ownerType: template.ownerType.toLowerCase(),
    description: template.description,
    timeZone: "",
    viewers: null,
    runOnce: "",
    dateTimeConfig: null,
    reminder: null,
    tag: ["custom"],
  };

  checkInTemplateStore.createCheckinTemplate(checkIn).then(id => {
    history.push(`/check-in/template/edit/${id}`);
  });
};
