define([
    'jquery'
], function($) {
	return {
        //dialogType:add/edit/show, view:the current view, data:this dialog's data
        afterShowDialog: function(dialogType, view, data){
            var me, currentDepartment;

            me = this;
            currentDepartment = me.feature.department;

            if('add' === dialogType){//在添加页面设置当前feature中存放的部门
                view.setFormData({department: currentDepartment});
            }else{
                me.feature.request({
                    url: 'get-datalevel-by-account-id',
                    type: 'get',
                    data: {accountId: data.id},
                    success: function(result) {
                        if('edit' === dialogType){
                            $('input[name="dataLevel"]', view.$el).select2('val', result.dataLevel);
                        }else if('show' === dialogType){
                            view.setFormData({dataLevel: result.dataLevel}, true);
                        }
                    }
                });
            }

            // 打开form页面时，页面第一个可输入元素获提焦点
            if('show' !== dialogType){
                $('input[name]', view.$el)[0].focus();
            }
        },

        afterCloseDialog: function(dialogType, view, data){
            var me, formData;

            me = this;
            formData = view.getFormData();
            formData.id = data.id;

            if('show' !== dialogType){
                me.feature.request({
                    url: 'update-account-datalevel',
                    type: 'put',
                    data: formData,
                    success: function(result) {
                        view.model.clear();
                    }
                });
            }
        },

        renderers: {
            disabledRenderer: function(disabled) {
                if (disabled === true) {
                    return '<span class="red"><i class="icon-lock"></i>&nbsp;禁用</span>';
                }

                return '<span class="green"><i class="icon-unlock-alt"></i>&nbsp;启用</span>';
            }
        },

        handlers: {
            changePassword: function() {
                var me = this,
                    grid = me.feature.views['grid:body'].components[0],
                    selected = grid.getSelected();

                app = me.feature.module.getApplication();
                view = me.feature.views['form:changePassword'];
                view.model.clear();
                app.showDialog({
                    view: view,
                    title: '修改密码',
                    buttons: [{
                        label: '确定',
                        status: 'btn-primary',
                        fn: function() {
                            if (view.isValid()) {
                                data = view.getFormData();
                                data.id = selected.id;
                                me.feature.request({
                                    url: 'password',
                                    type: 'put',
                                    data: data,
                                    success: function(d) {
                                        app.success('密码修改成功');
                                        app._modalDialog.modal.modal('hide');
                                    }
                                });
                            }
                            return false;
                        }
                    }]
                });
                return true;
            },

            departmentChanged: function(feature, view, tree, e, treeId, treeNode) {
                var me = this,
                    grid,
                    defaultFilters;

                grid = this.feature.views['grid:body'].components[0];
                defaultFilters = ['like', 'department.path', treeNode.path || '', { mode: 'start' }];

                if (treeNode.isRoot) {
                    //当前节点是根节点时清除存放在feature中的部门
                    me.feature.department = null;
                    grid.removeFilter(defaultFilters);
                } else {
                    //当前节点不是根节点时所选择的部门存放到feature中以便在添加页面可以重复使用
                    me.feature.department = treeNode;
                    grid.addFilter(defaultFilters);
                }
                grid.refresh();
            }
        }
    };
});
