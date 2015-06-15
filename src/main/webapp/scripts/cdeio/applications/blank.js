// Generated by CoffeeScript 1.7.1
(function() {
  define(['jquery', 'underscore', 'cdeio/cdeio', 'cdeio/core/application', 'cdeio/core/browser', 'cdeio/core/component-handler'], function($, _, cdeio, Application, detectBrowser, ComponentHandler) {
    return function(options) {
      var application;
      if (options == null) {
        options = {};
      }
      if (options.detectBrowser !== false) {
        detectBrowser();
      }
      application = new Application();
      application.addPromise(ComponentHandler.initialize());
      if (options.settingsPromise) {
        application.addPromise(options.settingsPromise);
      }
      return application;
    };
  });

}).call(this);
