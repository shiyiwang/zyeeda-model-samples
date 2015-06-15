define({
    showNotice: function(e) {
        var me, el, id,
            myNoticeFeature, view;

        me = this;
        el = $(e.currentTarget);
        id = el.data('id');

        myNoticeFeature = app.loadFeature('system/scaffold:my-notice', {container: '<div></div>'});
        myNoticeFeature.done(function (feature) {
            view = feature.views['form:show'];

            feature.model.set('id', id);
            feature.model.fetch().done(function(fetchData) {
                app.showDialog({
                    view: view,
                    title: '查看我的通知',
                    buttons: [],
                    onClose: function(){
                        feature.stop();
                    }
                }).done(function() {
                    view.setFormData(fetchData);

                    $('div[id^='+ view.cid+'-issueAccount_realName'+']', view.$el).text(fetchData.issueAccount.realName);
                    //更新是否查阅
                    if (false === fetchData.sign) {
                        $.ajax({
                            url: 'invoke/scaffold/system/my-notice/update-sign',
                            type: 'put',
                            data: {id: fetchData.id}
                        }).done(function (result){
                            me.render();
                        });
                    }
                });
            });
        });
    }
});
