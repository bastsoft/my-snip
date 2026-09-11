import getDefaultApi from "./api-default.js";
import createApiProperty from "./test-api-generator.js";

function mount(element, logger={log(){}}) {
  const api =  getDefaultApi(logger);

  return createApiProperty( 
  element,
  {
    initEl: api.initEl,
    then: api.then,
    
    locator(selector, options){
      if(options && options.hasText){
        return api.contains(selector, options.hasText, options);
      }

      return api.get(selector, options);
    },
    waitFor:(selectorOrOptions, options)=>{
      if(typeof selectorOrOptions === "string"){
        return api.get(selectorOrOptions, options);
      }

      // locator.waitFor({ state: 'visible' }) — ждём текущий элемент
      return api.then(() => {});
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
    focus:()=>{
      return api.focus();
    },
    waitForTimeout:(ms)=>{
      return api.wait(ms);
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
    },
    getByText:(text)=>{
      return {
        text,
        find(){
          const body = element.body || element;
          const all = [...body.querySelectorAll("*")];
          return all.filter((el) => {
            const elText = (el.innerText || "").trim();
            return elText.indexOf(text) > -1;
          });
        },
      };
    },
    first(){
      return api.first();
    },
    innerText(){
      return api.innerText();
    },
    evaluate(fn, arg){
      return api.evaluate(fn, arg);
    }
  }
)
};

export default {mount};