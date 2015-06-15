define(['jquery', 'underscore'], function($, _) {

    var findChildren = function(data, id) {
        var children = [];

        _.each(data, function(item) {
            if (!id && !item.parent) {
                children.push(item);
            } else if (item.parent && item.parent.id == id) {
                children.push(item);
            }
        });
        return children;
    }, parseData = function(data) {
        var roots = findChildren(data);
        _.each(roots, function(item) {
            item.children = findChildren(data, item.id);
        });
        return roots;
    };

    return {
        events: {
            'click parent-*': 'toggleSubMenu'
        },

        model: 'system/menu',

        extend: {
            serializeData: function(su) {
                var deferred = $.Deferred(), c = this.collection, data = su.apply(this), me = this;
                c.fetch().done(function() {
                    data.data = parseData(c.toJSON());
                    deferred.resolve(data);
                });
                return deferred.promise();
            }
        }
    };
});
