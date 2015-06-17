(function() {
    define([], function () {
        return {
            showEvaluateInfo: function (me, entryId){
                var evaluateInfoFeature, evaluateInfoView;

                evaluateInfoFeature = app.loadFeature('commons/show-evaluate-info', {container: '<div></div>', ignoreExists: true});
                app.selectedDataId = entryId;
                evaluateInfoFeature.done(function (feature) {
                    evaluateInfoView = feature.views['evaluate-info-view'];
                    app.showDialog({
                        view: evaluateInfoView,
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
