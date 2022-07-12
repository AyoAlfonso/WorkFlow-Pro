import { types } from "mobx-state-tree";

const ResponsesModel = types.model("ResponsesModel").props({
  prompt: types.string,
  questionType: types.string,
  response: types.frozen(),
});

export const CheckInArtifactsLogsModel = types.model("CheckInArtifactsLogsModel").props({
  id: types.identifierNumber,
  checkInArtifactId: types.number,
  responses: types.maybeNull(types.array(ResponsesModel)),
  createdById: types.number,
  scorecardLogs: types.maybeNull(types.array(types.number)),
  objectiveLogs: types.maybeNull(types.array(types.number)),
  deletedAt: types.maybeNull(types.string),
});
