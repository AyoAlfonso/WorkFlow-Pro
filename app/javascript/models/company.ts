import { types, flow, getEnv } from "mobx-state-tree";
import { CoreFourModel } from "./core-four";

//core four, accountability, strategic only for display_format companies

export const CompanyModel = types
         .model("CompanyModel")
         .props({
           id: types.identifierNumber,
           name: types.string,
           rallyingCry: types.maybeNull(types.string),
           displayFormat: types.string,
           logoUrl: types.maybeNull(types.string),
           timezone: types.maybeNull(types.string),
           fiscalYearStart: types.maybeNull(types.string),
           currentFiscalWeek: types.maybeNull(types.number),
           currentFiscalQuarter: types.maybeNull(types.number),
           quarterForCreatingQuarterlyGoals: types.maybeNull(types.number),
           currentFiscalYear: types.maybeNull(types.number),
           yearForCreatingAnnualInitiatives: types.maybeNull(types.number),
           coreFour: types.maybeNull(CoreFourModel),
           accountabilityChartContent: types.maybeNull(types.string),
           strategicPlanContent: types.maybeNull(types.string),
           fiscalYearRange: types.maybeNull(types.array(types.frozen())),
           currentQuarterStartDate: types.maybeNull(types.string),
           nextQuarterStartDate: types.maybeNull(types.string),
           forumMeetingsYearRange: types.maybeNull(types.array(types.frozen())),
           forumIntroVideo: types.maybeNull(types.frozen()),
           signUpPurpose: types.maybeNull(types.frozen()),
           forumType: types.maybeNull(types.string),
           forumTypes: types.map(types.number)
         })
         .views(self => ({
           get accessCompany() {
             return self.displayFormat == "Company";
           },
           get accessForum() {
             return self.displayFormat == "Forum";
           },
           get forumTypesList() {
             return Array.from(self.forumTypes.entries()).map(a => {
               const str = a[0]
               return [str.charAt(0).toUpperCase() + str.slice(1), a[1]]
             })
           }
         }))
         .actions(self => ({
           setLogoUrl: logoUrl => {
             self.logoUrl = logoUrl;
           },
         }));

type CompanyModelType = typeof CompanyModel.Type;
type CompanyModelDataType = typeof CompanyModel.CreationType;

export interface ICompany extends CompanyModelType {}
export interface ICompanyData extends CompanyModelDataType {}
