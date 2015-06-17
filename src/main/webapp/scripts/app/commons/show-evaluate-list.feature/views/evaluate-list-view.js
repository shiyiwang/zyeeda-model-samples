(function() {
    define(["jquery", "underscore"], function($, _) {
        return {
            avoidLoadingHandlers: true,
            size: 'large',
            extend: {
                templateHelpers: function() {
                    var results = [],
                        noEvaluateList,
                        selectedDataId = app.selectedDataId;

                    //根据被选中的数据ID查找
                    $.ajax({
                        url: 'invoke/common-routers/get-evaluate-list-by-work-package-id',
                        type: 'get',
                        async: false,
                        data: {
                            selectedDataId: selectedDataId
                        }
                    }).done(function(data) {
                        _.each(data.results, function(element, index, list) {
                            element.index = index + 1;
                            results.push(element);
                        });
                    });

                    if (_.size(results) === 0) {
                        noEvaluateList = '没有相关评估信息！';
                    }

                    return {
                        evaluateLists: results,
                        noEvaluateList: noEvaluateList
                    };
                }
            }
        };
    });
}).call(this);
