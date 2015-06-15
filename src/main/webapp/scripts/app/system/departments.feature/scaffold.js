define(['jquery'], function($){
    return {
        //dialogType:add/edit/show,v:the current view,data:this dialog's data
        afterShowDialog: function(dialogType, v, data){
            // 打开form页面时，页面第一个可输入元素获提焦点
            if('show' !== dialogType){
                $('input[name]')[0].focus();
            }
        },

        handlers: {
            departmentMoved: function(e, treeId, treeNodes, targetNode) {
                var me,
                    tree,
                    app;
                if (!targetNode) {
                    return;
                }

                me = this;
                tree = me.feature.views['tree:body'].components[0];
                app = me.feature.module.getApplication();
                me.feature.model.set('id', treeNodes[0].id);

                $.when(me.feature.model.fetch()).done(function() {
                    me.feature.model.set('__formName__', 'move');
                    me.feature.model.set('parent', targetNode.id);
                    me.feature.model.save().done(function(data) {
                        app.success('操作成功');
                    });
                });
                return true;
            },

            toggleMove: function(e) {
                var me = this,
                    tree = me.feature.views['tree:body'].components[0],
                    app = me.feature.module.getApplication(),
                    $el = $(e.currentTarget);

                if (tree.setting.edit.enable) {
                    tree.setting.edit.enable = false;
                    $el.toggleClass('btn-danger').toggleClass('btn-warning');
                } else {
                    tree.setting.edit.enable = true;
                    $el.toggleClass('btn-danger').toggleClass('btn-warning');
                }
                return true;
            }
        }
    };
});
