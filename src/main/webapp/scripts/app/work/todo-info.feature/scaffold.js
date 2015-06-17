define([
    'jquery',
    'cdeio/core/loader-plugin-manager'
], function ($, LoaderManager) {
    return {
        afterShowDialog: function(dialogType, v, data){
            var me = this;
            if ('show' === dialogType) {
                me.feature.model.set('evaluateInfo.expectTime', data.evaluateInfo.expectTime);
                me.feature.model.set('evaluateInfo.workload', data.evaluateInfo.workload);
                me.feature.model.set('evaluateInfo.workPrice', data.evaluateInfo.workPrice);
            }

            me.feature.views['form:' + dialogType].setFormData(me.feature.model.toJSON(), true);
        },
        renderers: {
            modifyModel: function(data) {
                var modelMap = {
                        '1' : '模块1',
                        '2' : '模块2',
                        '3' : '模块3'
                    };
                return modelMap[data];
            },
            modifyStatus: function(data) {
                var statusMap = {
                        '1': '待评估',
                        '2': '待提交',
                        '3': '已提交'
                };
                return statusMap[data];
            }
        },
        handlers: {
            evaluate: function(){
                var me = this,
                    id,
                    evaluateInfoFeature = app.loadFeature('work/scaffold:evaluate-info', {container: '<div></div>'}),
                    view, inputs, formData,
                    grid = me.feature.views['grid:body'].components[0],
                    data = grid.getSelected().toJSON();

                if (data.status !== '1') {
                    app.error('请选择待评估的记录');
                    return false;
                }

                evaluateInfoFeature.done(function (feature) {
                    view = feature.views['form:add'];

                    app.showDialog({
                        view: view,
                        title: '评估工作包',
                        buttons: [{
                            label: '确定',
                            status: 'btn-primary',
                            fn: function() {
                                formData = view.getFormData();
                                formData.workPackageId = data.workPackage.id;
                                formData.accountId = data.account.id;
                                formData.todoInfoId = data.id;
                                console.log('formData', formData);
                                feature.request({
                                    url: 'evaluate',
                                    type: 'post',
                                    data: formData,
                                    success: function(result){
                                        grid.refresh();
                                        app.success('评估成功！');
                                    }
                                });
                            }
                        }]
                    }).done(function (dialog) {
                        $('input[name= "workPackage.code"]', view.$el).val(data.workPackage.code);
                        $('input[name= "workPackage.code"]', view.$el).attr('disabled', true);
                        $('input[name= "workPackage.name"]', view.$el).val(data.workPackage.name);
                        $('input[name= "workPackage.name"]', view.$el).attr('disabled', true);
                    });
                });
            },
            submit: function() {
                var me = this,
                    id,
                    view, inputs, formData,
                    grid = me.feature.views['grid:body'].components[0],
                    data = grid.getSelected().toJSON();

                if (data.status !== '2'){
                    app.error('请选择待提交的记录!');
                    return false;
                }

                me.feature.request({
                    url: 'submit-todo',
                    type: 'post',
                    data: data,
                    success: function(result){
                        grid.refresh();
                        app.success('提交成功!');
                    }
                });
            },
            modify: function() {
                var me = this,
                    grid = me.feature.views['grid:body'].components[0],
                    evaluateInfoFeature = app.loadFeature('work/scaffold:evaluate-info', {container: '<div></div>'}),
                    data = grid.getSelected().toJSON();

                if ('2' !== data.status) {
                    app.error('请选择状态为待提交的记录！');
                    return false;
                }

                evaluateInfoFeature.done(function (feature) {
                    view = feature.views['form:edit'];

                    app.showDialog({
                        view: view,
                        title: '编辑评估信息',
                        buttons: [{
                            label: '确定',
                            status: 'btn-primary',
                            fn: function () {
                                view.submit({id: data.evaluateInfo.id}).done(function () {
                                    grid.refresh();
                                    app.success('编辑评估成功!');
                                });
                            }
                        }]
                    }).done(function (dialog) {
                        $('input[name= "expectTime"]', view.$el).val(data.evaluateInfo.expectTime);
                        $('input[name= "workPrice"]', view.$el).val(data.evaluateInfo.workPrice);
                        $('input[name= "workload"]', view.$el).val(data.evaluateInfo.workload);
                    });
                });
                return;
            }

        }
    };
});
