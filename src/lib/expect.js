export default function createExpect(page, element) {
  function isElVisible(el) {
    if (!el) {
      return false;
    }

    const style = window.getComputedStyle(el);

    if (style.display === "none" || style.visibility === "hidden") {
      return false;
    }

    const rect = el.getBoundingClientRect();

    return rect.width > 0 && rect.height > 0;
  }

  function expectation(locator) {
    return {
      async toBeVisible(options = {}) {
        const timeout = options.timeout || 4000;
        const startTime = Date.now();

        return new Promise((resolve, reject) => {
          (function poll() {
            const matched = locator.find();

            if (matched.length > 0 && matched.some(isElVisible)) {
              resolve();
            } else if (Date.now() - startTime >= timeout) {
              const message =
                `expect.toBeVisible: элемент не виден за ${timeout}мс` +
                (locator.text ? ` (текст: "${locator.text}")` : "");
              alert(message);
              reject(new Error(message));
            } else {
              setTimeout(poll, 50);
            }
          })();
        });
      },
    };
  }

  return function expect(value) {
    if (value && typeof value.find === "function") {
      return expectation(value);
    }

    return {
      toBeVisible(options = {}) {
        const message =
          "expect: toBeVisible поддерживается только для page.getByText()";
        alert(message);
        return Promise.reject(new Error(message));
      },
    };
  };
}