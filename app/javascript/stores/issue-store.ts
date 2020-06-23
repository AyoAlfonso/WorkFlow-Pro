import { types, flow } from "mobx-state-tree";
import { withEnvironment } from "../lib/with-environment";
import { IssueModel } from "../models/issue";
import { ApiResponse } from "apisauce";

export const IssueStoreModel = types
  .model("IssueStoreModel")
  .props({
    issues: types.array(IssueModel)
  })
  .extend(withEnvironment())
  .views(self => ({
    get openIssues() {
      return self.issues.filter(issue => issue.completedAt == null);
    },
    get allIssues() {
      return self.issues;
    }
  }))
  .actions(self => ({
    fetchIssues: flow(function*() {
      const response: ApiResponse<any> = yield self.environment.api.getIssues();
      if (response.ok) {
        self.issues = response.data;
      }
    }),
    updateIssueStatus: flow(function*(id) {
      //THIS IS VERY STUPID -> JUST TESTING IF THE RERENDER WORKS. MAKE A BACK END CALL HERE
      const response = self.issues.filter(issue => issue.id !== id);
      self.issues = response as any;
    })
  }))
  .actions(self => ({
    reset() {
      self.issues = [] as any;
    }
  }))
  .actions(self => ({
    load: flow(function*() {
      self.reset();
      yield self.fetchIssues();
    })
  }));

type IssueStoreType = typeof IssueStoreModel.Type;
export interface IIssueStore extends IssueStoreType {
  issues: any;
}
