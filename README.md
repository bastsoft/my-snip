# snip for snippet 

This tool allows you to quickly prototype and develop a bookmarklet, aggregate snippets, and write userflow scripts.

## for bookmarklet

use [the configurator](https://bastsoft.github.io/my-snip)


## for local install

`npm i -D my-snip`


```js
  import("my-snip").then(({ default: mySnipt }) => {
    mySnipt.loadByLongPress({
      file: import("./snippets"),
      //everything below is optional
      env: { TOKEN: "" },
      onlyFromTags: ["BODY", "DIV"],
      timeout: 4000,
    });
  });
```

### use env in methods snip

```js
  "show token"({env}){
    alert(env("TOKEN"));
  },
```