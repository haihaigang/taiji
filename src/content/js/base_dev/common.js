/**
 * 过滤http拦截，这里需要尽可能在自定义的代码之前
 */
(function() {
    if (!config.IS_FILTER_ON || !('MutationObserver' in window)) {
        return;
    }

    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            var nodes = mutation.addedNodes;
            for (var i = 0; i < nodes.length; i++) {
                if (nodes[i].nodeName == 'SCRIPT' && !_isWhite(nodes[i].src)) {
                    nodes[i].src = '';
                }
            }
        });
    });

    observer.observe(document, { //初始化行为
        childList: true,
        subtree: true
    });

    function _isWhite(url) {
        if (!config.WHITELISTS) {
            return true;
        }
        //添加当前域名
        config.WHITELISTS.push(location.hostname);

        if (!url) {
            return true;
        }

        if (url.indexOf('//') != 0 && url.indexOf('http://') != 0 && url.indexOf('https://') != 0) {
            return true;
        }
        var obj = url.replace('https://', '').replace('http://', '').replace('//', '');
        var obj = obj.split('/');

        var flag = false;
        for (var i in config.WHITELISTS) {
            if (obj[0].indexOf(config.WHITELISTS[i]) != -1) {
                flag = true;
                break;
            }
        }
        console.log(url + ' is white? ' + flag);

        return flag;
    }
})();

/**
 * webp相关
 */
(function() {
    var Webp = {
        isDetecting: true, //是否正在检测
        isSupport: false, //是否支持
        /**
         * 获取浏览器兼容结果，兼容true否则false
         * @return boolean
         */
        getSupport: function() {
            if (!config.IS_WEBP_ON || this.isDetecting) {
                return false;
            }
            // 暂时先不开启，等待app
            // if(Tools.isRbyIosAppBrowser() && Tools.getAppVersion() >= 251){
            //     // 在iosapp的251版本之后默认都开启webp
            //     return true;
            // }
            return this.isSupport;
        },
        /**
         * 检测当前客户端是否兼容webp
         */
        detect: function() {
            var img = new Image();
            img.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
            img.onload = img.onerror = function() {
                Webp.isDetecting = false;
                if (img.width === 2 && img.height === 2) {
                    Webp.isSupport = true;
                } else {
                    Webp.isSupport = false;
                };
            };
        }
    };

    Webp.detect(); //这里需要尽可能早地检测兼容性，以便能尽可能早地使用

    window.Webp = Webp;
})();

/**
 * TODO 根据具体业务逻辑修改
 */
(function() {
    var common = {},
        $body=$("body");


    //获取登录的id
    common.getId = function() {
        var auth = Cookie.get(Storage.AUTH);
        return auth;
    };


    //是否从APP跳转过来
    common.isFromApp = function() {
        return "app" == Tools._GET().source;
    }

    //自动登录
    common.login = function() {
        var appId = config.APPID,
            code = Tools.getQueryValue('code'),
            loginForm = $('#login-form');

        if (Tools.isRbyAppBrowser()) { //APP内嵌
            Jiao.noticeIsLogout();
            common.resetBtn && common.resetBtn();
            return;
        }

        if (!Tools.isWeChatBrowser() && !Tools.isRbyAppBrowser() && loginForm.length > 0) { //非微信 且 非APP 且 团购详情页面
            $('#tj-cover-bg').show();
            loginForm.show();
            showAccount();
            $('.btn-add-cart').removeClass('disabled').text('我要开团');
            return;
        } else if (!Tools.isWeChatBrowser() && !Tools.isRbyAppBrowser()) {
            Tools.alert('测试');
            return;
        }

        if (common.isLogining) return; //过滤多次的登录请求

        common.isLogining = true;

        Tools.alert("code: " + code);
        if (void 0 === code || "" == code) {
            //尤其注意：由于授权操作安全等级较高，所以在发起授权请求时，微信会对授权链接做正则强匹配校验，如果链接的参数顺序不对，授权页面将无法正常访问
            //?appid=APPID&redirect_uri=REDIRECT_URI&response_type=code&scope=SCOPE&state=STATE&connect_redirect=1#wechat_redirect
            var n = location.origin + Tools.removeParamFromUrl(["from", "code", "share_id", "isappinstalled", "state", "m", "c", "a"]),
                t = config.OAUTHURL;

            t = t.replace('APPID', appId).replace('REDIRECT_URI', encodeURIComponent(n)).replace('SCOPE', 'snsapi_userinfo');
            // document.write(t);
            location.href = t;
        } else {
            Cookie.set('hasLoad', '', -1); //若有登录，需清空弹出窗口的记录标志
            Ajax.custom({
                url: config.HOST_API + '/account/autoLogin',
                data: {
                    code: code
                }
            }, function(response) {
                common.isLogining = false;
                if (response.code != 0) {
                    Tools.alert(response.message);
                    return;
                }
                var o = response.body;
                Cookie.set("AccessToken", o.accessToken, null);
                Cookie.set("OpenId", o.openId, null);
                Cookie.set("UserSN", o.userId, 0);
                Cookie.set("IsBind", o.isBind, null);
                Tools.alert("UserSN: " + Cookie.get("UserSN"));
                // 存储登陆信息
                Storage.set("AccessToken", o.ssid);
                Storage.set('UserSN', o.openId);
                location.href = Tools.removeParamFromUrl(["code"]);
            }, function() {
                common.isLogining = false;
            })
        }
    }

    //检查当前登录状态
    common.checkLoginStatus = function(fn) {
        common.init = fn;
        var userSn = Cookie.get("UserSN");
        if (Tools.isWeChatBrowser() && !this.isFromApp()) {
            if (userSn) {
                Tools.alert("good token & app id");
                //确保登录后在加载数据
                fn && fn();
            } else {
                common.login();
            }
        } else if (Tools.isRbyAppBrowser()) {
            //从app过来，默认设置key作为登陆识别，默认当作app的用户都是已绑定账号
            var key = Tools._GET().key,
                token = Tools._GET().token,
                userToken = Tools._GET().UserToken;
            if (key) {
                Cookie.set('UserSN', key);
                Storage.set('UserSN', key);
            }
            if (token) {
                log('set token ' + token);
                Cookie.set('RBYAIRID', token);
                Storage.set('AccessToken', token);
            } else if (userToken) {
                Storage.set('AccessToken', userToken);
            }
            Cookie.set('IsBind', 1);
            $('body').addClass('app'); //添加全局标识样式，用于区分不同环境定义不同内容

            fn && fn();
        } else {
            Tools.alert('非微信浏览器');
            fn && fn();
        }
        // 避免每次都请求,在这里全局调用
        common.getCartNumber();
    }

    /**
     * 开放给app调用的登陆入口
     * @param  {[type]} key APP登陆后的用户标识,eg：openId
     * @return {[type]}     [description]
     */
    common.loginForApp = function(key) {
        Cookie.set('UserSN', key);
        typeof common.init == 'function' && common.init();
    }


    var onlyFirst = false; // 倒计时标志，确保只初始化一次

    /**
     * 自定义倒计时
     * @return {[type]} [description]
     */
    common.initCountDown = function(serverTime, sel) {
        if (onlyFirst) {
            return;
        }
        onlyFirst = true;

        var tick = 0,
            serverTime = parseInt(serverTime);
        setInterval(function() {
            $(sel).each(function(i, d) {
                var endTime = $(this).attr('data-end');
                $(this).text(Tools.getRunTime(serverTime + tick, endTime));
            })
            tick++;
        }, 1000)
    }

    /**
     * 自定义延迟加载图片
     * @param  {[type]} sel 图片选择器
     * @return {[type]}
     */
    common.lazyload = function(sel) {
        var dh = $(document).height(), //内容的高度
            wh = $(window).height(), //窗口的高度
            st = 0; //滚动的高度

        $(window).scroll(function() {
            st = $(window).scrollTop();
            init();
        })

        setTimeout(init, 200);

        function init() {
            $(sel).each(function(i, d) {
                var obj = $(this);
                if (obj.hasClass('loaded') || obj.attr('data-src') == '') return;
                /*obj.get(0).onload=function(){
                 var diff_time=new Date().getTime()-window.start_time;
                 obj.attr("data-load",diff_time)

                 }*/
                var d = obj.offset(),
                    h = obj.height() + 8;
                if ((d.top + h) >= st && d.top < (st + wh * 2)) {
                    obj.attr('src', obj.attr('data-src')).addClass('loaded');
                }
            })
        }
    }

    /**
     * 自定义延迟加载图片 window无法滚动使用
     * @param  {[type]} sel 图片选择器  ele 滚动容器选择器 (必须有内层子元素)
     * @return {[type]}
     */
    common.lazyloadforWindow = function(sel,ele) {
        var wh = $(window).height(), //窗口的高度
            st = 0,
            ele_obj= $(ele),
            ele_son_obj=ele_obj.children()
            ; //滚动的高度
        ele_obj.scroll(function() {
            st = ele_obj.scrollTop();
            init();
        })
        setTimeout(init, 200);

        function init() {
            $(sel).each(function(i, d) {
                var obj = $(this);
                if (obj.hasClass('loaded') || obj.attr('data-src') == '') return;
                /*obj.get(0).onload=function(){
                 var diff_time=new Date().getTime()-window.start_time;
                 obj.attr("data-load",diff_time)

                 }*/
                var d = obj.offset().top-ele_son_obj.offset().top,
                    h = obj.height() + 8;
                if ((d + h) >= st && d < (st + wh * 2)) {
                    obj.attr('src', obj.attr('data-src')).addClass('loaded');
                }
            })
        }
    }

    //点击加载下一页
    $(document).on('click', '.nextpage', function(response) {
        if ($(this).hasClass('disabled')) return;
        config.page++;
        common.getList && common.getList();
    })

    //滚动到底自动加载下一页
    $(window).scroll(function() {
        if ($('.nextpage').length == 0 || $('.nextpage').hasClass('disabled')) return;
        var currentHttpUrl = location.href;
        var goodsListPage = $('#goodsPage');
        if (goodsListPage && currentHttpUrl.indexOf('goods/goods-detail.html') > 0 && goodsListPage.css('display') == 'none') {
            config.page = config.page;
        } else {
            var st = $(window).scrollTop(),
                wh = $(window).height(), //窗口的高度
                d = $('.nextpage').offset();


            if (d.top < (st + wh * 3 / 2)) {
                config.page++;
                common.getList && common.getList();
                $('.nextpage').addClass("disabled")
            }
        }
    })

    //关闭参与活动界面
    function closeResult() {
        $('#tj-cover-bg').hide();
        $('#tj-join').hide();
    }

    $('.join-close').click(function(e) {
        closeResult();
    })

    $('#tj-cover-bg').click(function(e) {
        closeResult();
    })

    if (document.getElementById('tj-cover-bg')) {
        //取消遮罩层的默认滑动
        document.getElementById('tj-cover-bg').addEventListener('touchmove', function(e) {
            e.preventDefault();
        }, true);
    }

    //回到顶部
    $('.back-top').click(function(e) {
        e.preventDefault();

        window.scrollTo(0, 0);
    });

    // 分享
    $('.footer-share').click(function() {
        if (Tools.isRbyAppBrowser()) {
            Jiao.toShare();
            return;
        }
        $('#tj-cover-bg').show();
        $('.dialog-con').show();
    })

    //测试用，登录
    common.abcLogin = function(phone, pwd) {
        // 先试图从本地存储获取数据，以便测试
        var localAccount = Storage.get('ACCOUNT');
        if (localAccount) {
            phone = localAccount.phone;
            pwd = localAccount.password;
        }

        Ajax.custom({
            url: config.HOST_API_APP + '/account/login',
            data: {
                phone: phone || 'wxo7iUTwjefCJIQ6Vp5tkyFGn6aTI4',
                password: pwd || '123456'
            },
            type: 'POST'
        }, function(response) {
            Cookie.set('IsBind', 1);
            Storage.set("AccessToken", response.message);
            Storage.set('UserSN', response.body.memberId);
            Cookie.set('UserSN', response.body.memberId);
            return ('登录成功');
        })
    };
    //测试用，找回密码
    common.abcFindPassword = function(phone, password, vcode) {
        if (!phone) {
            log('手机号必须');
            return;
        }
        if (!password) {
            Ajax.custom({
                url: config.HOST_API + '/../account/sendvcode',
                data: {
                    phone: phone,
                    type: 1
                },
                type: 'POST'
            }, function(response) {
                log('发送验证码成功')
            });
        } else {
            Ajax.custom({
                url: config.HOST_API + '/../account/forget',
                data: {
                    phone: phone,
                    password: password,
                    vcode: vcode,
                },
                type: 'POST'
            }, function(response) {
                log('找回密码成功')
            });
        }
    };
    //记录上次的浏览位置
    common.historyScorll =function(){
        var scrollTop
        window.onscroll = function(){
            scrollTop=$body.scrollTop();
            Storage.set(location.pathname,scrollTop)
        }
        return scrollTop
    }
    //滚动到上次的浏览位置
    common.getHistoryScorll =function(){
        var scroll=Storage.get(location.pathname);
        if(!scroll) return;
        $body.scrollTop(scroll)
        Storage.remove(location.pathname)
    }

    window.common = common;

    if ('FastClick' in window)
        FastClick.attach(document.body);

    // 控制登陆框样式
    function showAccount() {
        var width = $(window).width(),
            height = $(window).height(),
            accountHeight = $('.account').height(),
            left = (width - 300) / 2,
            top = (height - accountHeight) / 3.5;
        $('.account').css({
            'left': left,
            'top': top
        });
        return;
    }


    //点击页面底部的跳转
    $('.container').on('click', '.bottom-link', function(e) {
        e.preventDefault();
        // 专题团详情 一起买详情点击不做跳转
        var pathname = window.location.pathname;
        if (pathname == '/group/activity-detail.html' || pathname == '/pin/group-detail.html' || pathname == '/pin/detail.html') {
            return;
        }
        Go.toCategory();
    });

    //微信中设置title属性
    common.setWechatTitle = function(title) {
        var $body = $('body');
        document.title = title ? title : '';
        var $iframe = $('<iframe src="/favicon.ico" style="display:none;"></iframe>');
        $iframe.on('load', function() {
            setTimeout(function() {
                $iframe.off('load').remove();
            }, 0);
        }).appendTo($body);
    };

})();


/**
 * 购物车数量相关
 */
(function() {

    common.cartNum = 0; //购物车初始商品数量

    // 获取购物车数量
    common.getCartNumber = function() {
        if (Tools.isRbyAppBrowser() || ($('#cart-num').length == 0 && $('.main-nav').length == 0)) {
            //内嵌app或者没有购物车图片存在的页面则不加载
            return;
        }

        Ajax.custom({
            url: config.HOST_API_APP + '/shopping/cart/getCartNum',
        }, function(response) {
            common.cartNum = response.body.cartNum;
            initCartNum();
        });
    };

    //更改购物车数量，若在app中通知native否则直接更改相关dom
    common.noticeCart = function(isPlus) {
        if (Tools.isRbyAppBrowser()) {
            Jiao.noticeCart('');
        } else {
            common.getCartNumber();
        }
    };

    function initCartNum() {
        var num = common.cartNum
        if (num > 0) {
            if (num > 9) {
                num = 9 + '+';
            }
            //直接操作DOM 获取返回值
            $('#cart-num').text(num).show();
            $('.main-nav .footer-item:nth-child(4) em').text(num).show();
        } else {
            $('#cart-num').hide();
            $('.main-nav .footer-item:nth-child(4) em').hide();
        }
    }
})();

//sidefunction  右侧方法按钮 返回顶部
(function() {
    if ($(".side-function").length <= 0) return;
    var btn = $(".side-function .side-function-button a.hide"),
        $window = $(window),
        btnAnimate = null, //按钮动画
        scrollAnimate = null, //滚动条滑动
        mainContainer=null,
        w_h = $window.height();


    btn.click(function(e) {
        var obj=mainContainer?mainContainer:$window;
        e.preventDefault();
        var scrollTop = obj.scrollTop(),
            temp = scrollTop;
        clearInterval(scrollAnimate)
        scrollAnimate = setInterval(function() {
            if (temp <= 0) {
                clearInterval(scrollAnimate);
                return
            }
            obj.scrollTop(temp - scrollTop / 10);
            temp = temp - scrollTop / 10
        }, 5)
    });

    $window.on("touchstart", function() {
        clearInterval(scrollAnimate)
    });

    $window.on("scroll", function() {
        clearTimeout(btnAnimate)
        if ($window.scrollTop() > w_h) {
            btn.addClass("active");
            btnAnimate = setTimeout(function() {
                btn.css("opacity", 1);
            }, 300)
        } else {
            btn.css("opacity", 0);
            btnAnimate = setTimeout(function() {
                btn.removeClass("active");
            }, 300)
        }
    })

    //点击跳转到购物车
    $(".side-function-cart a").click(function(e) {
        e.preventDefault();
        var src = $(this).attr("href");
        if (Tools.isRbyAppBrowser()) {
            Jiao.toCart()
        } else {
            location.href = src;
        }
    })
    window.setSideMain=function(obj){
        mainContainer=obj
        obj.on("scroll", function() {
            clearTimeout(btnAnimate)
            if (obj.scrollTop() > w_h) {
                btn.addClass("active");
                btnAnimate = setTimeout(function() {
                    btn.css("opacity", 1);
                }, 300)
            } else {
                btn.css("opacity", 0);
                btnAnimate = setTimeout(function() {
                    btn.removeClass("active");
                }, 300)
            }
        })
    }
})();
