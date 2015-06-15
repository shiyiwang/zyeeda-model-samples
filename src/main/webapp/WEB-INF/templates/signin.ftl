<#import "boilerplates/signin.ftl" as bp>

<@bp.signin>
<form method="post">
    <div class="me-signin-form-above hidden-phone">
        <h4 class="me-signin-form-above-font">用户登录</h4>
    </div>
    <div class="me-signin-form-above-line"></div>
    <div class="me-signin-form">
        <#if request.getAttribute("signInFailure")??>
        <#assign signInFailure = request.getAttribute("signInFailure")>
        <div class="alert alert-error">
        <#if signInFailure == "org.apache.shiro.authc.UnknownAccountException" || signInFailure == "org.apache.shiro.authc.IncorrectCredentialsException">
            账户名或密码错误，请重试
        <#elseif signInFailure == "org.apache.shiro.authc.DisabledAccountException">
            账户被禁用
        <#elseif signInFailure == "INVALID_SIGN_IN_TOKEN">
            非法操作或页面已过期，请刷新后重试
        <#elseif signInFailure == "INVALID_CAPTCHA">
            验证码不正确，请重试
        <#elseif signInFailure == "REQUEST_TOO_FAST">
            登录过于频繁，请稍后重试
        <#else>
            未知登录错误，请重试或联系管理员
        </#if>
        </div>
        </#if>
        <div class="row-fluid">
            <div class="span12">
                <label class="me-signin-form-middle-font">用户名</label>
            </div>
        </div>
        <div class="row-fluid">
            <span class="block input-icon input-icon-right">
                <input id="username" name="username" type="text" class="input-block-level" />
                <i class="icon-user"></i>
            </span>
        </div>
        <div class="row-fluid">
            <div class="c-password">
                <label class="me-signin-form-middle-font">密码</label>
            </div>
        </div>
        <div class="row-fluid">
            <span class="block input-icon input-icon-right">
                <input id="password" name="password" type="password" class="input-block-level" />
                <i class="icon-lock"></i>
            </span>
        </div>
        <#if request.getAttribute("signInToken")??>
        <#assign signInToken = request.getAttribute("signInToken")>
        <#if signInToken.isCaptchaRequired()>
        <div class="row-fluid">
            <div class="c-captcha-label">
                <label><strong>验证码</strong></label>
            </div>
            <div class="c-captcha-unclear">
                <a class="c-change-captcha" href="javascript:changeCaptcha();">看不清楚?</a>
            </div>
        </div>
        <div class="row-fluid">
            <div class="span8">
                <input name="captcha" type="text" class="input-block-level" />
            </div>
            <div class="span4">
                <img id="captcha" src="../captcha.jpg" alt="验证码" />
            </div>
        </div>
        </#if>
        </#if>
    </div>
    <div class="me-signin-form-below">
        <div class="row-fluid">
            <div class="me-remember-me">
                <label>
                    <input name="rememberMe" type="checkbox" value="rememberMe">
                    <span class="me-signin-form-below-font">&nbsp;保持登录状态</span>
                </label>
            </div>
            <div class="c-signin-btn">
                <button class="btn btn-small btn-primary me-signin-form-btn" type="submit"><i class="icon-key icon-white c-icon-small"></i>&nbsp;<strong class="me-signin-form-font">登&nbsp;录</strong></button>
            </div>
        </div>
    </div>
</form>

<script>
    window.onload = function() {
        document.getElementById('username').focus();
    }

    function changeCaptcha() {
        document.getElementById('captcha').setAttribute('src', '../captcha.jpg?' + new Date().getTime());
    }
</script>
</@bp.signin>
