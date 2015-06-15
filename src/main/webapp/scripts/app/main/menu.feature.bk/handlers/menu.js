define(['jquery'], function($) {
    return {
        startFeature: function(e) {
            var t = $(e.target), app = this.feature.module.getApplication(), el = this.feature.layout.$el;
            if (!t.is('a')) t = t.parents('a');

            var item = this.collection.get(t.data('id')).toJSON();
            if (item.featurePath == 'main/home') {
                app.viewport.setHome(item);
                app.viewport.updateNavigator();
            } else {
                app.viewport.updateNavigator(item);
            }
            app.startFeature(item.featurePath, item);

            el.find('.active').removeClass('active');
            t.parent().addClass('active');
            if (t.parent().parent().hasClass('submenu')) {
                t.parent().parent().parent().addClass('active');
            }
        },

        toggleChild: function(e) {
            var t = $(e.target), el = this.feature.layout.$el;
            if (el.hasClass('menu-min')) return false;
            if (!t.is('a')) t = t.parents('a');

            var ul = t.next();
            if (!$(ul).is(':visible')) {
                el.find('.open > .submenu').each(function(){
                    if(this!=ul&&!$(this.parentNode).hasClass("active")){
                        $(this).slideUp(200).parent().removeClass("open");
                    }
                });
            }
            $(ul).slideToggle(200).parent().toggleClass("open");
            return false;
        }
    };
});
