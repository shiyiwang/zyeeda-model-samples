define([
    'jquery',
    'cdeio/core/loader-plugin-manager'
], function ($, LoaderManager) {
    return {
        afterShowDialog: function (dialogType, view, data) {
            var me = this;

            if ('edit' === dialogType) {
                $('input[name="businessMark"]', view.$el).attr('disabled', true);
            }
        }
    };
});
