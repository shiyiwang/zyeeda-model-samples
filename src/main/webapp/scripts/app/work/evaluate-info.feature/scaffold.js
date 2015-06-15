define([
    'jquery',
    'cdeio/core/loader-plugin-manager'
], function ($, LoaderManager) {
    return {
        afterShowDialog: function(dialogType, v, data){
            var me = this;
            if ('show' === dialogType) {
                //编辑页面工作包编号设置为只读
                $('input[name="workPackage.code"]', v.$el).val(data.workPackage.code);
                $('input[name="workPackage.name"]', v.$el).val(data.workPackage.name);
            }
        },
        renderers: {
            modifyAccountName: function(data) {
                return data.name;
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
                    evaluateFeature = app.loadFeature('work/scaffold:work-evaluate', {container: '<div></div>'}),
                    view, inputs, formData,
                    grid = me.feature.views['grid:body'].components[0],
                    data = grid.getSelected().toJSON();

                // 不可重复送交
                if(data.status == '2'){
                    app.error('此记录已送交评估，请勿重复送交！');
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
                                        app.success('送交评估成功');
                                    }
                                });
                            }
                        }]
                    }).done(function (dialog) {
                        $('input[name= "workPackage.code"]', view.$el).val(data.code);
                        $('input[name= "workPackage.code"]', view.$el).attr('disabled', true);
                        $('input[name= "workPackage.name"]', view.$el).val(data.name);
                        $('input[name= "workPackage.name"]', view.$el).attr('disabled', true);
                        $('input[name= "workPackage.endTime"]', view.$el).val(data.endTime);
                        $('input[name= "workPackage.endTime"]', view.$el).attr('disabled', true);
                        $('input[name= "workPackage.model"]', view.$el).val(data.model);
                        $('input[name= "workPackage.model"]', view.$el).attr('disabled', true);
                    });
                });
            }

        }
    };
});
