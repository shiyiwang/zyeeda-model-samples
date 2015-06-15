// Generated by CoffeeScript 1.7.1
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['underscore', 'jquery', 'cdeio/cdeio', 'cdeio/components/picker-base', 'handlebars', 'cdeio/vendors/jquery/fileupload/jquery.iframe-transport', 'cdeio/vendors/jquery/fileupload/jquery.fileupload', 'cdeio/vendors/jquery/fileupload/jquery.fileupload-process', 'cdeio/vendors/jquery/fileupload/jquery.fileupload-validate'], function(_, $, cdeio, Picker, H) {
    var FilePicker, calcSize, isImage, row, types, units;
    units = ['B', 'Kb', 'Mb', 'Gb', 'Tb'];
    calcSize = function(size) {
      var i;
      i = 0;
      while (size > 1024) {
        size = size / 1024;
        i++;
      }
      return size.toFixed(2) + ' ' + units[i];
    };
    types = ['image/png', 'image/bmp', 'image/jpeg', 'image/gif', 'image/x-icon'];
    isImage = function(contentType) {
      return _.contains(types, contentType);
    };
    row = H.compile('<tr>\n    <td style="text-align: center;"><input id="check-{{id}}" type="checkbox" /></td>\n    <td>\n        <div class="progress" style="margin-bottom: 0px; margin-top: 5px;">\n            <div class="bar" id="bar-{{id}}" style="width:1%; color: black;text-align:left;">&nbsp;&nbsp;{{name}}</div>\n        </div>\n    </td>\n    <td>\n        {{#preview}}\n        <a id="popover-span-{{../id}}" class="upload-preview-btn upload-multiple-preview" href="javascript: void 0"  data-rel="popover" data-placement="{{../preview}}">&nbsp;</a>\n        {{#if ../isImageFile }}\n        <a id="preview-{{../../id}}" href="javascript: void 0" style="z-index: 1;position: relative;">预览</a>\n        &nbsp;\n        {{/if}}\n        <a id="download-{{../id}}" target="_blank" href="./{{../url}}" style="z-index: 2;position: relative;">下载</a>\n        {{/preview}}\n    </td>\n</tr>');
    FilePicker = (function(_super) {
      __extends(FilePicker, _super);

      function FilePicker() {
        return FilePicker.__super__.constructor.apply(this, arguments);
      }

      FilePicker.prototype.getTemplate = function() {
        if (this.options.multiple === true) {
          return _.template('<div class="upload btn-toolbar">\n    <a id="trigger-<%= id %>" class="btn btn-small icon-cloud-upload">上传</a>\n    <a id="remove" href="javascript: void 0" class="btn btn-danger btn-small icon-minus">删除</a>\n</div>\n\n<input type="file" style="display:none" multiple="true" id="hidden-input-<%= id %>"/>\n<div id="grid_wrapper" class="dataTables_wrapper" role="grid">\n    <div class="c-grid-body">\n        <table style="width: 100%;" id="view416-grid" class="table table-striped table-bordered table-hover dataTable">\n            <thead>\n            <tr role="row">\n                <th class="sorting_disabled" tabindex="0" rowspan="1" colspan="1" aria-label="" style="width: 25px; text-align: center !important;"><input id="checkbox" type="checkbox"/></th>\n                <th class="sorting" tabindex="0" rowspan="1" colspan="1" aria-label="文件名: activate to sort column ascending">文件名</th>\n                <th class="sorting" tabindex="0" rowspan="1" colspan="1" aria-label="操作: activate to sort column ascending">操作</th>\n            </tr>\n            </thead>\n                <tbody id="files-container-<%= id %>" role="alert"></tbody>\n        </table>\n    </div>\n</div>');
        } else {
          return _.template('<div class="input-append c-picker">\n    <span class="uneditable-input">\n        <span id="percent-<%= id %>" class="label label-info"></span>\n        <span id="text-<%= id %>"><%= text %></span>\n    </span>\n    <span id="preview-span-<%= id %>"></span>\n    <span id="download-span-<%= id %>"></span>\n    <a id="trigger-<%= id %>" class="btn <%= triggerClass %>"><i class="icon-file-text"/></a>\n    <input type="file" style="display:none" id="hidden-input-<%= id %>"/>\n</div>');
        }
      };

      FilePicker.prototype.loadData = function(data) {
        var ctn, isImageFile, item, popover, trigger, value, _i, _len, _ref;
        FilePicker.__super__.loadData.apply(this, arguments);
        value = data[this.name];
        value = _.isString(value) ? {
          id: value
        } : value;
        this.setValue(value);
        this.setText(value != null ? value.filename : void 0);
        if (this.options.multiple && this.value) {
          ctn = this.container.find('#files-container-' + this.id);
          ctn.empty();
          this.datas || (this.datas = {});
          _ref = this.value || [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            item = _ref[_i];
            if (isImage(item.contentType)) {
              isImageFile = true;
            } else {
              isImageFile = false;
            }
            ctn.append(row({
              id: item.id,
              name: item.filename,
              url: this.options.url + '/' + item.id,
              isImageFile: isImageFile,
              preview: this.options.preview
            }));
            this.datas[item.id] = {
              result: item,
              uploaded: true
            };
            ctn.find('div.progress > div').addClass('bar-success').css('width', '100%');
            if (this.options.preview && item && item.id) {
              popover = $('#popover-span-' + item.id);
              this.setPopoverData(popover, this.options.url + '/' + item.id, item.id);
            }
          }
        }
        if (value && value.id) {
          trigger = this.container.find('#trigger-' + this.id);
          trigger.addClass('btn-danger');
          trigger.html('<i class="icon-remove"></i>');
          this.downloadSingle(this.options, this.id, value.id, this.id, this.options.url, value.contentType);
          return this.previewSingle(this.options, this.id, value.id, this.id, this.options.url, value.contentType);
        }
      };

      FilePicker.prototype.renderSingle = function(input) {
        var me, options, percent, trigger;
        me = this;
        percent = this.container.find('#percent-' + this.id);
        trigger = this.container.find('#trigger-' + this.id);
        options = _.extend({}, this.options, {
          fileInput: null,
          add: (function(_this) {
            return function(e, data) {
              var name;
              _this.value = null;
              percent.removeClass('label-success').removeClass('label-important').addClass('label-info');
              name = data.files[0].name;
              _this.setText(name);
              return data.process(function() {
                return input.fileupload('process', data);
              }).done(function(data) {
                return data.submit().done(function(res) {
                  me.downloadSingle(options, data.id, res.id, this.id, options.url, data.files[0].type);
                  return me.previewSingle(options, data.id, res.id, this.id, options.url, data.files[0].type);
                });
              }).fail(function(data) {
                if (data.files.error) {
                  percent.removeClass('label-success').removeClass('label-info').addClass('label-important');
                  percent.html('<i class="icon-remove"/>');
                  return _this.setText(data.files[0].error);
                }
              });
            };
          })(this),
          progress: function(e, data) {
            return percent.html((data.loaded / data.total).toFixed(2) * 100 + '%');
          },
          done: (function(_this) {
            return function(e, data) {
              percent.removeClass('label-info').removeClass('label-important').addClass('label-success');
              percent.html('<i class="icon-ok"/>');
              _this.setValue(data.result);
              trigger.addClass('btn-danger');
              return trigger.html('<i class="icon-remove"></i>');
            };
          })(this),
          fail: function(e, data) {
            percent.removeClass('label-info').removeClass('label-success').addClass('label-important');
            return percent.html('<i class="icon-remove"/>');
          }
        });
        input.fileupload(options);
        return input.change(function(e) {
          return input.fileupload('add', {
            files: e.target.files
          });
        });
      };

      FilePicker.prototype.renderMultiple = function(input) {
        var me, options;
        me = this;
        options = _.extend({}, this.options, {
          fileInput: null,
          add: (function(_this) {
            return function(e, data) {
              var d, f;
              d = _.extend({}, data, {
                id: _.uniqueId('u-data-')
              });
              f = d.files[0];
              _this.datas || (_this.datas = {});
              _this.datas[d.id] = d;
              return d.process(function() {
                return input.fileupload('process', data);
              }).done(function(a, b, c) {
                var tpl;
                tpl = row({
                  id: d.id,
                  name: f.name,
                  type: f.type,
                  size: calcSize(f.size),
                  isImageFile: isImage(f.type),
                  preview: options.preview
                });
                $(tpl).appendTo(_this.container.find('#files-container-' + _this.id));
                return d.submit().done(function(res) {
                  var download, popover;
                  if (options.preview) {
                    popover = $('#popover-span-' + this.id);
                    me.setPopoverData(popover, this.url + '/' + res.id, res.id);
                  }
                  download = $('#download-' + this.id);
                  return me.setDownloadData(download, this.url + '/' + res.id);
                });
              }).fail(function(dd) {
                var bar, tpl;
                tpl = row({
                  id: d.id,
                  name: dd.files[0].error,
                  type: f.type,
                  size: calcSize(f.size),
                  preview: options.preview
                });
                $(tpl).appendTo(_this.container.find('#files-container-' + _this.id));
                bar = _this.container.find('#bar-' + d.id);
                bar.css('width', '100%');
                return bar.removeClass('bar-success').addClass('bar-danger');
              });
            };
          })(this),
          progress: (function(_this) {
            return function(e, data) {
              var bar;
              bar = _this.container.find('#bar-' + data.id);
              if (bar.hasClass('bar-danger')) {
                return;
              }
              return bar.css('width', (data.loaded / data.total).toFixed(2) * 100 + '%');
            };
          })(this),
          done: (function(_this) {
            return function(e, data) {
              var bar;
              bar = _this.container.find('#bar-' + data.id);
              data.uploaded = true;
              bar.removeClass('bar-danger').addClass('bar-success');
              return _this.datas[data.id] = data;
            };
          })(this),
          fail: function(e, data) {
            var bar;
            bar = this.container.find('#bar-' + data.id);
            return bar.removeClass('bar-success').addClass('bar-danger');
          }
        });
        this.container.delegate('input[id="checkbox"]', 'click', (function(_this) {
          return function(e) {
            if ($(e.target).attr('checked')) {
              $(e.target).attr('checked', true);
              return $('tbody input[type="checkbox"]').attr('checked', true);
            } else {
              $(e.target).removeAttr('checked');
              return $('tbody input[type="checkbox"]').removeAttr('checked');
            }
          };
        })(this));
        this.container.delegate('a[id=^"remove"]', 'click', (function(_this) {
          return function(e) {
            return $('tbody input[type="checkbox"]').each(function(e) {
              var id;
              if ($(this).attr('checked')) {
                id = $(this).attr('id').match(/check-(.*)$/)[1];
                delete _this.datas[id];
                return $(this).closest('tr').remove();
              }
            });
          };
        })(this));
        if (this.options.preview) {
          this.container.delegate('a[id^="preview"]', 'click', (function(_this) {
            return function(e) {
              var id, popover;
              id = $(e.target).attr('id').match(/preview-(.*)$/)[1];
              popover = _this.container.find('#popover-span-' + id);
              return _this.popoverToggle(popover, _this.options.url + '/' + id, id);
            };
          })(this));
        }
        input.fileupload(options);
        input.change(function(e) {
          return input.fileupload('add', {
            files: e.target.files
          });
        });
        return this.getFormData = (function(_this) {
          return function() {
            var k, v, _ref, _results;
            _ref = _this.datas;
            _results = [];
            for (k in _ref) {
              v = _ref[k];
              if (v.uploaded === true) {
                _results.push(v.result['id']);
              }
            }
            return _results;
          };
        })(this);
      };

      FilePicker.prototype.setPopoverData = function(popover, url, id) {
        return popover.attr('data-content', '<img id="preview-img-' + id + '" class="upload-preview" src="' + url + '" />');
      };

      FilePicker.prototype.setDownloadData = function(download, url) {
        return download.attr('href', url);
      };

      FilePicker.prototype.popoverToggle = function(popover, url, id) {
        var me, _next;
        me = this;
        _next = popover.next();
        if (_next.hasClass('popover') && _next.css('display') === 'block') {
          return _next.hide();
        } else {
          $('a[id^="popover-span"]').each(function(e) {
            if ($(this).data('popover')) {
              return $(this).next().hide();
            }
          });
          popover.attr('data-content', popover.attr('data-content'));
          popover.popover({
            html: true
          });
          popover.popover('show');
          return $('#preview-img-' + id).click(function() {
            me.popoverToggle(popover, url, id);
            return window.open(url, id);
          });
        }
      };

      FilePicker.prototype.previewSingle = function(options, did, rid, $id, url, contentType) {
        var _preview, _url;
        if (isImage(contentType) === false) {
          return;
        }
        if (options.preview) {
          _url = url + '/' + rid;
          _preview = "<a id=\"popover-span-" + did + "\" class=\"btn btn-success upload-preview-btn\" data-rel=\"popover\" data-placement=\"" + options.preview + "\" style=\"margin-right:87px;\" data-content=\"<img id='preview-img-" + rid + "' class='upload-preview' src='" + _url + "'' />\"><i class=\"icon-eye-open\"/></a>\n<a id=\"preview-" + did + "\" class=\"btn btn-success\" href=\"javascript: void 0\"  style=\"margin-right:87px;\"><i class=\"icon-eye-open\"/></a>";
          $('#preview-span-' + did).html(_preview);
          return this.container.find('#preview-' + $id).click((function(_this) {
            return function(e) {
              var popover;
              popover = _this.container.find('#popover-span-' + $id);
              return _this.popoverToggle(popover, _url, rid);
            };
          })(this));
        }
      };

      FilePicker.prototype.downloadSingle = function(options, did, rid, $id, url, contentType) {
        var _download, _url;
        _url = url + '/' + rid;
        _download = "<a id=\"download-" + did + "\" class=\"btn btn-success\" href=\"" + _url + "\"  style=\"margin-right:43px;\"><i class=\"icon-download\"/></a>";
        return $('#download-span-' + did).html(_download);
      };

      FilePicker.prototype.render = function() {
        var input;
        if (this.renderred) {
          return;
        }
        this.renderred = true;
        this.container.html(this.getTemplate()(this));
        input = this.container.find('#hidden-input-' + this.id);
        if (this.options.multiple === true) {
          this.renderMultiple(input);
        } else {
          this.renderSingle(input);
        }
        return this.container.find('#trigger-' + this.id).click((function(_this) {
          return function(e) {
            var isdanger, popover, t, _next;
            t = $(e.currentTarget);
            if (isdanger = t.hasClass('btn-danger')) {
              _this.value = {
                id: ''
              };
              t.removeClass('btn-danger');
              t.html('<i class="icon-file-text"></i>');
              _this.container.find('#percent-' + _this.id).empty();
              _this.container.find('#text-' + _this.id).empty();
            } else {
              input.click();
            }
            if (_this.options.preview) {
              if (isdanger) {
                $('#preview-' + _this.id).css({
                  'margin-right': '-0.5px'
                });
                popover = $('#popover-span-' + _this.id);
                popover.css({
                  'margin-right': '-0.5px'
                });
                _next = popover.next();
                return _next.remove();
              }
            }
          };
        })(this));
      };

      return FilePicker;

    })(Picker.Picker);
    return cdeio.registerComponentHandler('file-picker', (function() {}), function(el, options, view) {
      var opt, picker;
      if (options == null) {
        options = {};
      }
      opt = _.extend({}, options, {
        view: view,
        container: el,
        chooserType: (function() {})
      });
      picker = new FilePicker(opt);
      picker.render();
      return picker;
    });
  });

}).call(this);