define([
    'jquery',
    'underscore',
    'cdeio/core/loader-plugin-manager',
    'config',
    'app/process/process-taskinfo.feature/process-taskinfo-function'
], function($, _, LoaderManager, config, procTaskFuncUtil) {
    return {
        renderers: {
            modifyIsSign: function(data){
                var isSignMap = {
                    true: '是',
                    false: '否'
                };

                return isSignMap[data];
            },
            modifyBusinessType: function(cellData, param, gridData){
                var requestNo = gridData.requestNo || '';

                if(requestNo){
                    return cellData + ' (' + '<font color="green">' + requestNo + '</font>' + ')';
                }

                return cellData;
            }
        },

        handlers: {
            audit: function(){
                var me = this,
                    scaffold, handlers,
                    app = me.feature.module.getApplication(),
                    grid = me.feature.views['grid:body'].components[0],
                    selected = grid.getSelected(),
                    obj = selected.toJSON(),
                    businessName = obj.processInstance.processDefinition.businessDefinition.businessName,
                    businessMark = obj.processInstance.processDefinition.businessDefinition.businessMark,
                    businessFeaturePath = obj.processInstance.processDefinition.businessDefinition.businessFeaturePath,
                    busisessFeature = app.loadFeature(businessFeaturePath, {container: '<div></div>'}),
                    businessScaffold,
                    diyAuditFlag = false;

                    // 当前流程业务配置了自定义审批方法
                    if($.inArray(businessMark, config.diyAuditFunctionBusiMarks) !== -1){
                        diyAuditFlag = true;
                        busisessFeature.done(function (feature) {
                            businessScaffold = feature.options.scaffold || {};
                            if (_.isFunction(businessScaffold.handlers.audit)) {
                                businessScaffold.handlers.audit();
                            }
                        });
                    }

                    if(diyAuditFlag === false){
                        busisessFeature.done(function (feature) {
                            var view = feature.views['form:audit'];

                            scaffold = feature.options.scaffold || {};
                            handlers = scaffold.handlers || {};

                            feature.model.set('id', obj.processInstance.relatedEntryId);
                            feature.model.fetch().done(function(fetchData) {
                                app.showDialog({
                                    view: view,
                                    title: '处理' + businessName + '任务',
                                    onClose: function(){
                                        feature.stop();
                                    },
                                    buttons: [{
                                        label: '确定',
                                        status: 'btn-primary',
                                        fn: function() {
                                            data = view.getFormData();
                                            data.id = obj.processInstance.relatedEntryId;
                                            if(!data.flowComment){
                                                app.error('请选择审批结果');
                                                return false;
                                            }
                                            feature.request({
                                                url: 'audit',
                                                type: 'put',
                                                data: data,
                                                success: function(result) {
                                                    app.success(businessName + '审批成功');
                                                    grid.refresh();

                                                    if(result.isComplete){
                                                        if(_.isFunction(handlers.afterComplete)){
                                                            handlers.afterComplete(view, data);
                                                        }
                                                    }
                                                }
                                            });
                                        }
                                    }]
                                }).done(function() {
                                    view.setFormData(feature.model.toJSON());

                                    // line 101 - 103 弹出审核窗口之后调用相关业务js下的afterShowAuditDialog函数，参数view:审核弹出窗口所在view,fetchData:当前窗口审核的业务数据
                                    if(_.isFunction(handlers.afterShowAuditDialog)){
                                        handlers.afterShowAuditDialog(view, fetchData);
                                    }

                                    // 将审批数据页面除'审批结果'与'审批意见'外的字段设置为不可修改状态
                                    procTaskFuncUtil.afterAuditDialog(view, feature.model.toJSON(), handlers, feature);

                                    // 避免重复签收
                                    if(obj.isSign !== true){
                                        // 签收当前任务
                                        me.feature.request({
                                            url: 'sign',
                                            type: 'put',
                                            data: obj
                                        }).done(function (result){
                                            grid.refresh();
                                        });
                                    }
                                });
                            });
                        });
                    }
                return true;
            }
        }
    };
});
