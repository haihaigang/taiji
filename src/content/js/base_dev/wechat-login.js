/**
 * 微信自动登录
 * 说明：
 * 1. 不存在code参数跳转到微信授权页面，
 * 2. 存在则调用接口获取用户信息（一般会实现登录功能）
 * 3. 登录成功后去除code参数再次跳转到当前页
 **/
(function(WechatCommon) {

    /**
     * 登录
     */
    var Login = function() {
        this._isLogining = false;
        this._oAuthUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=APPID&redirect_uri=REDIRECT_URI&response_type=code&scope=SCOPE&state=STATE&connect_redirect=1#wechat_redirect'; //微信授权跳转地址
    }

    // 继承Base
    Login.prototype = new WechatCommon.Base();

    //自动登录
    Login.prototype.login = function(fn) {
        var code = Tools.getQueryValue('code');

        if(!Tools.isWeChatBrowser()){
            return;
        }

        if (this._isLogining) return; //过滤多次的登录请求

        this._isLogining = true;

        if (void 0 === code || "" == code) {
            //尤其注意：由于授权操作安全等级较高，所以在发起授权请求时，微信会对授权链接做正则强匹配校验，如果链接的参数顺序不对，授权页面将无法正常访问
            //?appid=APPID&redirect_uri=REDIRECT_URI&response_type=code&scope=SCOPE&state=STATE&connect_redirect=1#wechat_redirect
            var n = location.origin + Tools.removeParamFromUrl(["from", "code", "share_id", "isappinstalled", "state", "m", "c", "a"]),
                t = this._oAuthUrl;

            t = t.replace('APPID', this._appId).replace('REDIRECT_URI', encodeURIComponent(n)).replace('SCOPE', 'snsapi_userinfo');
            location.href = t;
        } else {
            this._ajaxSend({
                url: '/members/signin/wechat',
                data: {
                    code: code
                },
                type: 'POST',
                contentType: 'application/json'
            }, function(response) {
                this._isLogining = false;
                fn && fn(response);
            }, function(textStatus, data) {
                console.error(data.message);
                this._isLogining = false;
            })
        }
    }

    WechatCommon.Login = new Login();
})(WechatCommon);
