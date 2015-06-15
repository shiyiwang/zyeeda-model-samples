// Generated by CoffeeScript 1.7.1
(function() {
  define(['jquery', 'underscore', 'cdeio/core/util', 'cdeio/core/config'], function($, _, util, config) {
    var error, helperPath, log;
    log = util.log, error = util.error;
    helperPath = config.helperPath || '';
    if (config.noBackend === true) {
      require.s.contexts._.config.urlArgs = config.development ? '_c=' + (new Date()).getTime() : '';
    } else {
      $.get(helperPath + '/development', function(data) {
        config.development = data === 'false' ? false : true;
        return require.s.contexts._.config.urlArgs = config.development ? '_c=' + (new Date()).getTime() : '';
      });
    }
    return function(resource, plugin) {
      var deferred, load, path;
      deferred = $.Deferred();
      path = plugin ? plugin + '!' + resource : resource;
      load = (function(_this) {
        return function(path) {
          return require([path], function(result) {
            return deferred.resolve(result);
          }, function(err) {
            var failedId;
            failedId = err.requireModules && err.requireModules[0];
            if (failedId === path) {
              require.undef(path);
              define(path, null);
              require([path], function() {});
              return deferred.resolve(null);
            } else {
              deferred.reject(null);
              throw err;
            }
          });
        };
      })(this);
      log({
        baseName: 'resource-loader'
      }, 'load resource: ', path);
      load(path);
      return deferred.promise();
    };
  });

}).call(this);