// Generated by CoffeeScript 1.7.1
(function() {
  define(['jquery'], function($) {
    var $html;
    $html = $('html');
    return function() {
      if ($.browser.msie === true) {
        $html.addClass('ie');
        $html.addClass("ie" + (parseInt($.browser.version)));
        return;
      }
      if ($.browser.webkit === true) {
        $html.addClass('webkit');
        return;
      }
      if ($.browser.mozilla === true) {
        $html.addClass('gecko');
        return;
      }
      if ($.browser.opera === true) {
        $html.addClass('opera');
      }
    };
  });

}).call(this);
