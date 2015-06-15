define([
    'jquery',
    'cdeio/core/loader-plugin-manager'
], function ($, LoaderManager) {
    return {
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
                        '1': '未评估',
                        '2': '评估中',
                        '3': '已评估'
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
                                        app.success('评估成功');
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

                console.log(data);
                if (data.status === '1'){
                    app.error('请先填写评估信息');
                    //return false;
                }

                me.feature.request({
                    url: 'submit-todo',
                    type: 'post',
                    data: data,
                    success: function(result){
                        grid.refresh();
                        app.success('提交成功');
                    }
                });
            }

        }
    };
});
