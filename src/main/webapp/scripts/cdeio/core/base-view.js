// Generated by CoffeeScript 1.7.1
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  define(['marionette', 'jquery', 'underscore', 'cdeio/core/config', 'cdeio/core/component-handler', 'cdeio/core/util'], function(Marionette, $, _, config, ComponentHandler, util) {
    var BaseView, error, getPath;
    getPath = config.getPath;
    error = util.error;
    BaseView = (function(_super) {
      __extends(BaseView, _super);

      function BaseView(options) {
        var key, old, value, _ref;
        this.options = options;
        options.avoidLoadingModel = options.avoidLoadingModel === false ? false : true;
        this.promises || (this.promises = []);
        this.module = options.module;
        this.feature = options.feature;
        this.baseName = options.baseName;
        if (options.extend) {
          _ref = options.extend;
          for (key in _ref) {
            value = _ref[key];
            old = this[key];
            if (_.isFunction(value)) {
              value = _.bind(value, this, old);
            }
            this[key] = value;
          }
        }
        BaseView.__super__.constructor.call(this, options);
        this.deferHandlers = this.initHandlers(options.handlersIn);
        this.promises.push(this.deferHandlers);
      }

      BaseView.prototype.initialize = function(options) {
        var delegates, e, events, name, value, _results;
        events = options.events || {};
        if (_.isFunction(events)) {
          events = events.apply(this);
        }
        this.events = {};
        for (name in events) {
          value = events[name];
          if (this.feature.isFeatureEvent(name)) {
            this.feature.on(this, name, this.bindEventHandler(value));
          } else {
            e = this.wrapEvent(name, value);
            this.events[e.name] = e.handler;
          }
        }
        delegates = options.delegates || {};
        if (_.isFunction(delegates)) {
          delegates = delegates.apply(this);
        }
        _results = [];
        for (name in delegates) {
          value = delegates[name];
          e = this.wrapEvent(name, null);
          _results.push(this.events[e.name] = this.feature.delegateDomEvent(this, value, this.events[e.name]));
        }
        return _results;
      };

      BaseView.prototype.wrapEvent = function(name, handlerName) {
        var handler, n, parts;
        parts = name.replace(/^\s+/g, '').replace(/\s+$/, '').split(/\s+/);
        if (parts.length === 2) {
          if (parts[1].charAt(parts[1].length - 1) === '*') {
            n = parts[1].substring(0, parts[1].length - 1);
            n = this.genId(n);
            n = ' [id^="' + n + '"]';
            name = parts[0] + n;
          } else {
            name = parts[0] + ' #' + this.genId(parts[1]);
          }
        }
        if (!handlerName) {
          return {
            name: name
          };
        }
        if (!_.isFunction(handlerName)) {
          handler = this.bindEventHandler(handlerName);
        } else {
          handler = _.bind(handlerName, this);
        }
        return {
          name: name,
          handler: handler
        };
      };

      BaseView.prototype.bindEventHandler = function(name, namespace) {
        return (function(_this) {
          return function() {
            var args, fn;
            args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
            fn = function() {
              var handlers, method;
              handlers = namespace ? _this.eventHandlers[namespace] : _this.eventHandlers;
              if (!handlers) {
                error(_this, "no namespace named " + namespace);
              }
              method = handlers[name];
              if (!method) {
                error(_this, "no handler named " + name);
              }
              return method.apply(_this, args);
            };
            if (_this.options.avoidLoadingHandlers) {
              return fn();
            } else {
              return _this.deferHandlers.done(function() {
                return fn();
              });
            }
          };
        })(this);
      };

      BaseView.prototype.initHandlers = function(handler) {
        var deferred, path;
        if (this.eventHandlers == null) {
          this.eventHandlers = {};
        }
        if (this.options.avoidLoadingHandlers === true) {
          deferred = $.Deferred();
          deferred.resolve({});
          return deferred.promise();
        }
        path = getPath(this.feature, 'handler', handler || this.baseName);
        return this.module.loadResource(path).done((function(_this) {
          return function(handlers) {
            if (handlers == null) {
              handlers = {};
            }
            return _.extend(_this.eventHandlers, handlers);
          };
        })(this));
      };

      BaseView.prototype.template = function() {
        var name;
        name = this.options.template || this.baseName;
        return getPath(this.feature, 'template', name);
      };

      BaseView.prototype.getTemplateSelector = function() {
        var template;
        template = this.template;
        if (_.isFunction(template)) {
          template = template.call(this);
        }
        return this.module.resolveResoucePath(template + config.templateSuffix);
      };

      BaseView.prototype.renderHtml = function(data) {
        if (this.feature.template) {
          return this.feature.template(data);
        } else {
          return BaseView.__super__.renderHtml.call(this, data);
        }
      };

      BaseView.prototype.serializeData = function() {
        var data;
        data = BaseView.__super__.serializeData.call(this);
        data['__viewName__'] = this.baseName;
        data['__view__'] = this;
        return data;
      };

      BaseView.prototype.mixinTemplateHelpers = function(target) {
        var data;
        data = BaseView.__super__.mixinTemplateHelpers.call(this, target);
        return _.extend(data, {
          settings: this.feature.module.getApplication().settings
        });
      };

      BaseView.prototype.afterRender = function() {
        if (_.isFunction(this.options.afterRender)) {
          return this.options.afterRender.call(this);
        }
      };

      BaseView.prototype.render = function(fn) {
        var deferred;
        deferred = $.Deferred();
        $.when.apply($, this.promises).then((function(_this) {
          return function() {
            return BaseView.__super__.render.apply(_this, arguments).done(function() {
              if (_.isFunction(fn)) {
                fn();
              }
              return deferred.resolve();
            });
          };
        })(this));
        return deferred.promise();
      };

      BaseView.prototype.genId = function(id) {
        return "" + this.cid + "-" + id;
      };

      BaseView.prototype.$ = function(selector) {
        return BaseView.__super__.$.call(this, '#' + this.genId(selector));
      };

      BaseView.prototype.$$ = function(selector) {
        return this.$el.find(selector);
      };

      BaseView.prototype.findComponent = function(selector) {
        var c, o, _i, _len, _ref, _ref1;
        _ref = this.components;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          c = _ref[_i];
          if (((_ref1 = c['__options__']) != null ? _ref1.selector : void 0) === selector) {
            o = c;
          }
        }
        return o;
      };

      BaseView.prototype.renderComponents = function(delay) {
        var component, componentDeferred, components, d, el, i, options, originalOptions, selector, type, _i, _len, _ref;
        this.components || (this.components = []);
        d = delay || '';
        if (_.indexOf(this.renderredComponents, d) !== -1) {
          return;
        }
        this.renderredComponents.push(d);
        components = [];
        originalOptions = [];
        _ref = this.options.components || [];
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          component = _ref[i];
          if (_.isFunction(component)) {
            component = component.call(this);
          }
          if (!component) {
            continue;
          }
          if ((!delay && !component.delay) || (delay === component.delay)) {
            originalOptions[i] = component;
            options = _.extend({}, component);
            type = options.type, selector = options.selector;
            delete options.type;
            delete options.selector;
            el = selector ? this.$(selector) : this.$el;
            components[i] = ComponentHandler.handle(type, el, options, this);
          } else {
            originalOptions[i] = component;
            components[i] = this.components[i] || false;
          }
        }
        componentDeferred = $.Deferred();
        $.when.apply($, components).done((function(_this) {
          return function() {
            var arg, args, _j, _len1;
            args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
            _this.components = args;
            for (i = _j = 0, _len1 = args.length; _j < _len1; i = ++_j) {
              arg = args[i];
              if (!arg) {
                continue;
              }
              arg['__options__'] = originalOptions[i];
            }
            return componentDeferred.resolve(args);
          };
        })(this));
        return componentDeferred.promise();
      };

      BaseView.prototype.onRender = function() {
        var delay, delays, promises, used;
        used = {};
        this.$el.find('[id]').each((function(_this) {
          return function(i, el) {
            var $el, id;
            $el = $(el);
            id = $el.attr('id');
            if (used[id] === true) {
              error(_this, "ID: " + id + " is used twice.");
            }
            used[id] = true;
            return $el.attr('id', _this.genId(id));
          };
        })(this));
        this.$el.find('[data-target]').each((function(_this) {
          return function(i, el) {
            var $el, dt;
            $el = $(el);
            dt = $el.attr('data-target');
            if (dt.charAt(0) === '#') {
              dt = dt.substring(1);
            }
            return $el.attr('data-target', '#' + _this.genId(dt));
          };
        })(this));
        this.$el.find('[data-parent]').each((function(_this) {
          return function(i, el) {
            var $el, dt;
            $el = $(el);
            dt = $el.attr('data-parent');
            if (dt.charAt(0) === '#') {
              dt = dt.substring(1);
            }
            return $el.attr('data-parent', '#' + _this.genId(dt));
          };
        })(this));
        this.$el.find('label[for]').each((function(_this) {
          return function(i, el) {
            var $el, f;
            $el = $(el);
            f = $el.attr('for');
            return $el.attr('for', _this.genId(f));
          };
        })(this));
        this.renderredComponents = [];
        delays = this.defaultComponentDelay;
        delays = _.isArray(delays) ? delays : [delays];
        promises = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = delays.length; _i < _len; _i++) {
            delay = delays[_i];
            _results.push(this.renderComponents(delay));
          }
          return _results;
        }).call(this);
        return $.when.apply($, promises).then((function(_this) {
          return function() {
            return _this.afterRender.call(_this);
          };
        })(this)).promise();
      };

      BaseView.prototype.dispose = function() {
        var c, _i, _len, _ref;
        if (this.components) {
          _ref = this.components;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            c = _ref[_i];
            if (typeof c.dispose === "function") {
              c.dispose();
            }
          }
        }
        this.undelegateEvents();
        return this.unbindAll();
      };

      return BaseView;

    })(Marionette.ItemView);
    return BaseView;
  });

}).call(this);
