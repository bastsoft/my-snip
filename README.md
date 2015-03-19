# BTR - browser task runner

[![Code Climate](https://codeclimate.com/github/bastsoft/btr.png)](https://codeclimate.com/github/bastsoft/btr)

## Installation

```js
javascript:(function(){
    var el=document.createElement('script');
    el.onload = function(){ush.gist().getLoadGist('GIST_ID', function(getThisGist){
        getThisGist('GIST_FILE')();
    })};
    document.head.appendChild(el).src='https://cdn.rawgit.com/bastsoft/UserSHelper/b8df7369da24c2a26de3178e2b10990190f547d4/ush.min.js';
})();
```

see tasks example:

[https://gist.github.com/bastsoft/5ec0eb5d78fbcb6715c3](https://gist.github.com/bastsoft/5ec0eb5d78fbcb6715c3)
