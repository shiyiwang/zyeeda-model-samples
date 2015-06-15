// Generated by CoffeeScript 1.7.1
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['cdeio/core/form/text-field', 'cdeio/core/form/form-field', 'cdeio/components/datetimepicker'], function(TextField, FormField) {
    var DateTimePickerField;
    DateTimePickerField = (function(_super) {
      __extends(DateTimePickerField, _super);

      function DateTimePickerField() {
        DateTimePickerField.__super__.constructor.apply(this, arguments);
        this.filterOperator = 'eq';
        this.type = 'datetimepicker';
      }

      DateTimePickerField.prototype.getComponents = function() {
        if (this.readOnly) {
          return [];
        } else {
          return [
            {
              type: 'datetimepicker',
              selector: this.id
            }
          ];
        }
      };

      return DateTimePickerField;

    })(TextField);
    FormField.add('datetimepicker', DateTimePickerField);
    return DateTimePickerField;
  });

}).call(this);