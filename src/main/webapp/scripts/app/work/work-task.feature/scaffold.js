define([
    'jquery',
    'cdeio/core/loader-plugin-manager'
], function ($, LoaderManager) {
    return {
        afterShowDialog: function(dialogType, v, data){
            var me = this;
            if ('show' === dialogType) {
                //编辑页面工作包编号设置为只读
                console.log('data', data);
                $('input[name="totalProgress"]', v.$el).val(data.workPackage.code);
                $('input[name="workPackage.name"]', v.$el).val(data.workPackage.name);
            }
        },
        handlers: {
            accountPickerCallback: function(v, data){
                console.log('into picker call back');
                //进入编辑界面，初始化 picker 数据后赋值
                $('input[name="account.accountName"]', v.$el).val(data.accountName);
            },
            afterAccountPickerConfirm: function(v, data){
                //点击picker，选取数据后赋值
                $('input[name="account.accountName"]', v.$el).val(data.accountName);
            }

        }
    };
});
