// Generated by CoffeeScript 1.7.1
(function() {
  define({
    layout: {
      regions: {
        breadcrumbs: 'breadcrumbs'
      }
    },
    views: [
      {
        name: 'inline:breadcrumbs',
        region: 'breadcrumbs',
        avoidLoadingHandlers: true,
        extend: {
          serializeData: function(_super) {
            var data;
            data = _super.apply(this) || {};
            data.home = this.home;
            data.items = this.items;
            return data;
          }
        }
      }
    ],
    extend: {
      onStart: function(_super) {
        var content, d, d1, d2, header, sidebar;
        d = $.Deferred();
        d1 = void 0;
        app.viewport = this;
        header = this.layout.$('header');
        sidebar = this.layout.$('sidebar');
        content = this.layout.$('content');
        app.startFeature('cdeio:header', {
          container: header,
          ignoreExists: true
        }).done(function(headerFeature) {
          return d1 = app.startFeature('cdeio:account-menu', {
            container: headerFeature.views['inline:inner-header'].$('notification'),
            ignoreExists: true
          });
        });
        d2 = app.startFeature('cdeio:menu', {
          container: sidebar,
          ignoreExists: true
        }).done(function(feature) {
          return app.menuFeature = feature;
        });
        app.config.featureContainer = content;
        this.setHome({
          name: '首页',
          featurePath: 'main/home',
          iconClass: 'icon-home'
        });
        this.updateNavigator();
        $.when(d1, d2).then(function() {
          return d.resolve();
        });
        return d.promise();
      },
      onStop: function(_super) {
        var cdeioFeatures;
        cdeioFeatures = app['cdeio-features'];
        app.menuFeature.stop();
        cdeioFeatures.findFeature('header').stop();
        return cdeioFeatures.findFeature('account-menu').stop();
      },
      setHome: function(_super, home) {
        return this.views['inline:breadcrumbs'].home = home;
      },
      updateNavigator: function(_super, menuItem) {
        var menu, v;
        v = this.views['inline:breadcrumbs'];
        if (menuItem) {
          menu = menuItem.toJSON();
        }
        v.home.isLast = !menuItem;
        v.items = [];
        while (menu) {
          v.items.unshift(menu);
          menu = menu.parent;
        }
        if (v.items.length > 0) {
          v.items[v.items.length - 1].isLast = true;
        }
        return v.render();
      }
    }
  });

}).call(this);
