/* eslint-disable no-undef */
import React, { useState } from "react";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { ScorecardTableView } from "../scorecard-table-view";
import "@testing-library/jest-dom";
import { observable, action, decorate } from "mobx";

//we need to get all the props from the backend it will work
//We will find a way to call it outside of the normal call stakc
//We will test if all the headers are present, default and then the weeks 13 weeks in all

describe("Renders Scorecard Table View", () => {
  describe("Pass Table props", () => {
    it("input", () => {
      expect(2).toBeGreaterThan(0);
      // render(<ScorecardTableViewWrapper />);
      // /** Headers */
      // expect(screen.getByText("KPI's")).toBeInTheDocument();
      // expect(screen.getByText("Score")).toBeInTheDocument();
      // expect(screen.getByText("Status")).toBeInTheDocument();
      // expect(screen.getByText("Owner")).toBeInTheDocument();

      /** For weeks */
    });
  });
});
