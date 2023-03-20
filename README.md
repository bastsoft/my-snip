# snip for snippet 


## Simplest example

```js
javascript:(function(){var el = document.createElement('script');
    el.onload = function (){
        snip.loadGist({ id: "7c314e6ce97b044a8305f0daa3ffe0f0", file: "snippets.js" });
    };
document.head.appendChild(el).src = 'https://cdn.jsdelivr.net/gh/bastsoft/snip@1.1.2/dist/snip.js';})();
```

## for local test

`serve ./dist`

```js
javascript:(function(){var el = document.createElement('script');
    el.onload = function (){
        snip.loadGist({ id: "7c314e6ce97b044a8305f0daa3ffe0f0", file: "snippets.js" });
    };
document.head.appendChild(el).src = 'http://localhost:3000/snip.js';})();
```

