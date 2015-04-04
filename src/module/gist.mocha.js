(function () {
    describe('loadGist', function () {
        describe('_loadGistFromId', function () {
            it('без api в url должна использовать _loadGistFromJSONP', function (done) {
                var proxy = btr.loadGist._loadGistFromJSONP.bind(null);
                btr.loadGist._loadGistFromJSONP = function () {
                    done();
                };
                btr.loadGist.bind({})({
                    url: 'http://urlTest/',
                    id: 'idTest'
                });
                btr.loadGist._loadGistFromJSONP = proxy.bind(btr.loadGist);
            });
            it('c api в url должна использовать _loadGistFromAPI', function (done) {
                var proxy = btr.loadGist._loadGistFromAPI.bind(null);
                btr.loadGist._loadGistFromAPI = function () {
                    done();
                };
                btr.loadGist.bind({})({
                    url: 'http://api.urlTest/',
                    id: 'idTest'
                });
                btr.loadGist._loadGistFromAPI = proxy.bind(btr.loadGist);
            });
        });
    });
}());
