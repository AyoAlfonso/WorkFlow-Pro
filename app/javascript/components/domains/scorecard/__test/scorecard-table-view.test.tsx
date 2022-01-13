import React from "react";
import { render, screen } from "@testing-library/react";
import { ScorecardTableView } from "./scorecard-table-view";

const {
  companyStore,
  scorecardStore,
  teamStore,
  userStore,
  keyPerformanceIndicatorStore,
} = useMst();

const { allKPIs } = keyPerformanceIndicatorStore;

//we need to get all the props from the backend it will work
//We will find a way to call it outside of the normal call stakc
//We will test if all the headers are present, default and then the weeks 13 weeks in all

describe("Renders Scorecard Table View", () => {
  describe("Pass Table props", () => {
    test("input", () => {
      render(
        <ScorecardTableView
          tableKPIs={tableKPIs}
          allKPIs={allKPIs}
          setKpis={setKPIs}
          viewEditKPIModalOpen={viewEditKPIModalOpen}
          setViewEditKPIModalOpen={setViewEditKPIModalOpen}
          isMiniEmbed={isMiniEmbed}
        />,
      );

      expect(screen.getByDisplayValue("")).toBeInTheDocument();
    });

    test("textarea", () => {
      render(<textarea defaultValue="" />);

      expect(screen.getByDisplayValue("")).toBeInTheDocument();
    });

    test("select", () => {
      render(
        <select defaultValue="1">
          <option value="1">Example 1</option>
          <option value="2">Example 2</option>
        </select>,
      );

      expect(screen.getByDisplayValue("Example 1")).toBeInTheDocument();
    });
  });
});
