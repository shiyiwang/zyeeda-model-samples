define([
    'jquery',
    'cdeio/core/loader-plugin-manager'
], function ($, LoaderManager) {
    return {
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
