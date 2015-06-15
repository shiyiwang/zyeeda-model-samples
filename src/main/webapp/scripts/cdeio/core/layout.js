// Generated by CoffeeScript 1.7.1
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['marionette', 'cdeio/core/base-view', 'cdeio/core/config'], function(Marionette, BaseView, config) {
    var Layout, getPath;
    getPath = config.getPath;
    Layout = (function(_super) {
      __extends(Layout, _super);

      function Layout(options) {
        this.options = options;
        options.avoidLoadingHandlers = options.avoidLoadingHandlers === false ? false : true;
        this.feature = options.feature;
        this.vent = new Marionette.EventAggregator();
        this.regions = options.regions || {};
        Layout.__super__.constructor.call(this, options);
        this.regionManagers = {};
      }

      Layout.prototype.render = function() {
        this.initializeRegions();
        return Layout.__super__.render.apply(this, arguments);
      };

      Layout.prototype.serializeData = function() {
        var data;
        data = Layout.__super__.serializeData.call(this);
        data['__layout__'] = true;
        return data;
      };

      Layout.prototype.initializeRegions = Marionette.Layout.prototype.initializeRegions;

      Layout.prototype.closeRegions = Marionette.Layout.prototype.closeRegions;

      Layout.prototype.close = Marionette.Layout.prototype.close;

      return Layout;

    })(BaseView);
    Marionette.Region.prototype.show = function(view, appendMethod) {
      this.ensureEl();
      this.close();
      view.setElement(this.$el);
      this.open(view, 'size');
      return this.currentView = view;
    };
    return Layout;
  });

}).call(this);