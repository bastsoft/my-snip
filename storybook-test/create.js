import apiCy from "../src/lib/api/api-cy.js";
import apiPlaywrite from "../src/lib/api/api-playwrite.js";

export default function ({userEvent, within, expect}) {
  return function(test, obj={}){
    obj.test = test;
    obj.play = async (ctx) => {
      const container = within(ctx.canvasElement);
      ctx.container = container;
      ctx.userEvent = userEvent;
      ctx.expect = expect;
      ctx.apiCy = apiCy;
      ctx.apiPlaywrite = apiPlaywrite;
      await test(ctx);
    };

    return obj;
  }
}
