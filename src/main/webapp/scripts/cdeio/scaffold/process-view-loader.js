// Generated by CoffeeScript 1.7.1
(function() {
  define(['jquery', 'underscore', 'cdeio/core/view', 'cdeio/core/config', 'cdeio/scaffold/abstract-view-loader'], function($, _, View, config, viewLoader) {
    var handlers, kit, resetGridHeight;
    kit = {
      refresh: function(feature) {
        var activeTab, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7;
        activeTab = feature.activeTab;
        feature.activeTab = 'waiting';
        if ((_ref = feature.views['process:body-waiting']) != null) {
          if ((_ref1 = _ref.components[0]) != null) {
            _ref1.refresh();
          }
        }
        feature.activeTab = 'doing';
        if ((_ref2 = feature.views['process:body-doing']) != null) {
          if ((_ref3 = _ref2.components[0]) != null) {
            _ref3.refresh();
          }
        }
        feature.activeTab = 'done';
        if ((_ref4 = feature.views['process:body-done']) != null) {
          if ((_ref5 = _ref4.components[0]) != null) {
            _ref5.refresh();
          }
        }
        feature.activeTab = 'none';
        if ((_ref6 = feature.views['process:body-none']) != null) {
          if ((_ref7 = _ref6.components[0]) != null) {
            _ref7.refresh();
          }
        }
        return feature.activeTab = activeTab;
      }
    };
    handlers = {
      add: function() {
        return viewLoader.submitHandler.call(this, {
          submitSuccess: (function(_this) {
            return function(type) {
              var _ref, _ref1;
              _this.feature.views['process:body-none'].components[0].refresh();
              return (_ref = _this.feature.views['process:body-waiting']) != null ? (_ref1 = _ref.components[0]) != null ? _ref1.refresh() : void 0 : void 0;
            };
          })(this)
        }, 'process-form:add', '新增', 'add');
      },
      edit: function() {
        var app, grid, selected, view;
        grid = this.feature.views['process:body-' + this.feature.activeTab].components[0];
        view = this.feature.views['process-form:edit'];
        app = this.feature.module.getApplication();
        selected = grid.getSelected();
        if (!selected) {
          return app.info('请选择要操作的记录');
        }
        view.model.set(selected);
        return $.when(view.model.fetch()).then((function(_this) {
          return function() {
            return viewLoader.submitHandler.call(_this, {
              submitSuccess: function(type) {
                return _this.feature.views['process:body-' + _this.feature.activeTab].components[0].refresh();
              }
            }, 'process-form:edit', viewLoader.getDialogTitle(_this.feature.views['process-form:edit'], 'edit', '编辑'), 'edit');
          };
        })(this));
      },
      del: function() {
        var app, grid, selected;
        grid = this.feature.views['process:body-' + this.feature.activeTab].components[0];
        selected = grid.getSelected();
        app = this.feature.module.getApplication();
        if (!selected) {
          return app.info('请选择要操作的记录');
        }
        return app.confirm('确定要删除选中的记录吗?', (function(_this) {
          return function(confirmed) {
            if (!confirmed) {
              return;
            }
            _this.feature.model.set(selected);
            return $.when(_this.feature.model.destroy()).then(function(data) {
              return grid.refresh();
            }).always(function() {
              return _this.feature.model.clear();
            });
          };
        })(this));
      },
      show: function() {
        var app, buttons, claimButton, completeButton, grid, recallButton, rejectButton, selected, view;
        grid = this.feature.views['process:body-' + this.feature.activeTab].components[0];
        view = this.feature.views['process-form:show'];
        selected = grid.getSelected();
        view.model.set(selected);
        app = this.feature.module.getApplication();
        if (!selected) {
          return app.info('请选择要操作的记录');
        }
        view.model.set(selected);
        claimButton = {
          label: '认领',
          status: 'btn-purple',
          fn: (function(_this) {
            return function() {
              return app.confirm('确定认领此任务么?', function(confirmed) {
                var id;
                if (!confirmed) {
                  return;
                }
                view = _this.feature.views['process-form:show'];
                selected = grid.getSelected();
                view.model.set(selected);
                id = view.model.get('id');
                view.model.taskOperatorType = 'claim';
                return view.submit({
                  id: id
                }).done(function(data) {
                  delete view.model.taskOperatorType;
                  kit.refresh(_this.feature);
                  return _this;
                });
              });
            };
          })(this)
        };
        rejectButton = {
          label: '回退...',
          status: 'btn-inverse',
          fn: (function(_this) {
            return function() {
              var btns, rejectBtn, v;
              v = _this.feature.views['process-form:reject'];
              btns = [];
              rejectBtn = {
                label: '回退',
                status: 'btn-inverse',
                fn: function() {
                  var id;
                  id = v.model.get('id');
                  v.model.taskOperatorType = 'reject';
                  v.dialogFeature.close();
                  v.submit({
                    id: id
                  }).done(function(data) {
                    view.dialogFeature.modal.modal("hide");
                    delete v.model.taskOperatorType;
                    kit.refresh(_this.feature);
                    return _this;
                  });
                  return false;
                }
              };
              btns.push(rejectBtn);
              app.showDialog({
                view: v,
                onClose: function() {
                  return view.model.clear();
                },
                title: '回退任务',
                buttons: btns
              }).done(function() {
                return view.setFormData(view.model.toJSON());
              });
              return false;
            };
          })(this)
        };
        recallButton = {
          label: '召回...',
          status: 'btn-inverse',
          fn: (function(_this) {
            return function() {
              var btns, recallBtn, v;
              v = _this.feature.views['process-form:recall'];
              btns = [];
              recallBtn = {
                label: '召回',
                status: 'btn-inverse',
                fn: function() {
                  var id;
                  id = v.model.get('id');
                  v.model.taskOperatorType = 'recall';
                  v.dialogFeature.close();
                  v.submit({
                    id: id
                  }).done(function(data) {
                    view.dialogFeature.modal.modal("hide");
                    delete v.model.taskOperatorType;
                    kit.refresh(_this.feature);
                    return _this;
                  });
                  return false;
                }
              };
              btns.push(recallBtn);
              app.showDialog({
                view: v,
                onClose: function() {
                  return view.model.clear();
                },
                title: '召回任务',
                buttons: btns
              }).done(function() {
                return view.setFormData(view.model.toJSON());
              });
              return false;
            };
          })(this)
        };
        completeButton = {
          label: '完成...',
          status: 'btn-success',
          fn: (function(_this) {
            return function() {
              var btns, completeBtn, v;
              v = _this.feature.views['process-form:complete'];
              btns = [];
              completeBtn = {
                label: '完成',
                status: 'btn-success',
                fn: function() {
                  var id;
                  id = v.model.get('id');
                  v.model.taskOperatorType = 'complete';
                  v.dialogFeature.close();
                  v.submit({
                    id: id
                  }).done(function(data) {
                    view.dialogFeature.modal.modal("hide");
                    delete v.model.taskOperatorType;
                    kit.refresh(_this.feature);
                    return _this;
                  });
                  return false;
                }
              };
              btns.push(completeBtn);
              app.showDialog({
                view: v,
                onClose: function() {
                  return view.model.clear();
                },
                title: '完成任务',
                buttons: btns
              }).done(function() {
                return view.setFormData(view.model.toJSON());
              });
              return false;
            };
          })(this)
        };
        buttons = [];
        if (this.feature.activeTab === 'waiting') {
          buttons.push(claimButton);
          buttons.push(completeButton);
        } else if (this.feature.activeTab === 'doing') {
          buttons.push(completeButton);
        }
        return $.when(view.model.fetch()).then((function(_this) {
          return function() {
            view.model._t_taskId = view.model.get('_t_taskId');
            if (view.model.get('_t_rejectable') === true) {
              buttons.push(rejectButton);
            }
            if (view.model.get('_t_recallable') === true) {
              buttons.push(recallButton);
            }
            return app.showDialog({
              view: view,
              onClose: function() {
                return view.model.clear();
              },
              title: '查看',
              buttons: buttons
            }).done(function() {
              var scaffold;
              view.setFormData(view.model.toJSON());
              scaffold = view.feature.options.scaffold || {};
              if (_.isFunction(scaffold.afterShowDialog)) {
                return scaffold.afterShowDialog.call(view, 'show', view, view.model.toJSON());
              }
            });
          };
        })(this));
      },
      refresh: function() {
        var grid;
        grid = this.feature.views['process:body-' + this.feature.activeTab].components[0];
        return grid.refresh();
      }
    };
    resetGridHeight = function(table) {
      var el, height;
      el = $('.dataTables_scrollBody');
      if (el.size() === 0) {
        return;
      }
      height = $(document.body).height() - el.offset().top - 5;
      height = height < 0 ? 0 : height;
      el.height(height);
      return table.fnSettings().oInit.sScrollY = height;
    };
    return {
      type: 'view',
      name: 'process',
      fn: function(module, feature, viewName, args) {
        var deferred, initVisibility, scaffold, tabName, visibility;
        deferred = $.Deferred();
        if (viewName === 'tabs') {
          viewLoader.generateTabsView({
            handlers: {}
          }, module, feature, deferred);
        } else if (viewName.indexOf('toolbar-') === 0) {
          viewLoader.generateOperatorsView({
            url: 'configuration/process/operators/' + (feature.activeTab || 'waiting'),
            handlers: handlers
          }, module, feature, deferred);
        } else if (viewName.indexOf('body-') === 0) {
          tabName = viewName.split('-')[1];
          scaffold = feature.options.scaffold || {};
          visibility = scaffold.ensureOperatorsVisibility || viewLoader.ensureOperatorsVisibility;
          initVisibility = scaffold.initOperatorsVisibility || viewLoader.initOperatorsVisibility;
          viewLoader.generateGridView({
            url: 'configuration/process/grid/' + (feature.activeTab || 'waiting'),
            createView: function(options) {
              options.events || (options.events = {});
              options.events['selectionChanged grid'] = 'selectionChanged';
              options.events['draw grid'] = 'refresh';
              options.extra = {};
              options.extra['_task_type'] = feature.activeTab || 'none';
              return new View(options);
            },
            handlers: {
              selectionChanged: function(e, models) {
                var v;
                v = this.feature.views['process:toolbar-' + tabName];
                return visibility.call(v, v.options.operators, models);
              },
              refresh: function() {
                var v;
                v = this.feature.views['process:toolbar-' + tabName];
                return initVisibility.call(v, v.options.operators);
              },
              adjustGridHeight: function() {
                return resetGridHeight(this.components[0]);
              },
              deferAdjustGridHeight: function() {
                return _.defer((function(_this) {
                  return function() {
                    return resetGridHeight(_this.components[0]);
                  };
                })(this));
              }
            }
          }, module, feature, deferred);
        }
        return deferred;
      }
    };
  });

}).call(this);
