define({
    layout: {
        regions: {
            nav: 'breadcrumbs',
            header: 'header'
        }
    },
    views: [{
        name: 'header',
        region: 'header'
    }, {
        name: 'inline:nav', region: 'nav', avoidLoadingHandlers: true,
        extend: {
            serializeData: function(su) {
                var data = su.apply(this);
                data = data || {};
                data.home = this.home;
                data.items = this.items;
                return data;
            }
        }
    }],

    extend: {
        setHome: function(su, home) {
            this.views['inline:nav'].home = home;
        },
        updateNavigator: function(su, menuItem) {
            var v = this.views['inline:nav'], m = menuItem;
            v.home.isLast = !menuItem;
            v.items = [];
            while (m) {
                v.items.unshift(m);
                m = m.parent;
            }
            if (v.items.length > 0) v.items[v.items.length -1].isLast = true;
            v.render();
        }
    }

});
