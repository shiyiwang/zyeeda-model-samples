// Generated by CoffeeScript 1.7.1
(function() {
  var __slice = [].slice;

  define(['underscore'], function(_) {
    var LoaderPluginManager;
    LoaderPluginManager = {
      pluginHandlers: {},
      key: function(type, name) {
        return type + '#' + name;
      },
      register: function(type, name, fn) {
        if (name == null) {
          name = 'DEFAULT';
        }
        if (!type) {
          throw new Error('Must specify a plugin type.');
        }
        if (_.isObject(type)) {
          this.register(type.type, type.name, type.fn);
          return this;
        }
        this.pluginHandlers[this.key(type, name)] = fn;
        return this;
      },
      invoke: function() {
        var args, feature, fn, module, name, pluginName, type;
        type = arguments[0], module = arguments[1], feature = arguments[2], name = arguments[3], args = 5 <= arguments.length ? __slice.call(arguments, 4) : [];
        if (!type) {
          throw new Error('Must specify a plugin type.');
        }
        if (_.isObject(name)) {
          args.unshift(name);
          name = name.name || '';
        }
        if (name.indexOf(':') === -1) {
          pluginName = 'DEFAULT';
        } else {
          pluginName = name.split(':')[0];
          name = name.substring(name.indexOf(':') + 1);
        }
        fn = this.pluginHandlers[this.key(type, pluginName)];
        if (!fn) {
          throw new Error("No plugin with key " + type + "#" + pluginName + ".");
        }
        return fn.call(this, module, feature, name, args);
      }
    };
    return LoaderPluginManager;
  });

}).call(this);
