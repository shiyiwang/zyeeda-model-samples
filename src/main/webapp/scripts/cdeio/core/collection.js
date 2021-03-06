// Generated by CoffeeScript 1.7.1
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['backbone'], function(Backbone) {
    var Collection;
    Collection = (function(_super) {
      __extends(Collection, _super);

      function Collection() {
        return Collection.__super__.constructor.apply(this, arguments);
      }

      Collection.prototype.url = function() {
        if (this.feature.activeTab) {
          this._url = new this.model().url();
        } else {
          if (!this._url) {
            this._url = new this.model().url();
          }
        }
        return this._url;
      };

      Collection.prototype.parse = function(data) {
        this.recordCount = data.recordCount;
        this.firstRecord = data.firstRecord;
        return data.results;
      };

      return Collection;

    })(Backbone.Collection);
    return Collection;
  });

}).call(this);
