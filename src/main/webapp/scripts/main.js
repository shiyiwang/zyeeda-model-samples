if (window !== top) {
    top.$('#LOGIN-DIALOG').modal('hide');
} else {
    define([
        'jquery',
        'cdeio/cdeio',
        'application',
        'vendors/jquery/jquery.isotope.min',
        'vendors/jquery/jquery.colorbox'
    ], function ($, cdeio) {

        $(function() {
            var app = window.app = cdeio.startApplication('application');
        });

    });
}

