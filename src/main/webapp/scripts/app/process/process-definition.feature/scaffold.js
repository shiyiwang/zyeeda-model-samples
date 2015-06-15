define([
    'jquery',
    'cdeio/core/loader-plugin-manager',
    'underscore'
], function ($, LoaderManager, _) {
    return {
        afterShowDialog: function (dialogType, view, data) {
            var me = this;

            if ('edit' === dialogType) {
                _.each(view.components, function (v, i) {
                    if(v.chooser){
                        $('#trigger-' + v.id, view.$el).unbind().attr('disabled', true);
                    }
                });
            }else if ('show' === dialogType) {
                //查看页面设备名称显示处理
                me.feature.model.set('businessDefinition.businessName', data.businessDefinition.businessName);

                me.feature.views['form:' + dialogType].setFormData(me.feature.model.toJSON());
            }
        },
        handlers: {
            procBusiDefiPickerCallback: function (view, data) {
                _.each(view.components, function (v, i) {
                    if ('businessDefinition' === v.name) {
                        $('#text-' + v.id, $('span')).text(data.businessName);
                    }
                });
            },
            afterProcBusiDefiPickerConfirm: function (view, data) {
                _.each(view.components, function (v, i) {
                    if ('businessDefinition' === v.name) {
                        $('#text-' + v.id, $('span')).text(data.businessName);
                    }
                });
            }
        }
    };
});
