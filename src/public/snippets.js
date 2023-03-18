const snippets = {
	step1() {
    alert("step1");
	},
	step2() {
		alert("step2");
	},
  step3:{
    'deep1'() {
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
    'test cy'() {
      cy.log("test cy");
      cy.wait(5000);
      cy.log("wait 5 sec");
      cy.then(()=>{
        console.log("done!");
      });
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