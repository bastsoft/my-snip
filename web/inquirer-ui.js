export default {
    _elemId: null,
    _resolveCallback: null,
    _answers:null,
    
    prompt: function(promptsArray){
      this._answers = {};
      
      if(promptsArray[0].type === "list"){
        this._createList(promptsArray[0]);
      }
      
      return new Promise((resolve, reject) => {
      try {
        this._resolveCallback = resolve;
      }
      catch (err) {
        reject(err);
      }
    });
    },
    
    _createList(listObj){
      const menu = document.createElement('ul');
      
      this._answers = {}; 
      this._resolveCallback = null;
      this._elemId = Math.random().toString().split(".")[1];
      
      menu.setAttribute('id', this._elemId);
      menu.setAttribute('style', '\
          z-index: 2147483000;\
          position:fixed;\
          list-style-type:none;\
          margin:0;\
          padding: 0;\
          font-family: monospace;\
          font-size: 14px;\
          cursor: pointer;\
          top: 0;\
          left: 0;\
      ');
      
      listObj.choices.forEach((answer)=>{
        const menuitem = document.createElement('li');
        
        menuitem.innerHTML = answer;
        
        menuitem.setAttribute('style', '\
          background: #eee;\
          padding: 10px;\
        ');
        menuitem.setAttribute('onmouseover', 'this.style.backgroundColor="#555";');
        menuitem.setAttribute('onmouseout', 'this.style.backgroundColor="#eee";');
        
        menuitem.addEventListener("click", ()=>{
            this._removeMenuById(this._elemId);
              
            if(this._resolveCallback ){
              this._answers[listObj.name] = answer;
              this._resolveCallback(this._answers);
              this._resolveCallback = null;
            }
         }, false);
        menu.appendChild(menuitem);
      });
      
      document.body.appendChild(menu);
    },
    
    _removeMenuById(id){
      const elem = document.getElementById(id);
      
      elem.parentNode.removeChild(elem);
    }
  }
  