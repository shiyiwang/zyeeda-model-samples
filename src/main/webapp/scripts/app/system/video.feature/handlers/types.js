define({
    showType: function(e) {
        var el = $(e.target), type = el.data('option-value'), ul = el.parents('ul'),
            comp = this.feature.views['inline:content'].isotope;
        if (!comp) return;
        ul.find('.active').removeClass('active');
        el.parent().addClass('active');
        comp.isotope({filter: type});
    }
});
