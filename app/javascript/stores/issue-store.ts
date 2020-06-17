import { types, flow } from "mobx-state-tree";
import { withEnvironment } from "../lib/with-environment";
import { IssueModel } from "../models/issue";
// import { ApiResponse } from "apisauce";

export const IssueStoreModel = types
  .model("IssueStoreModel")
  .props({
    issues: types.array(IssueModel)
  })
  .extend(withEnvironment())
  .views(self => ({
    get openIssues() {
      return self.issues.filter(issue => issue.completed);
    },
    get allIssues() {
      return self.issues;
    }
  }))
  .actions(self => ({
    //TODO: API Call to fetch issues
    fetchIssues: flow(function*() {
      self.issues = [
        {
          id: 1,
          text: "MaRS Health Innovation Week",
          completed: true
        },
        {
          id: 2,
          text: "The project manager at Southlake is not responsive",
          completed: true
        },
        {
          id: 3,
          text: "Test Item 3",
          completed: true
        },
        {
          id: 4,
          text: "Test Item 4",
          completed: true
        },
        {
          id: 5,
          text: "Test Item 5",
          completed: true
        },
        {
          id: 6,
          text: "Test Item 6",
          completed: false
        },
        {
          id: 7,
          text: "Test Item 7",
          completed: false
        },
        {
          id: 8,
          text: "Test Item 8",
          completed: false
        },
        {
          id: 9,
          text: "Test Item 9",
          completed: false
        },
        {
          id: 10,
          text: "Test Item 10",
          completed: false
        },
        {
          id: 11,
          text: "Test Item 11",
          completed: false
        },
        {
          id: 12,
          text: "Test Item 12",
          completed: false
        },
        {
          id: 13,
          text: "Test Item 13",
          completed: false
        }
      ] as any;
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
