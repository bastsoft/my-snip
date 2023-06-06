import importGistId from "./lib/import-gist.js"
import Queue from "./lib/commands-queue.js";
import getCy from "./lib/cy.js";

import createMenu from "./lib/create-menu.js";
import fetchjsonp from "./lib/fetchjsonp.js";

const cy = getCy(Queue);

Object.defineProperty(window, "cy", {
    get: function () {
        cy.initEl(document);

        return cy;
    },
    configurable: true
});

let env = {};
window.Cypress = {};
window.Cypress.env = function(name, value){
  if(!name){
    return env;
  }

  if(typeof(value) !== "undefined"){
    env[name] = value;
  }

  if(typeof(name) === "object"){
    env = {...env, ...name};
  }

  if(typeof(name) === "string" && typeof(value) === "undefined"){
    return env[name];
  }
};

function load(url){
  import(/*webpackIgnore: true*/url).then((res)=>{
    const snippets = res.default;
    createMenu(snippets);
  });
}

function loadGist(payload){
  importGistId(fetchjsonp, document, payload.id).then(gists => {
    const js = gists[payload.file].text;
    const objectURL = URL.createObjectURL(new Blob([js], { type: 'text/javascript' }));
    load(objectURL);
  });
}

export default function(payload){
  if(payload.url){
    load(payload.url);
  }

  if(payload.id){
    loadGist(payload);
  }

  if(payload.env){
    window.Cypress.env(payload.env);
  }
};