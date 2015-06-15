define([
    'jquery',
    'backbone',
    'config',
    'app/commons/export-excel.feature/export-excel-function'
], function ($, Backbone, config, exportUtil) {

    var addReturnBtn = function(feature) {
        $(".btn-group", feature.views['report-toolbar'].$el).append('<button id="statistics-report" class="btn btn-purple " onclick="app.startFeature(\'commons/statistics-report\', { ignoreExists: true });";><i class="icon-undo"></i>返回</button>');
    };

    return {
        statisticsReport: function(e) {
            var reportPermission = $(e.currentTarget).attr('reportPermission'),
                reportPath = '', reportParamsFeature, parameters = {},
                companyFeature;

            reportPath = reportPermission.split(":")[0];

            parameters = {report: reportPath};

            if (reportPath === 'commons/down-report') {
                companyFeature = app.loadFeature('archive/scaffold:company', {container: '<div></div>', ignoreExists: true});

                companyFeature.done(function(compfeature){
                    exportUtil.exportReportExcel(compfeature);
                });
            } else {
                reportParamsFeature = app.loadFeature('commons/report-params', {container: '<div></div>', ignoreExists: true});

                reportParamsFeature.done(function (reportfeature) {

                    if(config.reportParams && config.reportParams[reportPath] && config.reportParams[reportPath].paramViewName){
                        parameters.paramsView = reportfeature.views[config.reportParams[reportPath].paramViewName];
                    }

                    if(config.reportParams && config.reportParams[reportPath] && config.reportParams[reportPath].defaultParams){
                        parameters.params = config.reportParams[reportPath].defaultParams;
                    }

                    parameters.callback = addReturnBtn;

                    app.startFeature('cdeio:report', parameters).done(function(feature){
                        addReturnBtn(feature);
                    });
                });
            }
        }
    };
});
