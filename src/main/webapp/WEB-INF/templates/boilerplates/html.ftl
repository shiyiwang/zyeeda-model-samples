<#macro html basePath="">
<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">

        <title>工作包管理小系统</title>

        <meta name="viewport" content="width=device-width">

        <link rel="stylesheet" href="${basePath}scripts/cdeio/themes/ace.css">
        <link rel="stylesheet" href="${basePath}assets/styles/main.css">

        <!-- Le HTML5 shiv, for IE6-8 support of HTML5 elements -->
        <!--[if lt IE 9]>
        <script src="${basePath}scripts/libs/html5shiv.js"></script>
        <![endif]-->
        <script src="${basePath}scripts/cdeio/vendors/modernizr.js"></script>

        <!-- Le fav and touch icons -->
        <link rel="shortcut icon" href="${basePath}assets/images/favicon.ico" />
    </head>

    <#nested>
</html>
</#macro>
