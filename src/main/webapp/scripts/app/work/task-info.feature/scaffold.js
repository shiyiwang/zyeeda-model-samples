define([
    'jquery',
    'cdeio/core/loader-plugin-manager'
], function ($, LoaderManager) {
    return {
        afterShowDialog: function(dialogType, v, data){
            var me = this;
            if ('show' === dialogType) {
                me.feature.model.set('workPackage.code', data.workPackage.code);
                me.feature.model.set('workPackage.name', data.workPackage.name);
            }

            me.feature.views['form:' + dialogType].setFormData(me.feature.model.toJSON(), true);
        }
    };
});
