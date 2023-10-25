import getDefaultApi from "./api-default.js";
import createApiProperty from "./test-api-generator.js";

function mount(element, logger) {
  const api =  getDefaultApi(logger);

  return createApiProperty( 
  element,
  {
    initEl: api.initEl,
    then: api.then,
    
    locator(selector){
      return api.get(selector);
    },
    click: (selectorOrObject) =>{
      if(typeof(selectorOrObject) === "string"){
        return api.get(selectorOrObject).then(()=>api.click());
      }

      if((selectorOrObject||{}).button === "right"){
        return api.rightclick();
      }
      
      return api.click();
    },
    fill: (selectorOrText, text)=>{
      if(selectorOrText && text){
        return api.get(selectorOrText).then(()=>api.type(text));
      }

      return api.type(selectorOrText);
    },
    type:(text)=>{
      return api.type(text);
    },
    hover:()=>{
      return api.trigger("mouseover")
    }
  }
)
};

export default {mount};