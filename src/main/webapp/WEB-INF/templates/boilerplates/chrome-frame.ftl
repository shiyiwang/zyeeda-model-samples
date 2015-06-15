<!--[if IE]>
    <style>
        .chromeFrameOverlayContent iframe {
            border-width: 0px;
        }
        .chromeFrameOverlayCloseBar {
            display: none;
        }
        .chromeFrameOverlayUnderlay {
        }
    </style>

    <script src="../scripts/cdeio/vendors/jquery/jquery.js"></script>
    <script src="../scripts/cdeio/vendors/chromeframe/CFInstall.min.js"></script>

    <script>
        // The conditional ensures that this code will only execute in IE,
        // Therefore we can use the IE-specific attachEvent without worry
        window.attachEvent("onload", function() {
            CFInstall.check({
                url: '../chrome-frame.html',
                mode: 'overlay',
                onmissing: function() {
                    $('.c-content .container-fluid').hide();
                }
            });
        });
    </script>
<![endif]-->
