import apiCy from "../src/lib/api/api-cy.js";

export default function ({userEvent, within, expect}) {
  return function(test, obj={}){
    obj.test = test;
    obj.play = async (ctx) => {
      const container = within(ctx.canvasElement);
      ctx.container = container;
      ctx.userEvent = userEvent;
      ctx.expect = expect;
      ctx.apiCy = apiCy;
      test(ctx);
    };

    return obj;
  }
}
