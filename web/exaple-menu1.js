import importGistId from "../lib/import-gist.js"
import Queue from "../lib/commands-queue.js";
import getCy from "../lib/cy.js";

import inquirer from "./inquirer-ui.js";
import {fetchjsonp} from "./fetch.js";

import exapleMenu1 from "../lib/exaple-menu1.js";

const cy = getCy(Queue);

exapleMenu1({
    importGistId,
    cy,
    inquirer,
    fetchjsonp,
    document
});
