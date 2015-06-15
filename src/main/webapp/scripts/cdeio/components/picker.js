// Generated by CoffeeScript 1.7.1
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['underscore', 'jquery', 'cdeio/cdeio', 'cdeio/components/picker-base', 'cdeio/components/jqgrid'], function(_, $, cdeio, Picker) {
    var ManyPicker, TreePickerChooser, fn;
    TreePickerChooser = (function(_super) {
      __extends(TreePickerChooser, _super);

      function TreePickerChooser() {
        return TreePickerChooser.__super__.constructor.apply(this, arguments);
      }

      TreePickerChooser.prototype.getViewTemplate = function() {
        return '<ul id="tree" class="ztree"></ul>';
      };

      TreePickerChooser.prototype.getViewComponents = function() {
        var tree;
        tree = {
          type: 'tree',
          selector: 'tree',
          data: {
            simpleData: {
              enable: true
            }
          }
        };
        if (this.picker.options.multiple === true) {
          tree.check = {
            enable: true
          };
          if (this.picker.options.tree && this.picker.options.tree.check) {
            tree.check = _.extend(this.picker.options.tree.check, tree.check);
          }
        } else {
          tree.check = {
            enable: true,
            chkStyle: 'radio',
            radioType: 'all'
          };
          if (this.picker.options.tree && this.picker.options.tree.check) {
            tree.check = _.extend(this.picker.options.tree.check, tree.check);
          }
        }
        return [tree];
      };

      TreePickerChooser.prototype.getSelectedItems = function() {
        var selected, tree;
        tree = this.view.components[0];
        selected = tree.getCheckedNodes();
        if (selected.length === 0) {
          return false;
        }
        return selected;
      };

      return TreePickerChooser;

    })(Picker.Chooser);
    ManyPicker = (function(_super) {
      __extends(ManyPicker, _super);

      function ManyPicker() {
        return ManyPicker.__super__.constructor.apply(this, arguments);
      }

      ManyPicker.prototype.getTemplate = function() {
        return _.template('<div>\n  <a href="javascript:void 0" class="btn" id="trigger-<%= id %>"><i class="icon-search"/></a>\n  <a href="javascript:void 0" class="btn" id="remove-<%= id %>"><i class="icon-remove"/></a>\n  <table id="grid-<%= id %>"></table>\n</div>');
      };

      ManyPicker.prototype.render = function() {
        ManyPicker.__super__.render.apply(this, arguments);
        this.grid = this.container.find('#grid-' + this.id).jqGrid(this.options.pickerGrid);
        return this.container.find('#remove-' + this.id).click((function(_this) {
          return function() {
            var selected;
            selected = _this.grid.getGridParam("selrow");
            if (!selected) {
              return;
            }
            return _this.grid.delRowData(selected);
          };
        })(this));
      };

      ManyPicker.prototype.setValue = function(value) {
        var v, _i, _len, _results;
        if (!value) {
          return;
        }
        if (!_.isArray(value)) {
          value = [value];
        }
        _results = [];
        for (_i = 0, _len = value.length; _i < _len; _i++) {
          v = value[_i];
          if (_.include(this.grid.getDataIDs(), v.id)) {
            continue;
          }
          _results.push(this.grid.addRowData(v.id, v));
        }
        return _results;
      };

      ManyPicker.prototype.getFormData = function() {
        return this.grid.getDataIDs();
      };

      return ManyPicker;

    })(Picker.Picker);
    fn = function(pickerType, chooserType, el, opt, view) {
      var app, deferred, options, picker;
      if (opt == null) {
        opt = {};
      }
      app = view.feature.module.getApplication();
      options = _.extend(opt, {
        view: view,
        container: el,
        chooserType: chooserType
      });
      if (options.remoteDefined) {
        deferred = $.Deferred();
        $.get(view.feature.module.getApplication().url(options.url + '/configuration/picker'), function(data) {
          var picker;
          options = _.extend(options, data);
          picker = new pickerType(options);
          picker.render();
          return deferred.resolve(picker);
        });
        return deferred;
      } else {
        picker = new pickerType(options);
        picker.render();
        return picker;
      }
    };
    cdeio.registerComponentHandler('grid-picker', (function() {}), _.bind(fn, this, Picker.Picker, Picker.Chooser));
    cdeio.registerComponentHandler('tree-picker', (function() {}), _.bind(fn, this, Picker.Picker, TreePickerChooser));
    cdeio.registerComponentHandler('multi-grid-picker', (function() {}), _.bind(fn, this, ManyPicker, Picker.Chooser));
    return cdeio.registerComponentHandler('multi-tree-picker', (function() {}), _.bind(fn, this, ManyPicker, TreePickerChooser));
  });

}).call(this);
