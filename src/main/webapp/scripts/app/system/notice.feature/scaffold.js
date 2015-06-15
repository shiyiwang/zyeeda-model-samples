define([
    'jquery',
    'cdeio/core/loader-plugin-manager',
    'app/system/notice.feature/notice-function'
], function ($, LoaderManager, _noticeUtil) {
    return {
        beforeShowDialog: function (dialogType, v) {
            var me = this,
                grid = me.feature.views['grid:body'].components[0],
                data;

            if ('edit' === dialogType) {
                data = grid.getSelected().toJSON();

                if (data.status !== '1') {
                    app.error('请选择状态为初始的记录');
                    return false;
                }
            }

            return true;
        },
        afterShowDialog: function (dialogType, view, data) {
            var me = this;

            if ('add' === dialogType) {
                me.feature.request({
                    url: 'get-default-data',
                    type: 'get'
                }).done(function (result) {
                    me.feature.model.set('createTime', result.createTime);
                    me.feature.model.set('creatorName', result.creatorName);
                    me.feature.views['form:' + dialogType].setFormData(me.feature.model.toJSON());
                });
            } else if ('show' === dialogType) {

                if (!_.isEmpty(data.account)) {
                    me.feature.model.set('account.realName', data.account.realName);
                    me.feature.views['form:' + dialogType].setFormData(me.feature.model.toJSON());
                }

                _noticeUtil.callMethodPath(app, data);
            }

            $('input[name="creatorName"]', view.$el).attr('disabled', true);
            $('input[name="createTime"]', view.$el).attr('disabled', true);
        },
        renderers: {
            modifyStatus: function (data) {
                var statusMap = {
                    '1': '初始',
                    '2': '发布',
                    '3': '关闭'
                };
                return statusMap[data];
            }
        },
        handlers: {
            beforeDel: function (gridView, grid, selected) {
                if ('1' !== selected.status) {
                    app.error('请选择状态为初始的记录');
                    return false;
                }

                return true;
            },

            issue: function () {
                var me = this,
                    view = me.feature.views['grid:body'],
                    grid = view.components[0],
                    data = grid.getSelected().toJSON();

                if (null !== data.status && '1' !== data.status) {
                    app.error('请选择状态为初始的记录');
                } else {
                    app.confirm('确定要发布选中的记录吗?', function (confirmed) {
                        if (confirmed) {
                            data.status = '2';

                            me.feature.request({
                                url: 'update-notice-statu-by-id',
                                type: 'post',
                                data: {id: data.id, status: data.status}
                            }).done(function (result) {
                                grid.refresh();
                                app.success('发布成功');
                            });
                            return true;
                        }
                        return;
                    });
                }
            },

            revert: function () {
                var me = this,
                    view = me.feature.views['grid:body'],
                    grid = view.components[0],
                    data = grid.getSelected().toJSON();

                if (null !== data.status && '2' !== data.status) {
                    app.error('请选择状态为发布的记录');
                } else {
                    app.confirm('确定要撤销选中的记录吗?', function (confirmed) {
                        if (confirmed) {
                            data.status = '1';

                            me.feature.request({
                                url: 'update-notice-statu-by-id',
                                type: 'post',
                                data: {id: data.id, status: data.status}
                            }).done(function (result) {
                                grid.refresh();
                                app.success('撤销成功');
                            });
                            return true;
                        }
                        return;
                    });
                }
            },

            close: function () {
                var me = this,
                    view = me.feature.views['grid:body'],
                    grid = view.components[0],
                    data = grid.getSelected().toJSON();

                if (null !== data.status && '2' !== data.status) {
                    app.error('请选择状态为发布的记录');
                } else {
                    app.confirm('确定要关闭选中的记录吗?', function (confirmed) {
                        if (confirmed) {
                            data.status = '3';

                            me.feature.request({
                                url: 'update-notice-statu-by-id',
                                type: 'post',
                                data: {id: data.id, status: data.status}
                            }).done(function (result) {
                                grid.refresh();
                                app.success('关闭成功');
                            });
                            return true;
                        }
                        return;
                    });
                }
            }
        }
    };
});
