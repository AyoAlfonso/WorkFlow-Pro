import React from "react";
import { render, screen } from "@testing-library/react";

describe("Renders Scorecard KPI Modal", () => {
  describe("Scorecard mini-update KPI modal", () => {
    test("input", () => {
      render(<input type="text" defaultValue="Example" />);

      expect(screen.getByDisplayValue("Example")).toBeInTheDocument();
    });

    test("textarea", () => {
      render(<textarea defaultValue="Example" />);

      expect(screen.getByDisplayValue("Example")).toBeInTheDocument();
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
