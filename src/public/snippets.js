/*
javascript:(function(){
    var el = document.createElement('script');    
    el.onload = function (){
        snip({"url":window.location.origin  + "/src/public/snippets.js?" + Math.random(),"env":{"TOKEN":""}});  
    };
document.head.appendChild(el).src = window.location.origin  + "/dist/snip.js";
})();

*/


const snippets = {
  'test cy'({cy}) {
    cy.log("test cy");
    cy.wait(1000);
    cy.log("wait 1 sec").then(async ()=>{
      console.log("done 1");
    });
    cy.then(async ()=>{
      console.log("done 2");
    });
  },
	"test cy then"({cy}) {
    cy.get("body").then(async ($element) => {
        cy.log("test1");
        return  await new Promise((resolve) => setTimeout(()=>{
          cy.log("test2");
          resolve();
        }, 5000));
      });
      cy.log("test3");
      cy.wait(5000);
      cy.log("wait 5 sec").then(async ()=>{
        console.log("done 1");
      });
      cy.then(async ()=>{
        console.log("done 2");
      });
  },
	swapi({cy}) {
    cy.log("--start");
    cy.get("body").then(async ($element) => {
        cy.log("--fetch");
        return fetch("https://swapi.dev/api/people/1/ ")
      .then((res) => res.json())
      .then((res) => {
        cy.log(res);
      });
    });
		cy.log("--end");
	},
  env({env}){
    //console.log(env().TOKEN);
    console.log(env("TOKEN"));
  },
  step3:{
    'deep0':function(){
      this['deep1']();
      this['deep2']();
    },
    'deep1':() => {
      alert("deep1");
    },
    'deep2'() {
      alert("deep2");
    },
    'deep3'() {
      alert("deep3");
    },
  },
  step4:{
    'test'() {
		  alert("test");
    },
    stepNext:{
      step4() {
        alert("step4");
      },
      step5: {
        step6() {
          alert("step6");
        },
      }
    }
  }
};

export default snippets;