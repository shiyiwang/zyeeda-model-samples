// Generated by CoffeeScript 1.7.1
(function() {
  define({
    showPicker: function() {
      var beforeShowPicker, feature, gridView, handlers, picker, pickerFeatureName, pickerFeatureType, pickerFiled, scaffold;
      picker = this.components[0];
      if (!picker) {
        return;
      }
      gridView = this.feature.views['inline:grid'];
      beforeShowPicker = picker.options.beforeShowPicker;
      scaffold = this.feature.startupOptions.gridOptions.form.feature.options.scaffold || {};
      handlers = scaffold.handlers || {};
      feature = this.feature;
      pickerFeatureType = 'feature';
      if (feature.baseName === 'inline-grid') {
        feature = feature.startupOptions.gridOptions.form.feature;
        pickerFeatureType = 'inline-grid';
      }
      pickerFiled = picker.name || '';
      pickerFeatureName = feature.baseName;
      if (_.isFunction(handlers[beforeShowPicker])) {
        if ((handlers[beforeShowPicker].call(this, gridView, pickerFiled, pickerFeatureType, pickerFeatureName)) !== true) {
          return;
        }
      }
      return picker.chooser.show(picker).done(function(feature) {
        var removeSelectedNodes;
        if (removeSelectedNodes = feature.inRegionViews.body.components[0].removeSelectedNodes) {
          return removeSelectedNodes();
        }
      });
    },
    removeItem: function() {
      var grid, gridView;
      grid = this.feature.views['inline:grid'].components[0];
      gridView = this.feature.views['inline:grid'];
      if (_.isFunction(gridView.handlers.beforeInlineGridRemove)) {
        gridView.handlers.beforeInlineGridRemove.call(this, grid, this.feature.formView);
      }
      grid.removeSelectedRow();
      if (_.isFunction(gridView.handlers.afterInlineGridRemove)) {
        return gridView.handlers.afterInlineGridRemove.call(this, grid, this.feature.formView);
      }
    },
    createItem: function() {
      var gridView;
      gridView = this.feature.views['inline:grid'];
      if (!this.loadAddFormDeferred) {
        return;
      }
      if (_.isFunction(gridView.beforeShowInlineGridDialog)) {
        if ((gridView.beforeShowInlineGridDialog.call(this, 'add', this)) !== true) {
          return;
        }
      }
      return this.loadAddFormDeferred.done((function(_this) {
        return function(form, title) {
          var grid;
          if (title == null) {
            title = '';
          }
          grid = gridView.components[0];
          return app.showDialog({
            title: '新增' + title,
            view: form,
            onClose: function() {
              form.unbindAll();
              _.each(form.components, function(v, i) {
                if (v.chooser) {
                  return $('#text-' + v.id, $('span'), form.$el).text('');
                }
              });
              return form.reset();
            },
            buttons: [
              {
                label: '确定',
                status: 'btn-primary',
                fn: function() {
                  var data;
                  if (!form.isValid()) {
                    return false;
                  }
                  if (_.isFunction(gridView.validInlineGridFormData)) {
                    if ((gridView.validInlineGridFormData.call(_this, 'add', form, form.getFormData())) !== true) {
                      return false;
                    }
                  }
                  data = form.getFormData();
                  data.id = _this.fakeId();
                  return grid.addRow(data);
                }
              }
            ]
          }).done(function() {
            form.reset();
            if (_.isFunction(gridView.afterShowInlineGridDialog)) {
              return gridView.afterShowInlineGridDialog.call(this, 'add', form, form.getFormData());
            }
          });
        };
      })(this));
    },
    updateItem: function() {
      var gridView;
      gridView = this.feature.views['inline:grid'];
      if (!this.loadEditFormDeferred) {
        return;
      }
      if (_.isFunction(gridView.beforeShowInlineGridDialog)) {
        if ((gridView.beforeShowInlineGridDialog.call(this, 'edit', this)) !== true) {
          return;
        }
      }
      return this.loadEditFormDeferred.done((function(_this) {
        return function(form, title) {
          var data, grid, index;
          if (title == null) {
            title = '';
          }
          grid = gridView.components[0];
          index = grid.getSelectedIndex();
          if (_.isArray(index)) {
            index = index[0];
          }
          if (index === null) {
            return;
          }
          data = grid.fnGetData(index);
          return app.showDialog({
            title: '编辑' + title,
            view: form,
            onClose: function() {
              form.unbindAll();
              _.each(form.components, function(v, i) {
                if (v.chooser) {
                  return $('#text-' + v.id, $('span'), form.$el).text('');
                }
              });
              return form.reset();
            },
            buttons: [
              {
                label: '确定',
                status: 'btn-primary',
                fn: function() {
                  var d, idx;
                  if (!form.isValid()) {
                    return false;
                  }
                  if (_.isFunction(gridView.validInlineGridFormData)) {
                    if ((gridView.validInlineGridFormData.call(_this, 'edit', form, form.getFormData())) !== true) {
                      return false;
                    }
                  }
                  d = form.getFormData();
                  idx = grid.getSelectedIndex();
                  if (_.isArray(idx)) {
                    idx = idx[0];
                  }
                  grid.fnDeleteRow(idx);
                  return grid.addRow(d);
                }
              }
            ]
          }).done(function() {
            form.setFormData(data, true);
            if (_.isFunction(gridView.afterShowInlineGridDialog)) {
              return gridView.afterShowInlineGridDialog.call(this, 'edit', form, data);
            }
          });
        };
      })(this));
    },
    showItem: function() {
      var gridView;
      gridView = this.feature.views['inline:grid'];
      if (!this.loadViewFormDeferred) {
        return;
      }
      if (_.isFunction(gridView.beforeShowInlineGridDialog)) {
        if ((gridView.beforeShowInlineGridDialog.call(this, 'show', this)) !== true) {
          return;
        }
      }
      return this.loadViewFormDeferred.done((function(_this) {
        return function(form, title) {
          var data, grid, index;
          if (title == null) {
            title = '';
          }
          grid = gridView.components[0];
          index = grid.getSelectedIndex();
          if (_.isArray(index)) {
            index = index[0];
          }
          if (index === null) {
            return;
          }
          data = grid.fnGetData(index);
          return app.showDialog({
            title: '查看' + title,
            view: form,
            buttons: []
          }).done(function() {
            form.setFormData(data, true);
            if (_.isFunction(gridView.afterShowInlineGridDialog)) {
              return gridView.afterShowInlineGridDialog.call(this, 'show', form, data);
            }
          });
        };
      })(this));
    }
  });

}).call(this);
