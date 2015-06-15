(function() {
    define(['jquery', 'underscore', 'app/commons/approval-histories.feature/approval-histories-function'], function ($, _, approvalHistoriesUtil) {
        return {
            afterShowAuditDialog: function(view) {
                var inputs, textareas;

                inputs = $('input[name]', view.$el);
                $.each(inputs, function(i, v) {
                    if('radio' === $(v).attr('type') || 'checkbox' === $(v).attr('type')){
                        return true;
                    }else{
                        $(v).attr('disabled', true);
                    }
                });

                textareas = $('textarea[name]', view.$el);
                $.each(textareas, function(i, v) {
                    $(v).attr('readOnly', true);
                });

                _.each(view.components, function (v, i) {
                    $('#trigger-' + v.id, view.$el).unbind().attr('disabled', true);
                });
            },
            showApprovalHistories: function (me, data, param, gridData) {
                var showApproHis, flowStatusMap, html, id;

                showApproHis = function(id){
                    approvalHistoriesUtil.showApprovalHistories(me, id);
                };
                window.showApproHis = showApproHis;

                html = '<a href="javascript:void(0)" onclick="showApproHis(\'' + gridData.id + '\');"> ';

                flowStatusMap = {
                    '1': '未评估',
                    '2': html + '评估中</a>',
                    '3': html + '已评估</a>',
                    '4': html + '已分配</a>'
                };

                return flowStatusMap[data] || html + '评估中</a>';
            }
        };
    });
}).call(this);
