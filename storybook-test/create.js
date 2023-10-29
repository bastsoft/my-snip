export default function ({userEvent, within, expect}, test, obj) {
  obj.test = test;
  obj.play = async (ctx) => {
    const container = within(ctx.canvasElement);
    ctx.container = container;
    ctx.userEvent = userEvent;
    ctx.expect = expect;
    test(ctx);
  };

  return obj;
}
