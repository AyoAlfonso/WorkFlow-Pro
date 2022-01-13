import React from "react";
import { render, screen } from "@testing-library/react";

describe("Renders Scorecard Summary View", () => {
  describe("Graph Value A", () => {
    test("input", () => {
      render(<input type="text" defaultValue="" />);
      expect(screen.getByDisplayValue("")).toBeInTheDocument();
    });
  });
});

describe("Graph Value B", () => {
  describe("Graph Value", () => {
    test("input", () => {
      render(<input type="text" defaultValue="" />);

      expect(screen.getByDisplayValue("")).toBeInTheDocument();
    });
  });
});
