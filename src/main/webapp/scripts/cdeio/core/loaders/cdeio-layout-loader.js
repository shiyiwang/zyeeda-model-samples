// Generated by CoffeeScript 1.7.1
(function() {
  define(['underscore', 'cdeio/core/layout', 'cdeio/core/util', 'cdeio/core/resource-loader', 'cdeio/core/config'], function(_, Layout, util, loadResource, config) {
    var error;
    error = util.error;
    return {
      type: 'layout',
      name: 'cdeio',
      fn: function(module, feature, layoutName, args) {
        var deferred;
        deferred = $.Deferred();
        loadResource('cdeio/layouts/' + layoutName).done(function(def) {
          var options;
          if (!def) {
            error(this, "No layout defined with name cdeio/layouts/" + layoutName + ".");
          }
          options = _.extend({}, def, {
            el: feature.container,
            baseName: layoutName,
            feature: feature,
            module: module,
            extend: {
              getTemplateSelector: function() {
                return 'cdeio/layouts/templates/' + this.baseName + config.templateSuffix;
              },
              renderHtml: function(su, data) {
                var d, t;
                t = this.feature.template;
                delete this.feature.template;
                d = su.call(this, data);
                this.feature.template = t;
                return d;
              },
              initHandlers: function(su, handler) {
                if (this.eventHandlers == null) {
                  this.eventHandlers = {};
                }
                if (this.options.avoidLoadingHandlers === true) {
                  deferred = $.Deferred();
                  deferred.resolve({});
                  return deferred.promise();
                }
                return loadResource('cdeio/layouts/handlers/' + (handler || this.baseName)).done((function(_this) {
                  return function(handlers) {
                    if (handlers == null) {
                      handlers = {};
                    }
                    return _.extend(_this.eventHandlers, handlers);
                  };
                })(this));
              }
            }
          });
          return deferred.resolve(new Layout(options));
        });
        return deferred.promise();
      }
    };
  });

}).call(this);