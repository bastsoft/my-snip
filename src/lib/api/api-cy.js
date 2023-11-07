import getDefaultApi from "./api-default.js";
import createApiProperty from "./test-api-generator.js";

function mount(element, logger={log(){}}) {
  return createApiProperty(element, getDefaultApi(logger));
};

export default {mount};