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
        var roots = findChildren(data),
            urls = [],
            menus = [],
            ajaxResult = [],
            permissionMenus = [],
            childPath = '',
            children = [],
            itemChildren = [],
            itemPath = '',
            urlFeatureMap = app.settings.currentUser.urlFeatureMap,
            newurlFeatureMap = [];

        $.ajax({
            type: 'get',
            url: 'invoke/scaffold/system/accounts/userpermissions',
            data: {},
            cache: false,
            async: false
        }).done(function ( results ) {
            ajaxResult = results;
        });

        _.each(ajaxResult, function(v) {
            permissionMenus.push((v + '').replace(":show", ""));
        });

        for(var key in urlFeatureMap){
            newurlFeatureMap[key] = (urlFeatureMap[key] + '').replace("scaffold:", "");
        }

        _.each(roots, function(item) {
            itemPath = (item.path + '').replace("#", "");
            item.children = findChildren(data, item.id);
            children = [];

            _.each(item.children, function(child) {
                childPath = (child.path + '').replace("#", "");
                if($.inArray(newurlFeatureMap[childPath], permissionMenus) !== -1){
                    children.push(child);
                }
            });

            item.children = children;

            if(item.children.length > 0){
                menus.push(item);
            }else{
                if($.inArray(newurlFeatureMap[itemPath], permissionMenus) !== -1){
                    menus.push(item);
                }
            }
        });
        return menus;
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
