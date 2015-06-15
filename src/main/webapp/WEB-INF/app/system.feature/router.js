var {template} = require('cdeio/response');
var {createRouter} = require('cdeio/router');
var {createManager} = require('cdeio/manager');

var router = exports.router = createRouter();

router.get('/rebuild-index', function(request){
    var manager = createManager();
    manager.rebuildIndexes();
    return template('system.feature/templates/rebuildIndexes-success.html');
});
