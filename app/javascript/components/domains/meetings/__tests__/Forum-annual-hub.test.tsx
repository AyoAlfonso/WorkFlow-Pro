import React from "react";
import renderer from "react-test-renderer";
import { Provider, rootStore } from "../../../../setup/root";
import { Section1 } from "../../meetings-forum/section-1";
import { Section2 } from "../../meetings-forum/section-2";
import { MemoryRouter, Route } from "react-router-dom";
import reactI18next from "react-i18next";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: key => key }),
}));

describe("Renders Annual Hub", () => {
  it("should render section 1 component for annual hub", async () => {
    const component = await renderer.create(
      <Provider value={rootStore}>
        <MemoryRouter initialEntries={["/meetings/section_1/1"]}>
          <Route path="/meetings/section_1/:team_id">
            <Section1 />
          </Route>
        </MemoryRouter>
      </Provider>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot;
  });

  it("should render upcoming hub", async () => {
    const component = await renderer.create(
      <Provider value={rootStore}>
        <MemoryRouter initialEntries={["/meetings/section_2/1"]}>
          <Route path="/meetings/section_2/:team_id">
            <Section2 />
          </Route>
        </MemoryRouter>
      </Provider>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot;
  });
});
