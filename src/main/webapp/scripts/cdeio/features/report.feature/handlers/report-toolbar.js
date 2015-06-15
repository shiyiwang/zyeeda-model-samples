// Generated by CoffeeScript 1.7.1
(function() {
  define(['jquery'], function($) {
    return {
      birt_toolbar_click: function(e) {
        if (window.frames[0] && window.frames[0].BirtToolbar) {
          return window.frames[0].BirtToolbar.prototype.__neh_click(e);
        } else {
          return app.error('报表服务运行错误，请联系管理员!');
        }
      },
      birt_parameter_click: function(e) {
        var view;
        if (this.feature.startupOptions.paramsView) {
          view = this.feature.startupOptions.paramsView;
          return app.showDialog({
            view: view,
            title: '参数设置',
            buttons: [
              {
                label: '确定',
                status: 'btn-primary',
                fn: (function(_this) {
                  return function() {
                    if (!view.isValid()) {
                      return false;
                    }
                    return app.startFeature('cdeio:report', {
                      report: _this.feature.startupOptions.report,
                      params: view.getFormData(),
                      paramsView: view,
                      callback: _this.feature.startupOptions.callback
                    }).done(function(feature) {
                      var callback;
                      callback = feature.startupOptions.callback;
                      if ($.isFunction(callback)) {
                        return callback.call(feature, feature);
                      }
                    });
                  };
                })(this)
              }
            ]
          });
        } else {
          if (window.frames[0] && window.frames[0].BirtToolbar) {
            return window.frames[0].BirtToolbar.prototype.__neh_click(e);
          } else {
            return app.error('报表服务运行错误，请联系管理员!');
          }
        }
      }
    };
  });

}).call(this);
