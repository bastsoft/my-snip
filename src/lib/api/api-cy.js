import getDefaultApi from "./api-default.js";
import createApiProperty from "./test-api-generator.js";

function mount(element, logger) {
  return createApiProperty(element, getDefaultApi(logger));
};

export default {mount};