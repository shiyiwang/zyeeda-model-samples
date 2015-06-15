<#import "boilerplates/html.ftl" as bp>

<@bp.html>
<body>
    <#include "boilerplates/chrome-frame.ftl">

    <!--[if !IE]> -->
    <script src="scripts/cdeio/require-config.js"></script>
    <script src="scripts/require-config.js"></script>
    <script data-main="scripts/main.js" src="scripts/cdeio/vendors/require/require.js"></script>
    <!-- <![endif]-->
    <!--<script src="scripts/cdeio/cdeio.js"></script>-->
</body>
</@bp.html>
