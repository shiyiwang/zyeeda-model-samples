(function() {
    define(['jquery', 'underscore'], function($, _) {
        return {
            afterAuditDialog: function(view, data, handlers, feature) {
                var inputs, textareas, callback;

                inputs = $('input[name]', view.$el);
                $.each(inputs, function(i, v) {
                    if ('flowComment' === $(v).attr('name') || 'radio' === $(v).attr('type') || 'checkbox' === $(v).attr('type')) {
                        return true;
                    } else {
                        $(v).attr('disabled', true);
                    }
                });

                textareas = $('textarea[name]', view.$el);
                $.each(textareas, function(i, v) {
                    if ('flowSuggestion' === $(v).attr('name')) {
                        return true;
                    } else {
                        $(v).attr('readOnly', true);
                    }
                });

                _.each(view.components, function (v, i) {
                    if(v.chooser){
                        $('#trigger-' + v.id, view.$el).unbind().attr('disabled', true);
                    }
                });
            },
            retrieve: function(me){
                var grid, selected, obj, feature;

                feature = me.feature;
                grid = me.feature.views['grid:body'].components[0];
                selected = grid.getSelected();

                if (!selected) {
                    return app.info('请选择要操作的记录');
                }

                obj = selected.toJSON();

                //流程状态（-2 : 审批完成, -1: 退回, 空或0: 初始, 其它: 审批中）
                if (null === obj.flowStatus || '' === obj.flowStatus || '-2' === obj.flowStatus || '-1' === obj.flowStatus || '0' === obj.flowStatus) {
                    app.error('请选择状态为审批中的记录');
                    return false;
                }

                app.confirm('确定要取回选中的记录吗?', function(confirmed) {
                    if (confirmed) {
                        feature.request({
                            url: 'retrieve',
                            type: 'put',
                            data: {id: obj.id}
                        }).done(function (result){
                            if(result.flag === false){
                                app.error('流程已签收，不可取回');
                                return false;
                            }
                            grid.refresh();
                            app.success('取回操作成功');
                        });
                    }
                });
            },
            sendProcess: function(me){
                var grid = me.feature.views['grid:body'].components[0],
                    dataArray = grid.getSelected(),
                    data,
                    businessName = '计量台账设备',
                    sendFlag = true;

                app.confirm('确定要上报选中的记录吗?', function(confirmed) {
                    if (confirmed) {
                        _.each(dataArray, function(v, i){
                            data = v.toJSON();

                            // 流程状态（-2 : 审批完成, -1: 退回, 空或0: 初始, 其它: 审批中）
                            if (null !== data.flowStatus && '' !== data.flowStatus && '0' !== data.flowStatus && '-1' !== data.flowStatus) {
                                sendFlag = false;
                            } else {
                                data.businessFeaturePath = me.feature.module.baseName + '/scaffold:' + me.feature.baseName;

                                me.feature.request({
                                    url: 'send-process',
                                    type: 'post',
                                    data: data
                                });
                            }
                        });

                        if(sendFlag === false){
                            app.error('有部分记录未上报成功，请选择状态为初始或退回的记录');
                        }else{
                            grid.refresh();
                            app.success(businessName + '上报成功');
                        }
                    }
                });
            }
        };
    });
}).call(this);
