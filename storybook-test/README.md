this is an experimental functionality for working with storybook


in storybook file:

```js

import { expect } from "@storybook/jest";
import { userEvent, within } from "@storybook/testing-library";

import mySnipStorybookTestCreate from "my-snip/storybook-test/create.js";
import apiCy from "my-snip/src/lib/api/api-cy.js";

export const ByDefault = mySnipStorybookTestCreate(
  {userEvent, within, expect},
  async function ({ step, expect, container, userEvent, canvasElement }) {
    const logger = {
      log(){
        console.log(...arguments);
      }
    };
    const cy = apiCy.mount(canvasElement, logger);
    let arrEl;
    await step("проверка addOneCartItem", async () => {
      cy.get("[aria-label='Add one Espresso']").click();

      arrEl =  await cy.get("[data-testid='result']");
      expect(arrEl[0].innerHTML).toBe("addOneCartItem Espresso");
    });
  },
  {
    args: {
    }
  }
);
```

```js
import * as Story from "./cart2.stories.js";

import { render } from "@testing-library/vue";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";

import mySnipStorybookTestRunInJest from "my-snip/storybook-test/run-in-jest.js";

mySnipStorybookTestRunInJest(Story);
```
