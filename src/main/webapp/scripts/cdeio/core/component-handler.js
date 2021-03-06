// Generated by CoffeeScript 1.7.1
(function() {
  define(['underscore', 'cdeio/core/resource-loader', 'cdeio/core/util'], function(_, loadResource, util) {
    var ComponentHandler, error;
    error = util.error;
    ComponentHandler = {
      initializers: [],
      handlers: {},
      promises: [],
      register: function(name, initializer, handler) {
        if (_.isString(initializer)) {
          initializer = _.bind(function(path) {
            return this.promises.push(loadResource(path));
          }, this, initializer);
        }
        this.initializers.push(initializer);
        this.handlers[name] = handler;
        return this;
      },
      initialize: function() {
        var initializer, promises, _i, _len, _ref;
        promises = [];
        _ref = this.initializers;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          initializer = _ref[_i];
          promises.push(initializer());
        }
        return this.deferred = $.when.apply($, this.promises);
      },
      done: function(fn) {
        if (!this.deferred) {
          this.initialize();
        }
        return this.deferred.done(fn);
      },
      defaultHandler: function(name, $el, options, view) {
        if (!$el[name]) {
          error(view, "No component handler for type: " + name + ".");
        }
        return $el[name](options);
      },
      handle: function(name, $el, options, view) {
        var handler;
        if (options == null) {
          options = {};
        }
        handler = this.handlers[name];
        if (handler) {
          return handler($el, options, view);
        } else {
          return this.defaultHandler(name, $el, options, view);
        }
      }
    };
    return ComponentHandler;
  });

}).call(this);
