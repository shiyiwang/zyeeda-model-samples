(function() {
  define(["jquery", "underscore"], function ($, _) {
    return {
      avoidLoadingHandlers: true,
      size: 'large',
      extend: {
        templateHelpers: function() {
            var results = [], noApprovalHistory,
                commentMap = {
                    '1': '未评估',
                    '2': '已评估'
                },
                selectedDataId = app.selectedDataId;

            //根据被选中的数据ID查找审批记录
            $.ajax({
                url: 'invoke/common-routers/get-todo-info-by-work-package-id',
                type: 'get',
                async: false,
                data: {selectedDataId: selectedDataId}
            }).done(function (data){

                _.each(data.results, function (element, index, list){
                    element.index = index + 1;
                    if (element.status == '3'){
                        element.status = '已评估';
                    }else {
                        element.status = '未评估';
                    }
                    results.push(element);
                });
            });

            if (_.size(results) === 0) {
                noApprovalHistory = '没有相关历史记录';
            }
            return {approvalHistorys: results, noApprovalHistory: noApprovalHistory};
        }
      }
    };
  });

}).call(this);
