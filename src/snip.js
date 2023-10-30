import importGistId from "./lib/import-gist.js"
import createMenu from "./lib/create-menu.js";
import fetchjsonp from "./lib/fetchjsonp.js";
import apiCy from "./lib/api/api-cy.js";
import apiPlaywrite from "./lib/api/api-playwrite.js";

const logger = {
  log(){
    console.log(...arguments);
  }
};
let env = {};

const context = {};
const setEnv = function(name, value){
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

context.env = setEnv;

context.cy = apiCy.mount(window.document, logger);
context.Cypress = {
  env: setEnv
};

context.page = apiPlaywrite.mount(window.document, logger);

function load(url){
  import(/*webpackIgnore: true*/url).then((res)=>{
    const snippets = res.default;
    createMenu(snippets, context);
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
    setEnv(payload.env);
  }

  if(payload.file){
    payload.file.then((res)=>{
      const snippets = res.default;
      createMenu(snippets, context);
    });
  }
};