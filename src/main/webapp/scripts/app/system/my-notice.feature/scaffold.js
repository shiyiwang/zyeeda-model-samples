define([
    'jquery',
    'cdeio/core/loader-plugin-manager'
], function ($, LoaderManager) {
    return {
        afterShowDialog: function(dialogType, v, data){
            var me = this,
                grid = me.feature.views['grid:body'].components[0];
            //查看页面处理
            if ('show' === dialogType) {
                $('div[id^='+ v.cid+'-issueAccount_realName'+']', v.$el).text(data.issueAccount.realName);
                //更新是否查阅
                if (false === data.sign) {
                    me.feature.request({
                        url: 'update-sign',
                        type: 'put',
                        data: {id: data.id}
                    }).done(function (result){
                        grid.refresh();
                    });
                }
            }
        },
        renderers: {
            modifySign: function(data){
                var signMap = {
                    true: '是',
                    false: '否'
                };
                return signMap[data];
            }
        },
        handlers: {
            beforeDel: function (gridView, grid, selected) {
                if (false === selected.sign) {
                    app.error('通知未查看，不可删除');
                    return false;
                }
                return true;
            }
        }
	};
});
