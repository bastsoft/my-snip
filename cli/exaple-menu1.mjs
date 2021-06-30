import importGistId from "./lib/import-gist.mjs"
import Queue from "./lib/commands-queue.mjs";
import getCy from "./lib/cy.mjs";
import exapleMenu1 from "./lib/exaple-menu1.mjs";

import inquirer from "inquirer";
import fetch from "node-fetch";
import jsdom from "jsdom";
const { JSDOM } = jsdom;
const { document } = (new JSDOM(`...`)).window;

const cy = getCy(Queue);

const fetchjsonp = function(url){
  console.log("loadLikeJSON : ", url);
  return fetch(url).then(response=> response.json())
};

exapleMenu1({
    importGistId,
    cy,
    inquirer,
    fetchjsonp,
    document
});
