// Generated by CoffeeScript 1.7.1
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['cdeio/core/form/form-field'], function(FormField) {
    var TextareaField;
    TextareaField = (function(_super) {
      __extends(TextareaField, _super);

      function TextareaField() {
        TextareaField.__super__.constructor.apply(this, arguments);
        this.type = 'textarea';
      }

      TextareaField.prototype.getTemplateString = function() {
        return '<% if (readOnly) { %>\n    <div class="c-view-form-field">\n        <% if (!hideLabel) { %>\n        <div class="field-label"><%= label %></div>\n        <% } %> \n        <div id="<%= id %>" class="field-value">{{<%= value %>}}</div>\n    </div>\n<% } else { %>\n    <% if (!hideLabel) { %>\n    <div class="control-group">\n      <label class="control-label" for="<%= id %>"><%= label %><% if (required) { %>\n            <span class="required-mark">*</span>\n        <% } %></label><% } %>\n      <div class="controls">\n            <textarea class="input span12" id="<%= id %>" name="<%= name %>" style="height: <%= height %>px;">{{<%= value %>}}</textarea>\n      </div>\n    </div>\n<%  } %>';
      };

      return TextareaField;

    })(FormField);
    FormField.add('textarea', TextareaField);
    return TextareaField;
  });

}).call(this);
