# snip for snippet 

This tool allows you to quickly prototype and develop a bookmarklet, aggregate snippets, and write userflow scripts.

## for bookmarklet

use [the configurator](https://bastsoft.github.io/my-snip)

## for local install

`npm i -D my-snip`


```js
import mySnipt from "my-snip";

mySnipt.loadByLongPress({
  file: import("path-to-file")
});
```