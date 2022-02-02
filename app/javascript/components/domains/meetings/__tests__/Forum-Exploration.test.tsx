import React from "react";
import renderer from "react-test-renderer";
import { Exploration } from "../../meetings-forum/components/exploration";
import { Provider, rootStore } from "../../../../setup/root";
import { Section1 } from "../../meetings-forum/section-1";

describe("Renders Exploration Component", () => {
  it("should render component", async () => {
    const component = await renderer.create(
      <Provider value={rootStore}>
        <Exploration />
      </Provider>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot;
  });
});
