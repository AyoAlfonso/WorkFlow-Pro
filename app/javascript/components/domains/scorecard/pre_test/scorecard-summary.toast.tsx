import React, { useState, useEffect } from "react";
import { render, screen } from "@testing-library/react";
import { ScorecardSummary } from "../scorecard-summary";


// // const [kpis, setKpis] = useState([]);

// // setKpis(scorecardStore.kpis);

// describe("Renders Scorecard Summary View", () => {
//   describe("Graph Value A", () => {
//     test("If Graph Summary A is in DOM", () => {
//       render(
//         <ScorecardSummary
//           kpis={kpis}
//           currentWeek={6}
//           currentQuarter={3}
//           fiscalYearStart={2021}
//           currentFiscalYear={companyStore.co}
//         />,
//       );
//       expect(screen.getByDisplayValue("")).toBeInTheDocument();
//     });
//   });
// });

// describe("Graph Value B", () => {
//   describe("Graph Value", () => {
//     test("input", () => {
//       render(<input type="text" defaultValue="" />);

//       expect(screen.getByDisplayValue("")).toBeInTheDocument();
//     });
//   });
// });
