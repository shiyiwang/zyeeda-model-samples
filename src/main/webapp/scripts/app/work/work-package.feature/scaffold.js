define([
    'jquery',
    'cdeio/core/loader-plugin-manager',
    'app/commons/show-evaluate-info.feature/show-evaluate-info-function',
    'app/commons/show-task-info.feature/show-task-info-function'
], function ($, LoaderManager, showEvaluateInfoUtil, showTaskInfoUtil) {
    return {
        beforeShowDialog: function(dialogType, v){
            var me = this;
            //打开编辑页面前验证
            if('edit' === dialogType){
                var grid = me.feature.views['grid:body'].components[0],
                    data = grid.getSelected().toJSON();
                //状态（1：未评估，2：评估中，3：已评估，4：已分配）
                if(data.status && '1' !== data.status) {
                    app.error('请选择状态为未评估的记录！');
                    return false;
                }
            }

            return true;
        },
        afterShowDialog: function(dialogType, v, data){
            var me = this;
            if ('edit' === dialogType) {
                //编辑页面工作包编号设置为只读
                $('input[name="code"]', v.$el).attr('disabled', true);
            }else if ('show' === dialogType) {
                var todoInfo = null, key, allPass = true;

                // for (key in data.todoInfos){
                //     todoInfo = data.todoInfos[key];
                //     if (todoInfo.status !== '3'){
                //         allPass = false;
                //     }
                // }

                // if (null == data.evaluateInfos || data.evaluateInfos.length === 0 || allPass == false) {
                //     tabs = v.options.tabs || [];
                //     $.each(tabs, function(i, vv) {
                //         if ("评估信息" === vv.title){
                //             v.$(vv.id).html('没有相关数据');
                //         }
                //     });
                // }
                if (null == data.taskInfos || data.taskInfos.length === 0) {
                    tabs = v.options.tabs || [];
                    $.each(tabs, function(i, vv) {
                        if ("负责人" === vv.title){
                            v.$(vv.id).html('没有相关数据！');
                        }
                    });
                }
            }
        },
        renderers: {
            modifyPackageName: function(data) {
                if (null == data || null == data.name){
                    return "无";
                }
                return data.name;
            },
            modifyModel: function(data) {
                var modelMap = {
                        '1' : '模块1',
                        '2' : '模块2',
                        '3' : '模块3'
                    };
                return modelMap[data];
            },
            modifyStatus: function(data, param, gridData){
                var showEvaluateInfo, showTaskInfo, flowStatusMap, id, me = this;

                showEvaluateInfo = function(id){
                    showEvaluateInfoUtil.showEvaluateInfo(me, id);
                };
                showTaskInfo = function(id){
                    showTaskInfoUtil.showTaskInfo(me, id);
                };
                window.showEvaluateInfo = showEvaluateInfo;
                window.showTaskInfo = showTaskInfo;

                evaluateHtml = '<a href="javascript:void(0)" onclick="showEvaluateInfo(\'' + gridData.id + '\');"> ';
                taskHtml = '<a href="javascript:void(0)" onclick="showTaskInfo(\'' + gridData.id + '\');"> ';

                flowStatusMap = {
                    '1': '未评估',
                    '2': evaluateHtml + '评估中</a>',
                    '3': evaluateHtml + '已评估</a>',
                    '4': taskHtml + '已分配</a>'
                };

                return flowStatusMap[data];
            }
        },
        inlineGridPickerRenderers: {
            modifyModel: function(data) {
                var modelMap = {
                        '1' : '模块1',
                        '2' : '模块2',
                        '3' : '模块3'
                    };
                return modelMap[data];
            }
        },
        handlers: {
            accountPickerCallback: function(v, data){
                console.log('into picker call back');
                //进入编辑界面，初始化 picker 数据后赋值
                $('input[name="account.accountName"]', v.$el).val(data.accountName);
            },
            evaluate: function(){
                var me = this,
                    id,
                    evaluateFeature = app.loadFeature('work/scaffold:work-evaluate', {container: '<div></div>'}),
                    view, inputs, formData,
                    grid = me.feature.views['grid:body'].components[0],
                    data = grid.getSelected().toJSON();

                // 不可重复送交
                if(data.status !== '1'){
                    app.error('请选择状态为未评估的记录！');
                    return false;
                }

                evaluateFeature.done(function (feature) {
                    view = feature.views['form:add'];

                    app.showDialog({
                        view: view,
                        title: '送交评估',
                        buttons: [{
                            label: '确定',
                            status: 'btn-primary',
                            fn: function() {
                                formData = view.getFormData();
                                formData.workPackageId = data.id;
                                feature.request({
                                    url: 'send-evaluate',
                                    type: 'post',
                                    data: formData,
                                    success: function(result){
                                        grid.refresh();
                                        app.success('送交评估成功！');
                                    }
                                });
                            }
                        }]
                    }).done(function (dialog) {
                        var modelMap = {
                            '1' : '模块1',
                            '2' : '模块2',
                            '3' : '模块3'
                        };
                        $('input[name= "workPackage.code"]', view.$el).val(data.code);
                        $('input[name= "workPackage.code"]', view.$el).attr('disabled', true);
                        $('input[name= "workPackage.name"]', view.$el).val(data.name);
                        $('input[name= "workPackage.name"]', view.$el).attr('disabled', true);
                        $('input[name= "workPackage.endTime"]', view.$el).val(data.endTime);
                        $('input[name= "workPackage.endTime"]', view.$el).attr('disabled', true);
                        $('input[name= "workPackage.model"]', view.$el).val(modelMap[data.model]);
                        $('input[name= "workPackage.model"]', view.$el).attr('disabled', true);
                    });
                });
            },
            task: function(){
                var me = this,
                    id,
                    workTaskFeature = app.loadFeature('work/scaffold:work-task', {container: '<div></div>'}),
                    view, inputs, formData,
                    grid = me.feature.views['grid:body'].components[0],
                    data = grid.getSelected().toJSON();

                // 不可重复送交
                if(data.status !== '3'){
                    app.error('请选择状态为已评估的记录！');
                    return false;
                }

                workTaskFeature.done(function (feature) {
                    view = feature.views['form:add'];

                    app.showDialog({
                        view: view,
                        title: '分配负责人',
                        buttons: [{
                            label: '确定',
                            status: 'btn-primary',
                            fn: function() {
                                formData = view.getFormData();
                                formData.workPackageId = data.id;
                                feature.request({
                                    url: 'task-person',
                                    type: 'post',
                                    data: formData,
                                    success: function(result){
                                        grid.refresh();
                                        app.success('分配成功!');
                                    }
                                });
                            }
                        }]
                    }).done(function (dialog) {
                        $('input[name= "workPackage.code"]', view.$el).val(data.code);
                        $('input[name= "workPackage.code"]', view.$el).attr('disabled', true);
                        $('input[name= "workPackage.name"]', view.$el).val(data.name);
                        $('input[name= "workPackage.name"]', view.$el).attr('disabled', true);
                    });
                });
            },
            showEvaluateList: function() {
                var me = this,
                    id,
                    evaluateListFeature = app.loadFeature('commons/show-evaluate-list', {container: '<div></div>', ignoreExists: true}),
                    evaluateListView, inputs, formData,
                    grid = me.feature.views['grid:body'].components[0],
                    data = grid.getSelected().toJSON();

                if(data.status === '1'){
                    app.error('请选择状态为评估中、已评估或已分配的记录！');
                    return false;
                }

                app.selectedDataId = data.id;
                evaluateListFeature.done(function (feature) {
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
        }
    };
});
