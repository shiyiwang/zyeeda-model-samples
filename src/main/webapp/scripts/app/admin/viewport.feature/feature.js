define({
    layout: {
        regions: {
            breadcrumbs: 'breadcrumbs'
        }
    },

    views: [{
        name: 'inline:breadcrumbs', region: 'breadcrumbs', avoidLoadingHandlers: true,
        extend: {
            serializeData: function(_super) {
                var data = _super.apply(this);
                data = data || {};
                data.home = this.home;
                data.items = this.items;
                return data;
            },
            afterRender: function(su) {
                var me = this,
                    searchArea = me.$('nav-search'),
                    searchForm = me.$('nav-search > form'),
                    searchInput = me.$('nav-search-input');

                //只在试题库管理菜单显示全文检索搜索框
                if('#feature/exam/category-question' === location.hash){
                    searchForm.bind("submit",function(){
                        var grid = app.findModule('exam').findFeature('question').views['grid:body'].components[0],
                            tree = app.findModule('exam').findFeature('category').views['tree:body'].components[0],
                            treeNode = tree.getSelectedNodes(true)[0] || {isRoot: true},
                            defaultFilters = ['like', 'category.path', treeNode.path, { mode: 'start' }];

                        if (treeNode.isRoot) {
                            grid.removeFilter(defaultFilters);
                        } else {
                            grid.addFilter(defaultFilters);
                        }

                        grid.addFilter(['like', 'searchContent', searchInput.val()]);

                        grid.refresh();
                    });
                    searchArea.show();
                }else{
                    searchArea.hide();
                }

                return su.apply(this);
            }
        }
    }],

    extend: {
        onStart: function(_super) {
            var header, sidebar, content, d1, d2, d = $.Deferred();

            app.viewport = this;

            header = this.layout.$('header');
            sidebar = this.layout.$('sidebar');
            content = this.layout.$('content');

            app.startFeature('commons/header', { container: header, ignoreExists: true }).done(function (headerFeature) {
                d1 = app.startFeature('admin/account-menu', { container: headerFeature.views['inline:inner-header'].$('notification'), ignoreExists: true });
            });
            d2 = app.startFeature('cdeio:menu', { container: sidebar, ignoreExists: true }).done(function(feature) {
                app.menuFeature = feature;
            });

            app.config.featureContainer = content;

            this.setHome({ name: '首页', featurePath: 'admin/home', iconClass: 'icon-home' });
            this.updateNavigator();

            $.when(d1, d2).then(function() {
                d.resolve();
            });

            return d.promise();
        },

        onStop: function(_super) {
            var commonsModule, adminModule;

            app.menuFeature.stop();

            commonsModule = app.findModule('commons');
            commonsModule.findFeature('header').stop();

            adminModule = app.findModule('admin');
            adminModule.findFeature('account-menu').stop();
        },

        setHome: function(_super, home) {
            this.views['inline:breadcrumbs'].home = home;
        },

        updateNavigator: function(_super, menuItem) {
            var v = this.views['inline:breadcrumbs'], menu;
            if (menuItem) {
                menu = menuItem.toJSON();
            }

            v.home.isLast = !menuItem;
            v.items = [];
            while (menu) {
                v.items.unshift(menu);
                menu = menu.parent;
            }
            if (v.items.length > 0) {
                v.items[v.items.length - 1].isLast = true;
            }
            v.render();
        }
    }
});
