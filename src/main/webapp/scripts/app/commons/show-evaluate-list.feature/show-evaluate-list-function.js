(function() {
    define([], function() {
        return {
            showEvaluateList: function(me, entryId) {
                var evaluateListFeature, evaluateListView;

                evaluateListFeature = app.loadFeature('commons/show-evaluate-list', {
                    container: '<div></div>',
                    ignoreExists: true
                });
                app.selectedDataId = entryId;
                evaluateListFeature.done(function(feature) {
                    evaluateListView = feature.views['evaluate-list-view'];
                    app.showDialog({
                        view: evaluateListView,
                        title: '查看评估信息',
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
