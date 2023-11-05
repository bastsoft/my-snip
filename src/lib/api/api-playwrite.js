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
    check(){
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
      return api.trigger("mouseover");
    },
    selectOption:(valueOrTextorIndex)=>{
      return api.select(valueOrTextorIndex);
    },
    getByTestId:(id)=>{
      return api.get(`[data-testid="${id}"]`)
    },
    getByLabel: async(label)=>{
      const elArrAttrLabel = await api.get(`[aria-label="${label}"]`, {timeout:10});

      if(elArrAttrLabel[0]){
        return elArrAttrLabel;
      }

      api.initEl(element);
      const elArrLabel = await api.contains('label', label, {timeout:10});

      const forAttr = elArrLabel[0] && elArrLabel[0].getAttribute('for');

      if(forAttr){
        api.initEl(element);
        return api.get(`#${forAttr}`);
      }
    },
    getByRole:(selector, options)=>{
      if(options.name){
        return api.contains(selector, options.name)
      }
    }
  }
)
};

export default {mount};