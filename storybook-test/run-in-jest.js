import apiCy from "../src/lib/api/api-cy.js";
import apiPlaywrite from "../src/lib/api/api-playwrite.js";

export default function (Story, {render, userEvent, plugins}) {
  Object.keys(Story).forEach((keyStory) => {
    if (Story[keyStory].test) {
      test("storybook " + Story.default.title + " " + keyStory, async () => {
        const renderFunction = Story[keyStory].render || Story.default.render;
        const component = renderFunction(Story[keyStory].args, { argTypes: {} });
        const container = await render(component, {
          global: {
            plugins: plugins || [],
          },
        });
  
        await Story[keyStory].test({
          canvasElement: container.container,
          container,
          userEvent,
          expect,
          apiCy,
          apiPlaywrite,
          step: async (nameStep, callback) => {
            await callback();
          },
          allArgs: Story[keyStory].args,
          component: Story.default.component,
        });
      });
    }
  });
}
