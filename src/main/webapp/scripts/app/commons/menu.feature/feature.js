define(['underscore'], function(_) {
    return {
        layout: {
            regions: {
                center: 'center',
                bottom: 'sidebar-collapse'
            }
        },

        views: [{
            name: 'menu', region: 'center'
        }, {
            name: 'inline:tool', region: 'bottom',
            events: {
                'click btn': 'minMenu'
            }
        }],

        extend: {
            activateMenu: function(_super, url) {
                var menuView, models, menuModel, menuItem;

                menuView = this.views.menu;
                models = menuView.collection.where({ path: url });
                if (models.length > 0) {
                    menuModel = models[0];
                    menuItem = menuView.$('child-' + menuModel.get('id')).parent();
                    this._lightUpMenu(menuItem);
                    return menuModel;
                }
            },

            /**
             * @param   menuItem    should be an LI element
             */
            _lightUpMenu: function(_super, menuItem) {
                var subMenuContainer;

                menuItem.parents('ul.nav').find('.active').removeClass('active');

                subMenuContainer = menuItem.parents('ul.submenu');
                if (subMenuContainer.length > 0) {
                    if (!subMenuContainer.is(':visible')) {
                        this._openSubMenu(subMenuContainer);
                    }
                    subMenuContainer.parent().addClass('active');
                }
                menuItem.addClass('active');
            },

            /**
             * @param   menuItem    should be a UL element
             */
            _openSubMenu: function(_super, menuItem, options) {
                options = _.extend({}, options);

                if (this._isMiniMenu(menuItem)) {
                    return false;
                }
                if (options.enableAnimation) {
                    menuItem.slideToggle(200).parent().addClass('open');
                } else {
                    menuItem.show().parent().addClass('open');
                }
            },

            /**
             * @param   menuItem    should be a UL element
             */
            _closeSubMenu: function(_super, menuItem, options) {
                options = _.extend({}, options);

                if (this._isMiniMenu(menuItem)) {
                    return false;
                }
                if (options.enableAnimation) {
                    menuItem.slideToggle(200).parent().removeClass('open');
                } else {
                    menuItem.hide().parent().removeClass('open');
                }
            },

            _isMiniMenu: function(_super, menuItem) {
                return menuItem.prev().hasClass('menu-min');
            }

        }
    };

});
