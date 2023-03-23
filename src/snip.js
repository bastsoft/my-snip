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

export default {
  load(url){
    import(/*webpackIgnore: true*/url).then((res)=>{
      const snippets = res.default;
      createMenu(snippets);
    });
  },
  loadGist(data){
    importGistId(fetchjsonp, document, data.id).then(gists => {
      const js = gists[data.file].text;
      const objectURL = URL.createObjectURL(new Blob([js], { type: 'text/javascript' }));
      this.load(objectURL);
    });
  },
};