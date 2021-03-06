// Generated by CoffeeScript 1.7.1
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['underscore', 'jquery', 'cdeio/core/form-view', 'cdeio/core/form/form-field'], function(_, $, FormView, FormField) {
    var FilePickerField, isImage, types;
    types = ['image/png', 'image/bmp', 'image/jpeg', 'image/gif', 'image/x-icon'];
    isImage = function(contentType) {
      return _.contains(types, contentType);
    };
    FilePickerField = (function(_super) {
      __extends(FilePickerField, _super);

      function FilePickerField() {
        FilePickerField.__super__.constructor.apply(this, arguments);
        this.type = 'file-picker';
      }

      FilePickerField.prototype.getComponent = function() {
        if (_.isString(this.options.acceptFileTypes)) {
          this.options.acceptFileTypes = new RegExp(this.options.acceptFileTypes, 'i');
        }
        return _.extend({
          title: '选择' + this.options.label
        }, this.options, {
          selector: 'a-' + this.id,
          id: 'a-' + this.id,
          type: this.type,
          name: this.name,
          readOnly: this.readOnly
        });
      };

      FilePickerField.prototype.getComponents = function() {
        if (this.readOnly) {
          return [];
        } else {
          return [this.getComponent()];
        }
      };

      FilePickerField.prototype.loadFormData = function(value, data) {
        var item, picker, _i, _len, _ref, _results;
        if (this.readOnly) {
          this.form.$(this.id).text(value != null ? value.name : void 0);
          this.value = value;
          if (this.multiple === true) {
            _ref = this.value;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              item = _ref[_i];
              _results.push(this.previewSingle(this.options, item.id, item.id, item.id, this.options.url, item.contentType));
            }
            return _results;
          } else {
            return this.previewSingle(this.options, this.id, this.value.id, this.id, this.options.url, this.value.contentType);
          }
        } else {
          picker = this.form.findComponent('a-' + this.id);
          if (!picker) {
            return;
          }
          return picker.loadData(data);
        }
      };

      FilePickerField.prototype.previewSingle = function(options, did, rid, $id, url, contentType) {
        var _url;
        if (isImage(contentType) === false) {
          return;
        }
        _url = url + '/' + rid;
        this.form.$('preview-' + did).attr('href', 'javascript: void 0');
        return this.form.$('preview-' + did).click((function(_this) {
          return function(e) {
            var id, popover;
            id = $(e.target).attr('id').match(/preview-(.*)$/)[1];
            popover = _this.form.$('popover-span-' + id);
            return _this.popoverToggle(popover, _url, id);
          };
        })(this));
      };

      FilePickerField.prototype.popoverToggle = function(popover, url, id) {
        var _next;
        _next = popover.next();
        if (_next.hasClass('popover') && _next.css('display') === 'block') {
          return _next.hide();
        } else {
          $('a[id*="popover-span"]').each(function(e) {
            if ($(this).data('popover')) {
              return $(this).next().hide();
            }
          });
          popover.attr('data-content', popover.attr('data-content'));
          popover.popover({
            html: true
          });
          popover.popover('show');
          return $('#preview-img-' + id).click((function(_this) {
            return function() {
              _this.popoverToggle(popover, url, id);
              return window.open(url, id);
            };
          })(this));
        }
      };

      FilePickerField.prototype.getFormData = function() {
        var field, obj, _ref;
        if (this.readOnly) {
          return (_ref = this.value) != null ? _ref.id : void 0;
        } else {
          field = this.form.findComponent('a-' + this.id);
          if (!field) {
            return;
          }
          obj = field.getFormData();
          if (field.options.multiple) {
            if (obj.length === 0) {
              return {
                id: null
              };
            } else {
              return obj;
            }
          }
          if (obj && obj.id) {
            return obj;
          }
          return {
            id: null
          };
        }
      };

      FilePickerField.prototype.getTemplateString = function() {
        return '<% if (readOnly) { %>\n    <div class="c-view-form-field">\n        <% if (!hideLabel) { %>\n        <div class="field-label"><%= label %></div>\n        <% } %>\n        <div id="<%= id %>" class="field-value">\n            <% if (options.multiple) { %>\n            {{#each <%= name %>}}\n            <a id="popover-span-{{id}}" class="upload-preview-btn upload-multiple-preview" href="javascript: void(0) "  data-rel="popover" data-placement="right"  data-content="<img id=\'preview-img-{{id}}\' class=\'upload-preview\' src=\'<%= options.url %>/{{id}}\' />">&nbsp;</a>\n            <a id="preview-{{id}}" target="_blank" style="z-index: 1;position: relative;" href="<%= options.url %>/{{id}}">{{filename}}</a>\n            </br>\n            {{/each}}\n            <% } else { %>\n            <a id="popover-span-<%= id %>" class="upload-preview-btn upload-multiple-preview" href="javascript: void(0) "  data-rel="popover" data-placement="right"  data-content="<img id=\'preview-img-<%= id %>\' class=\'upload-preview\' src=\'<%= options.url %>/{{<%= name %>.id}}\' />">&nbsp;</a>\n            <a id="preview-<%= id %>" target="_blank" style="z-index: 1;position: relative;" href="<%= options.url %>/{{<%= name %>.id}}">{{<%= name %>.filename}}</a>\n            <% } %>\n        </div>\n    </div>\n<% } else { %>\n    <div class="control-group">\n      <% if (!hideLabel) { %>\n      <label class="control-label" for="<%= id %>"><%= label %><% if (required) { %>\n            <span class="required-mark">*</span>\n        <% } %></label><% } %>\n      <div class="controls">\n        <div id="a-<%= id %>"></div>\n      </div>\n    </div>\n<% } %>';
      };

      return FilePickerField;

    })(FormField);
    return FormField.add('file-picker', FilePickerField);
  });

}).call(this);
