export default function(fetchjsonp, document, gistId){
    return fetchjsonp('https://gist.github.com/' + gistId + '.json').then(data=>{
        var files = {};
        var el = document.createElement('div');
        el.innerHTML = data.div;
  
        var gistFiles = el.querySelectorAll('.gist-file .gist-data .file');
  
        for (var i = 0; i < gistFiles.length; i++) {
            var fileName = data.files[i];
            files[fileName] = {
              html: gistFiles[i].outerHTML,
              text: gistFiles[i].textContent,
            };
        }

        return files;
    });
}