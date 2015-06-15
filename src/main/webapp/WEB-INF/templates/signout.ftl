<#import "boilerplates/html.ftl" as bp>

<@bp.html>
<body class="c-green-background">
    <div class="c-header">
        <div class="c-logo"></div>
    </div>
    <div class="container-fluid c-content">
        <div class="row-fluid">
            <div class="span5 offset1 hidden-phone c-sso-signout-left">
                <img src="../assets/images/system-signout-logo.png" />
            </div>
            <div class="span4 c-sso-signout-right">
                <h2>系统成功退出!</h2>
                <div>您已安全退出单点登录服务，请关闭浏览器。</div>
                <br />
            </div>
        </div>
    </div>
</body>
</@bp.html>
