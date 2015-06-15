define([
    'jquery',
    'app/commons/export-excel.feature/export-excel-function'
], function($, exportUtil) {
    return {
        downReport: function(e) {
            var companyFeature;

            companyFeature = app.loadFeature('archive/scaffold:company', {container: '<div></div>', ignoreExists: true});

            companyFeature.done(function(compfeature){
                exportUtil.exportReportExcel(compfeature);
            });
        }
    };
});
