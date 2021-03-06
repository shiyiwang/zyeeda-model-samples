// Generated by CoffeeScript 1.7.1
(function() {
  define(['jquery', 'underscore'], function($, _) {
    var FormField, fieldTypes;
    FormField = (function() {
      function FormField(form, group, options) {
        this.form = form;
        this.group = group;
        this.options = options;
        if (_.isString(options)) {
          this.options = options = {
            name: options
          };
        }
        this.id = options.id || _.uniqueId((options.name || '').replace(/\./g, '_'));
        this.name = options.name;
        this.value = options.value || options.name;
        this.hideLabel = options.hideLabel;
        this.label = options.label || this.name;
        this.readOnly = !!options.readOnly;
        this.disabled = !!options.disabled;
        this.required = !!options.required;
        this.visible = true;
        this.type = options.type;
        this.colspan = options.colspan || 1;
        this.rowspan = options.rowspan || 1;
        this.height = (options.rows || 3) * 24;
        this.statusChanger = !!options.statusChanger;
        this.multiple = options.multiple;
      }

      FormField.prototype.getElement = function() {
        return this.form.$(this.id);
      };

      FormField.prototype.getFormData = function() {
        return this.form.$(this.id).val();
      };

      FormField.prototype.loadFormData = function(value, data) {
        var idx;
        if (value === null || value === void 0) {
          value = this.options.defaultValue || '';
        }
        if (this.value !== this.name) {
          value = data[this.value];
        }
        if (_.isArray(value)) {
          idx = _.indexOf(this.form.findField(this.name), this);
          return this.loadFormData(value[idx]);
        }
        if (this.readOnly) {
          return this.form.$(this.id).text(value);
        } else {
          return this.form.$(this.id).val(value);
        }
      };

      FormField.prototype.isReadOnly = function() {
        return this.readOnly;
      };

      FormField.prototype.getComponents = function() {
        return [];
      };

      FormField.prototype.getEvents = function() {
        var o;
        o = {};
        if (this.statusChanger) {
          o['change ' + this.id] = 'formStatusChanged';
        }
        return o;
      };

      FormField.prototype.setVisible = function(visible) {
        this.visible = visible === false ? false : true;
        return this.getElement()[this.visible ? 'show' : 'hide']();
      };

      FormField.prototype.submitThisField = function() {
        return this.visible && !this.readOnly;
      };

      FormField.prototype.getFilter = function() {
        var value;
        value = this.getFormData();
        if (!value) {
          return null;
        }
        return [this.filterOperator || 'like', this.name, value];
      };

      FormField.prototype.getTemplateString = function() {
        return '<% if (readOnly) { %>\n    <div class="c-view-form-field">\n        <% if (!hideLabel) { %>\n        <div class="field-label"><%= label %></div>\n        <% } %>\n        <div id="<%= id %>" class="field-value">{{<%= value %>}}</div>\n    </div>\n<% } else { %>\n    <div class="control-group">\n        <% if (!hideLabel) { %>\n        <label class="control-label" for="<%= id %>"><%= label %><% if (required) { %>\n            <span class="required-mark">*</span>\n        <% } %></label><% } %>\n      <div class="controls">\n        <input type="<%= type %>" class="input span12" id="<%= id %>" name="<%= name %>" value="{{<%= value %>}}" />\n      </div>\n    </div>\n<% } %>';
      };

      FormField.prototype.getTemplate = function() {
        var tpl;
        tpl = _.template(this.getTemplateString());
        return tpl(this);
      };

      FormField.prototype.afterRender = function() {
        return this;
      };

      return FormField;

    })();
    fieldTypes = {};
    FormField.add = function(type, clazz) {
      return fieldTypes[type] = clazz;
    };
    FormField.build = function(options, group, form) {
      var c, clazz, type;
      if (_.isString(options)) {
        options = {
          name: options
        };
      }
      type = options.type || 'text';
      clazz = fieldTypes[type];
      c = clazz ? clazz : FormField;
      return new c(form, group, options);
    };
    return FormField;
  });

}).call(this);
