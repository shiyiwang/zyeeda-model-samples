define([
    'jquery',
    'underscore',
    'cdeio/cdeio',
    'cdeio/applications/default',
    'cdeio/core/config',
    'cdeio/vendors/jquery/jquery.slimscroll.min',
    'cdeio/vendors/jquery/jquery.colorbox',
    'cdeio/vendors/ace-elements',
    'cdeio/vendors/ace'
], function($, _, cdeio, createDefault, config) {

    return function(options) {
        $.ajaxSetup({
            cache: false
        });

        var app, deferred = $.Deferred();

        options = _.extend(options, { useDefaultHome: false });
        app = createDefault(options);
        app.config = config;

        app.done(function() {
            if (location.hash) {
                app.startFeature('admin/viewport', { container: $(document.body), ignoreExists: true }).done(function() {
                    deferred.resolve();
                });
            } else {
                deferred.resolve();
            }
        });

        app.addPromise(deferred.promise());
        return app;
    };

});
