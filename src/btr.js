import importGistId from "../lib/import-gist.js"
import Queue from "../lib/commands-queue.js";
import getCy from "../lib/cy.js";

import inquirer from "../web/inquirer-ui.js";
import {fetchjsonp} from "../web/fetch.js";

window.btr = {};

btr.context = {
    importGistId,
    cy : getCy(Queue),
    inquirer,
    fetchjsonp,
    document
};

btr.loadGist = function(data){
    importGistId(fetchjsonp, document, data.id).then(gists => {
        const load = new Function('{ importGistId, cy, inquirer, fetchjsonp, document}',  gists[data.file].text);
        load(btr.context);
    });
};

btr.loadModule = function(url){
    const script = document.createElement('script');
    const id = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + (+(new Date));

    window['delete' + id] = ()=>{
      console.log('delete' + id);
      const elem = document.querySelector("#" + id);
      elem.parentNode.removeChild(elem);
      
      delete window['delete' + id];
    };

    script.type = 'module';
    script.id = id;
    script.text = `
    import exapleMenu1 from "${url}";
    
    exapleMenu1(btr.context);

    delete${id}();
    `;

    script.onreadystatechange = onload;
    script.onload = onload;
    

    document.head.appendChild(script);
  };
