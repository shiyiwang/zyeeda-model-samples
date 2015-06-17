(function() {
    define([], function () {
        return {
            showTaskInfo: function (me, entryId){
                var taskInfoFeature, taskInfoView;

                taskInfoFeature = app.loadFeature('commons/show-task-info', {container: '<div></div>', ignoreExists: true});
                app.selectedDataId = entryId;
                taskInfoFeature.done(function (feature) {
                    taskInfoView = feature.views['show-task-info-view'];
                    app.showDialog({
                        view: taskInfoView,
                        title: '查看任务分配和进度记录',
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
