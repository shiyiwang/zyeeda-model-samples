define([
    'underscore',
    'backbone',
    'config'
], function(_, Backbone, config) {
    return {
        routes: {
            '': 'showHome',
            'profile': 'showProfile',
            'feature/*name': 'showMenu',
            'report/*name': 'showReport'
        },

        showMenu: function(name) {
            this._showFeature(name);
        },

        showReport: function(name){
            var reportParamsFeature, parameters = {report: name};

            // 进入报表管理界面
            if (name === 'commons/statistics-report') {
                app.startFeature('commons/statistics-report', { ignoreExists: true });
            } else {
                reportParamsFeature = app.loadFeature('commons/report-params', {container: '<div></div>', ignoreExists: true});

                reportParamsFeature.done(function (reportfeature) {

                    if(config.reportParams && config.reportParams[name] && config.reportParams[name].paramViewName){
                        parameters.paramsView = reportfeature.views[config.reportParams[name].paramViewName];
                    }

                    if(config.reportParams && config.reportParams[name] && config.reportParams[name].defaultParams){
                        parameters.params = config.reportParams[name].defaultParams;
                    }

                    app.startFeature('cdeio:report', parameters);
                });
            }

            this._activateMenu(location.hash);
        },

        showHome: function() {
            return app.startFeature('admin/viewport', { container: $(document.body), ignoreExists: true }).done(function () {
                var accountMenufeature = app.admin.findFeature('account-menu'),
                    taskView = accountMenufeature.views['inline:tasks'],
                    noticeView = accountMenufeature.views['inline:notices'];

                if (location.hash) {
                    return;
                }
                // 默认进入我的待办界面
                Backbone.history.navigate('feature/work/scaffold:todo-info', { trigger: true });
                /*Backbone.history.navigate('feature/system/home', { trigger: true });*/

                setInterval(function () {
                    taskView.render();
                    noticeView.render();
                }, 60000);

            });
        },

        showProfile: function() {
            app.startFeature('profile/viewport', { container: $(document.body), ignoreExists: true });
        },

        _showFeature: function(featurePath) {
            var show = _.bind(function() {
                app.startFeature(featurePath, { ignoreExists: true });
                this._activateMenu(location.hash);
            }, this);

            if (app.viewport.module.baseName !== 'admin') {
                this.showHome().done(show);
                return;
            }

            show();
        },

        _activateMenu: function(hash) {
            var menuItem = app.menuFeature.activateMenu(hash);
            if (menuItem) {
                app.viewport.updateNavigator(menuItem);
            }
        }

    };
});
