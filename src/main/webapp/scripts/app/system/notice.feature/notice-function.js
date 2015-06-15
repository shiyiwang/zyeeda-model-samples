(function() {
    define(['jquery', 'underscore'], function($, _) {
        return {
            callMethodPath: function (app, data) {
                var method,
                    featurePath,
                    methodPath,
                    methodFeature,
                    methodScaffold,
                    methodHandlers,
                    params = {};

                if (!_.isEmpty(data.methodPath) && (data.methodPath.indexOf(':') > 0)) {
                    methodPath = data.methodPath.substring(data.methodPath.lastIndexOf(':') + 1);
                    featurePath = data.methodPath.substring(0, data.methodPath.lastIndexOf(':'));

                    methodFeature = app.loadFeature(featurePath, {container: '<div></div>'});
                    methodFeature.done(function (feature) {
                        methodScaffold = feature.options.scaffold || {};
                        methodHandlers = methodScaffold.handlers || {};

                        method = methodHandlers[methodPath];
                        if (_.isFunction(method)) {
                            params.methodPath = data.methodPath;
                            params.sign = data.sign;
                            params.extendFiled1 = data.extendFiled1;
                            params.extendFiled2 = data.extendFiled2;
                            params.extendFiled3 = data.extendFiled3;

                            method.call(this, feature, params);
                        }
                    });

                }
            }
        };
    });
}).call(this);