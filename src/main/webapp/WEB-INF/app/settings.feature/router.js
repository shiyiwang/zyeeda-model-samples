var {json} = require('cdeio/response');
var {createRouter} = require('cdeio/router');
var {frontendSettings} = require('cdeio/config');

var router = exports.router = createRouter();

router.get('/', function(request) {
    var  result = {}, key, item;

    for (key in frontendSettings) {
        result[key] = frontendSettings[key];
    }
    return json(result);
});