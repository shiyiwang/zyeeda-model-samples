define([
    'jquery',
    'underscore',
    'cdeio/core/loader-plugin-manager',
    'config',
    'app/process/approval-history.feature/approval-history-function'
], function($, _, LoaderManager, config, apprHisFuncUtil) {
    return {
        renderers: {
            modifyBusinessType: function(cellData, param, gridData){
                var requestNo = gridData.processTaskInfo.requestNo || '';

                if(requestNo){
                    return cellData + ' (' + '<font color="green">' + requestNo + '</font>' + ')';
                }

                return cellData;
            }
        },
        handlers: {
            show: function(){
                var me = this,
                    app = me.feature.module.getApplication(),
                    grid = me.feature.views['grid:body'].components[0],
                    selected = grid.getSelected(),
                    obj = selected.toJSON(),
                    businessName = obj.businessDefinition.businessName,
                    businessMark = obj.businessDefinition.businessMark,
                    businessFeaturePath = obj.businessDefinition.businessFeaturePath,
                    busisessFeature = app.loadFeature(businessFeaturePath, {container: '<div></div>'}),
                    diyAuditFlag = false;

                // 当前流程业务配置了自定义审批函数时也调用自定义查看已办任务函数
                if($.inArray(businessMark, config.diyAuditFunctionBusiMarks) !== -1){
                    diyAuditFlag = true;
                    busisessFeature.done(function (feature) {
                        businessScaffold = feature.options.scaffold || {};
                        if (_.isFunction(businessScaffold.handlers.showAuditHistory)) {
                            businessScaffold.handlers.showAuditHistory();
                        }
                    });
                    return true;
                }

                if(diyAuditFlag === false){
                    busisessFeature.done(function(feature) {
                        var view = feature.views['form:audit'];
                        feature.model.set('id', obj.relatedEntryId);
                        feature.model.fetch().done(function(fetchData) {
                            app.showDialog({
                                view: view,
                                title: '查看' + businessName + '已办信息',
                                onClose: function() {
                                    feature.stop();
                                },
                                buttons: []
                            }).done(function() {
                                feature.model.set('flowComment', obj.comment);
                                feature.model.set('flowSuggestion', obj.suggestion);

                                view.setFormData(feature.model.toJSON());

                                // 设置扩展字段的值
                                $('input[name="extendFiled1"]', view.$el).val(obj.processTaskInfo.extendFiled1);
                                $('input[name="extendFiled2"]', view.$el).val(obj.processTaskInfo.extendFiled2);
                                $('input[name="extendFiled3"]', view.$el).val(obj.processTaskInfo.extendFiled3);

                                // line 67 - 72 弹出审核窗口之后调用相关业务js下的afterShowAuditDialog函数，参数view:审核弹出窗口所在view,fetchData:当前窗口审核的业务数据
                                scaffold = feature.options.scaffold || {};
                                handlers = scaffold.handlers || {};

                                if(_.isFunction(handlers.afterShowAuditDialog)){
                                    handlers.afterShowAuditDialog(view, fetchData);
                                }

                                // 查看审批数据页面所有字段设置为不可修改状态
                                apprHisFuncUtil.afterShowAuditDialog(view);
                            });
                        });
                    });
                }
            }
        }
    };
});
