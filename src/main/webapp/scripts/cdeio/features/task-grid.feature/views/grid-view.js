// Generated by CoffeeScript 1.7.1
(function() {
  define({
    events: {
      'this#grid:onSelectRow': 'selectChanged'
    },
    model: function() {
      return this.feature.startupOptions.model;
    },
    components: [
      function() {
        return {
          type: 'grid',
          selector: 'grid',
          pager: 'pager',
          columns: this.feature.startupOptions.columns
        };
      }
    ]
  });

}).call(this);
