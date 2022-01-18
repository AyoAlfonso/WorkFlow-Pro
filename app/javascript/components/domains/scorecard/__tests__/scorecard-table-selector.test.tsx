/* eslint-disable no-undef */
import * as React from "react";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { ScorecardSelector } from "../scorecard-selector";
import "@testing-library/jest-dom";
import { observable, action, decorate } from "mobx";
import { Provider, rootStore } from "../../../../setup/root";
import { Router } from "react-router-dom";
import { getEnv } from "mobx-state-tree";
const mockFn = jest.fn();
import { dataState } from "app/javascript/components/domains/scorecard/__tests__/scorecard-data/data-store";
import { RootStoreModel } from "app/javascript/stores/root-store";

// import { setupEnvironment } from "app/javascript/setup/environment";
// const environment = setupEnvironment();
// afterEach(cleanup);

// const { keyPerformanceIndicatorStore } = useMst();
// const { allKPIs } = keyPerformanceIndicatorStore;

//we need to get all the props from the backend it will work
//We will find a way to call it outside of the normal call stakc
//We will test if all the headers are present, default and then the weeks 13 weeks in all

describe("Renders Scorecard Table View", () => {
  describe("Pass Table props", () => {
    it("input", () => {
      jest.mock("app/javascript/stores/company-store", () => {
        return { token: "foobar" };
      });

      jest.mock("app/javascript/stores/team-store", () => {
        return { token: "foobar" };
      });

      jest.mock("app/javascript/stores/user-store", () => {
        return { token: "foobar" };
      });
      expect(2).toBeGreaterThan(1);
    
      rootStore.userStore.setUsersManually(dataState.userStore.users)
      rootStore.companyStore.setCompanyManually(dataState.companyStore.company)
      rootStore.teamStore.setTeamsManually(dataState.teamStore.teams)

      const { debug } = render(
        <Provider value={rootStore}>
          <div></div>,
          <Router history={getEnv(rootStore).routerHistory}>
            <ScorecardSelector
              ownerType={"user"}
              ownerId={1}
              setScorecardOwner={() => null}
              isMiniEmbed={false}
            />
          </Router>
        </Provider>,
      );

      // /** Headers */
      expect(screen.getByTestId("scorecard-selector")).toBeInTheDocument();
      // expect(screen.getByText("Score")).toBeInTheDocument();
      // expect(screen.getByText("Status")).toBeInTheDocument();
      // expect(screen.getByText("Owner")).toBeInTheDocument();

      /** For weeks */
    });
  });
});

beforeEach(() => {
  mockFn.mockReset();
});
