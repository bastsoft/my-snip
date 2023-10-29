export default function (Story, {render, userEvent}) {
  Object.keys(Story).forEach((keyStory) => {
    if (Story[keyStory].test) {
      test("storybook " + Story.default.title + " " + keyStory, async () => {
        const renderFunction = Story[keyStory].render || Story.default.render;
        const component = renderFunction(Story[keyStory].args, { argTypes: {} });
        const container = await render(component, {
          global: {
            plugins: [],
          },
        });
  
        await Story[keyStory].test({
          canvasElement: container.container,
          container,
          userEvent,
          expect,
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
