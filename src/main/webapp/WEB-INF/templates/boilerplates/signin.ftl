<#import "html.ftl" as bp>

<#macro signin>
<@bp.html basePath="../">
<body>
    <#include "chrome-frame.ftl">

    <div class="c-content">
        <div class="c-content-bg">
            <img src="../assets/images/background.jpg" />
        </div>
        <div class="c-header hidden-phone me-signin-title">
            <img src="../assets/images/title.png" />
        </div>
        <div class="container-fluid">
            <div class="row-fluid">
                <div class="span5 offset1 hidden-phone">
                    <div class="c-padding"></div>
                    <div class="row-fluid">
                        <div class="span12">
                            <img src="../assets/images/system-signin-logo.png" />
                        </div>
                    </div>
                </div>
                <div class="span1"></div>
                <div class="span3">
                    <div class="c-padding hidden-phone"></div>
                    <div class="row-fluid">
                        <div class="span12">
                            <div class="c-signin-content">
                                <#nested>
                            </div>
                        </div>
                    </div>
                    <div class="row-fluid">
                        <div class="span12">
                            <div class="me-copyright">
                                <strong>超高压输电公司 &copy; 版权所有</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</@bp.html>
</#macro>
