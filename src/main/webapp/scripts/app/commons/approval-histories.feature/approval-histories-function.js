(function() {
    define([], function () {
        return {
            showApprovalHistories: function (me, entryId){
                var approvalHistoriesFeature, approvalHistoriesView;

                approvalHistoriesFeature = app.loadFeature('commons/approval-histories', {container: '<div></div>', ignoreExists: true});
                app.selectedDataId = entryId;
                approvalHistoriesFeature.done(function (feature) {
                    approvalHistoriesView = feature.views['approval-histories-view'];
                    app.showDialog({
                        view: approvalHistoriesView,
                        title: '查看评估记录',
                        onClose: function() {
                            feature.stop();
                        },
                        buttons: []
                    });
                });
            }
        };
    });
}).call(this);
