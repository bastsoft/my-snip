# BTR - browser task runner


## Simplest example

```js
javascript:(function(){var el = document.createElement('script');
    el.onload = function (){
        btr.loadGist({ id: "53fcccad851615ec4aa744c05b4d5dd0", file: "load.js" });
    };
document.head.appendChild(el).src = 'https://cdn.jsdelivr.net/gh/bastsoft/btr@v0.3.2/dist/btr.js';})();
```