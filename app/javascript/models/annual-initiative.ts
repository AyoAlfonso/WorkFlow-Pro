import { types, getRoot } from "mobx-state-tree";
import { QuarterlyGoalModel } from "./quarterly-goal";
import { KeyElementModel } from "./key-element";
import { UserModel } from "./user";

export const AnnualInitiativeModel = types
  .model("AnnualInitiativeModel")
  .props({
    id: types.identifierNumber,
    companyId: types.maybeNull(types.number),
    createdById: types.number,
    importance: types.array(types.string),
    description: types.string,
    keyElements: types.array(KeyElementModel),
    ownedById: types.number,
    quarterlyGoals: types.array(QuarterlyGoalModel),
    contextDescription: types.string,
    ownedBy: types.maybeNull(UserModel),
    fiscalYear: types.maybeNull(types.number),
    closedAt: types.maybeNull(types.string),
    createdAt: types.maybeNull(types.string),
  })
  .views(self => ({
    get closedInitiative() {
      let itemClosed = false;
      if (self.closedAt) {
        itemClosed = true;
      }
      return itemClosed;
    },
    get deepClosedInitiative() {
      let itemClosed = false;
      if (self.closedAt) {
        itemClosed = true;
      } else {
        self.quarterlyGoals.forEach(qg => {
          if (qg.closedAt) {
            itemClosed = true;
          } else {
            qg.subInitiatives.forEach(si => {
              if (si.closedAt) {
                itemClosed = true;
              }
            });
          }
        });
      }
      return itemClosed;
    },
    get myQuarterlyGoals() {
      const { sessionStore } = getRoot(self);
      return self.quarterlyGoals.filter(qg => qg.ownedById == sessionStore.profile.id);
    },
    get activeQuarterlyGoals() {
      const { companyStore } = getRoot(self);
      return self.quarterlyGoals.filter(
        qg => companyStore.company.currentFiscalQuarter == qg.quarter,
      );
    },
    get openQuarterlyGoals() {
      const quarterlyGoals = [];
      self.quarterlyGoals
        .filter(qg => !qg.closedAt)
        .forEach(qg => {
          quarterlyGoals.push(
            Object.assign(
              { ...qg },
              { subInitiatives: qg.subInitiatives.filter(si => !si.closedAt) },
            ),
          );
        });
      return quarterlyGoals;
    },
    get closedQuarterlyGoals() {
      const quarterlyGoals = [];
      self.quarterlyGoals
        .filter(qg => (!qg.closedAt && qg.subInitiatives.find(si => si.closedAt)) || qg.closedAt)
        .forEach(qg => {
          quarterlyGoals.push(
            Object.assign(
              { ...qg },
              { subInitiatives: qg.subInitiatives.filter(si => si.closedAt) },
            ),
          );
        });
      return quarterlyGoals;
    },
    get openPersonalQuarterlyGoals() {
      const { sessionStore } = getRoot(self);
      const userId = sessionStore.profile.id;
      const quarterlyGoals = [];
      self.quarterlyGoals
        .filter(qg => !qg.closedAt && qg.ownedById == userId)
        .forEach(qg => {
          quarterlyGoals.push(
            Object.assign(
              { ...qg },
              {
                subInitiatives: qg.subInitiatives.filter(
                  si => !si.closedAt && si.ownedById == userId,
                ),
              },
            ),
          );
        });
      return quarterlyGoals;
    },
  }))
  .actions(self => ({}));

type AnnualInitiativeModelType = typeof AnnualInitiativeModel.Type;
type AnnualInitiativeModelDataType = typeof AnnualInitiativeModel.CreationType;

export interface IAnnualInitiative extends AnnualInitiativeModelType {}
export interface IAnnualInitiativeData extends AnnualInitiativeModelDataType {}
