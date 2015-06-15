// Generated by CoffeeScript 1.7.1
(function() {
  define(['jquery', 'underscore', 'cdeio/core/form-view', 'cdeio/core/custom-form-view'], function($, _, FormView, CustomFormView) {
    return {
      layout: {
        regions: {
          operators: 'operators',
          grid: 'body'
        }
      },
      views: [
        {
          name: 'inline:operators',
          region: 'operators',
          components: [
            function() {
              var picker, readOnly, _ref;
              _ref = this.feature.startupOptions, picker = _ref.picker, readOnly = _ref.readOnly;
              if (picker && !readOnly) {
                return _.extend({
                  selector: 'picker'
                }, picker);
              }
            }
          ],
          events: {
            'click pick': 'showPicker',
            'click remove': 'removeItem',
            'click add': 'createItem',
            'click show': 'showItem',
            'click edit': 'updateItem'
          },
          extend: {
            fakeId: function(su, id) {
              if (id) {
                return id.indexOf('FAKEID-') === 0;
              } else {
                return _.uniqueId('FAKEID-');
              }
            },
            afterRender: function(su) {
              var app, grid, picker, url;
              su.apply(this);
              picker = this.components[0];
              app = this.feature.module.getApplication();
              grid = this.feature.views['inline:grid'].components[0];
              if (picker) {
                picker.setValue = function(value) {
                  var d, data, exists, v, _i, _j, _len, _len1, _results;
                  if (!_.isArray(value)) {
                    value = [value];
                  }
                  data = grid.fnGetData();
                  _results = [];
                  for (_i = 0, _len = value.length; _i < _len; _i++) {
                    v = value[_i];
                    exists = false;
                    for (_j = 0, _len1 = data.length; _j < _len1; _j++) {
                      d = data[_j];
                      if (d.id === v.id) {
                        exists = true;
                      }
                    }
                    if (!exists) {
                      _results.push(grid.addRow(v));
                    } else {
                      _results.push(void 0);
                    }
                  }
                  return _results;
                };
                picker.getFormData = function() {
                  return grid.fnGetData();
                };
              }
              if (!this.loadViewFormDeferred && (this.feature.startupOptions && !this.feature.startupOptions.loadViewFormDeferred)) {
                this.loadViewFormDeferred = $.Deferred();
                url = app.url(this.feature.startupOptions.url + '/configuration/forms/show');
                $.get(url).done((function(_this) {
                  return function(data) {
                    var def, view;
                    def = _.extend({
                      baseName: 'show',
                      module: _this.feature.module,
                      feature: _this.feature,
                      avoidLoadingHandlers: true,
                      entityLabel: data.entityLabel,
                      formName: 'show'
                    }, data);
                    def.form = {
                      groups: data.groups || [],
                      tabs: data.tabs
                    };
                    view = def.custom ? new CustomFormView(def) : new FormView(def);
                    if (!grid.initData) {
                      grid.initData = grid.fnGetData();
                    }
                    return _this.loadViewFormDeferred.resolve(view, data.entityLabel);
                  };
                })(this));
              }
              if (this.feature.startupOptions.allowAdd) {
                if (!this.loadAddFormDeferred) {
                  this.loadAddFormDeferred = $.Deferred();
                  app = this.feature.module.getApplication();
                  url = app.url(this.feature.startupOptions.url + '/configuration/forms/add');
                  $.get(url).done((function(_this) {
                    return function(data) {
                      var def, view;
                      def = _.extend({
                        baseName: 'add',
                        module: _this.feature.module,
                        feature: _this.feature,
                        avoidLoadingHandlers: true,
                        entityLabel: data.entityLabel,
                        formName: 'add'
                      }, data);
                      def.form = {
                        groups: data.groups || [],
                        tabs: data.tabs
                      };
                      view = def.custom ? new CustomFormView(def) : new FormView(def);
                      return _this.loadAddFormDeferred.resolve(view, data.entityLabel);
                    };
                  })(this));
                }
              }
              if (this.feature.startupOptions.allowEdit === true) {
                if (!this.loadEditFormDeferred) {
                  this.loadEditFormDeferred = $.Deferred();
                  url = app.url(this.feature.startupOptions.url + '/configuration/forms/edit');
                  return $.get(url).done((function(_this) {
                    return function(data) {
                      var def, view;
                      def = _.extend({
                        baseName: 'edit',
                        module: _this.feature.module,
                        feature: _this.feature,
                        avoidLoadingHandlers: true,
                        entityLabel: data.entityLabel,
                        formName: 'edit'
                      }, data);
                      def.form = {
                        groups: data.groups || [],
                        tabs: data.tabs
                      };
                      view = def.custom ? new CustomFormView(def) : new FormView(def);
                      return _this.loadEditFormDeferred.resolve(view, data.entityLabel);
                    };
                  })(this));
                }
              }
            },
            serializeData: function(su) {
              var data;
              data = su.apply(this);
              data.allowPick = this.feature.startupOptions.allowPick;
              data.allowAdd = this.feature.startupOptions.allowAdd;
              data.allowEdit = this.feature.startupOptions.allowEdit;
              data.readOnly = this.feature.startupOptions.readOnly;
              data.disableShow = this.feature.startupOptions.disableShow;
              return data;
            }
          }
        }, {
          name: 'inline:grid',
          region: 'grid',
          avoidLoadingHandlers: true,
          components: [
            function() {
              var column, columns, options, renderers, scaffold, _i, _len;
              options = this.feature.startupOptions.gridOptions;
              scaffold = options.form.feature.options.scaffold || {};
              columns = options.columns;
              renderers = scaffold.renderers || {};
              this.handlers = scaffold.handlers || {};
              this.beforeShowInlineGridDialog = scaffold.beforeShowInlineGridDialog;
              this.afterShowInlineGridDialog = scaffold.afterShowInlineGridDialog;
              this.validInlineGridFormData = scaffold.validInlineGridFormData;
              this.beforeShowPicker = scaffold.beforeShowPicker;
              for (_i = 0, _len = columns.length; _i < _len; _i++) {
                column = columns[_i];
                if (_.isString(column.renderer)) {
                  column.renderer = renderers[column.renderer];
                }
              }
              return _.extend({
                type: 'grid',
                selector: 'grid',
                data: [],
                fixedHeader: false
              }, options);
            }
          ]
        }
      ],
      extend: {
        loadFormData: function(ignore, values) {
          var d, data, grid, ids, v, _i, _j, _len, _len1, _ref, _ref1, _results;
          grid = this.views['inline:grid'].components[0];
          ids = [];
          data = grid.fnGetData();
          grid.clear();
          _ref = data || [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            d = _ref[_i];
            ids.push(d.id);
          }
          _ref1 = values || [];
          _results = [];
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            v = _ref1[_j];
            _results.push(grid.addRow(v));
          }
          return _results;
        },
        getFormData: function() {
          var d, data, dd, grid, ids, inda, initData, view, _i, _j, _len, _len1;
          grid = this.views['inline:grid'].components[0];
          view = this.views['inline:operators'];
          data = grid.fnGetData() || [];
          initData = grid.initData || [];
          for (_i = 0, _len = initData.length; _i < _len; _i++) {
            inda = initData[_i];
            if (!_.findWhere(data, {
              id: inda.id
            })) {
              inda['__ID__'] = inda.id;
              inda['__FORM_TYPE__'] = 'delete';
              inda['__FORM_FLAG__'] = 'true';
              data = data.concat(inda);
            }
          }
          ids = [];
          for (_j = 0, _len1 = data.length; _j < _len1; _j++) {
            d = data[_j];
            dd = _.extend({}, d);
            if (d.id.indexOf('FAKEID-') === 0) {
              delete dd.id;
            }
            ids.push(dd);
          }
          return ids;
        }
      }
    };
  });

}).call(this);
