(function() {
  define(["jquery", "underscore"], function ($, _) {
    return {
      avoidLoadingHandlers: true,
      size: 'large',
      extend: {
        templateHelpers: function() {
            var results = [], noTaskInfo,
                selectedDataId = app.selectedDataId;

            //根据被选中的数据ID查找审批记录
            $.ajax({
                url: 'invoke/common-routers/get-task-info-by-work-package-id',
                type: 'get',
                async: false,
                data: {selectedDataId: selectedDataId}
            }).done(function (data){

                _.each(data.results, function (element, index, list){
                    element.index = index + 1;

                    results.push(element);
                });
            });

            if (_.size(results) === 0) {
                noTaskInfo = '没有相关历史记录';
            }
            return {taskInfos: results, noTaskInfo: noTaskInfo};
        }
      }
    };
  });

}).call(this);
