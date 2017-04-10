/**
 * 微信相关操作
 **/
(function() {
    var locationInte = undefined;

    /**
     * 微信支付相关功能
     */
    var wechatCommon = {

        /**
         * 获取微信号
         */
        getOpenId: function() {
            return Cookie.get('openId');
        },


        /**
         * 微信支付
         * @param orderId 订单编号
         * @param susFn   支付成功的回调
         * @param errorFn 支付失败的回调
         * @param checkFn 团失效弹框的回调
         */
        weixinPayOrder: function(orderId, susFn, errorFn, checkFn) {
            if (Tools.isRbyAppBrowser()) {
                Jiao.toPay(orderId);
                return;
            }

            Ajax.custom({
                url: '/wechat/pay/parameters',
                data: {
                    orderNumber: orderId
                },
                showLoading: true
            }, function(response) {
                var r = response;
                if (typeof WeixinJSBridge == 'undefined') {
                    Tools.alert('WeixinJSBridge is undefined');
                    return;
                }
                WeixinJSBridge.invoke("getBrandWCPayRequest", {
                    appId: r.appId,
                    timeStamp: r.timeStamp,
                    nonceStr: r.nonceStr,
                    package: r.package,
                    signType: r.signType,
                    paySign: r.paySign
                }, function(o) {
                    Tools.alert(JSON.stringify(o));
                    if ("get_brand_wcpay_request:ok" == o.err_msg) {
                        var stopTime = r.stopTime ? parseInt(r.stopTime) * 1000 : 2000;
                        // _getOrderPayStatus();
                        $('#tj-commit-panel').show();
                        setTimeout(function() {
                            $('#tj-commit-panel').hide();
                            // source period_buy' 表示来源是周期购
                            if (!r.groupId && r.noPayNums <= 1) {
                                //非活动的订单且仅仅在支付最后一单成功之后跳转成功页面
                                location.href = '../member/success.html?noPayNums=' + r.noPayNums + '&groupOrderId=' + r.groupOrderId;
                                return;
                            }
                            susFn && susFn(r);
                        }, stopTime);
                    } else if ("get_brand_wcpay_request:cancel" == o.err_msg) {
                        errorFn && errorFn();
                    } else {
                        errorFn && errorFn();
                    }
                })
            }, function(textStatus, data) {
                errorFn && errorFn();
                Tools.showAlert(data.message || '服务器异常');
            })
        },

        /**
         * 获取地理位置
         * @param fn 定位成功的回调
         * @param errorFn 定位失败的回调
         */
        wechatGetLocation: function(fn, errorFn) {
            if (!1 && Tools.isWeChatBrowser()) {
                _wechatGetLocation1(fn, errorFn);
            } else {
                _wechatGetLocation2(fn, errorFn);
            }
        }
    };

    /**
     * 微信分享相关功能
     */
    var share = {
        /**
         * 当需要和app交互时，设置app分享需要的数据，
         * 只要微官网中有分享行为就设置该数据以便app能获取数据
         * @param data 分享数据，{title:'', desc: '', imgUrl: ''}
         * @param url 分享链接
         */
        condition: function(data, url) {
            this.shareData = {
                shareTitle: data.title,
                shareDesc: data.desc,
                sharePic: data.imgUrl,
                shareLink: _getShareIdUrl(url)
            };
        },

        /**
         * 默认分享，使用默认的logo、标题、描述
         */
        defaultSend: function() {
            var data = { //默认的分享数据
                shareData: {
                    title: config.SHARE_TITLE,
                    desc: config.SHARE_TEXT,
                    imgUrl: config.SHARE_HOST + "/content/images/common/logo.png"
                }
            };

            this.condition(data.shareData, config.SHARE_HOST + '/index.html');
            _wechatShareOverride(data, config.SHARE_HOST + '/index.html');
        },

        /**
         * 根据数据初始化分享数据，如果没有使用默认分享数据，同时需要保留各活动特殊的标题＋链接
         * @param data 活动基础数据，包含分享基本信息（shareTitle、shareDesc、sharePic）+其它可能需要的字段
         * @param type 活动类型
         */
        commonShare: function(data, type) {
            if (!data || !data.sharePic) {
                //如果没有分享数据，使用默认分享
                this.defaultSend();
                return;
            }

            var url = document.URL;

            // 如果joinable分享一起买组团详情，否则一起买详情
            if (type == 'detail') {
                url = config.DETAIL_SHARE_LINK.replace('ID', data.id).replace('CID', data.couponId);
            } else if (type == 'coupon') {
                url = config.COUPON_SHARE_LINK.replace('ID', data.id).replace('CID', data.couponId);
            }


            var shareData = { //分享的数据
                title: data.shareTitle,
                desc: data.shareDesc,
                imgUrl: data.sharePic
            };

            data.shareData = shareData;
            data.shareType = type

            this.condition(data.shareData, url);
            _wechatShareOverride(data, url);
        }
    };

    /**
     * 获取分享的链接，这里追加统计的参数
     * @param url 链接地址
     */
    function _getShareIdUrl(url) {
        var userSn = Cookie.get("UserSN"),
            campainId = Cookie.get('CampainId') || '';

        //分享在url后追加上级用户ID
        var addParams = {
            referId: userSn,
            _ch: campainId
        };

        var paramArr = [];
        for (var i in addParams) {
            paramArr.push(i + '=' + addParams[i] || '');
        }

        if (paramArr.length > 0) {
            url = url + (url.indexOf('?') == -1 ? '?' : '&') + paramArr.join('&');
        }

        //这里替换域名为随机的一个分享域名，防止被微信屏蔽
        // url = url.replace(config.SHARE_HOST, config.SHARE_HOSTS[Math.floor(Math.random() * config.SHARE_HOSTS.length)]);
        return url;
    }

    /**
     * 支付成功后的订单通知
     */
    function _getOrderPayStatus() {
        Ajax.custom({
            url: config.HOST_API_APP + '/callback/getOrderPayStatus',
            showLoading: false
        });
    }

    /**
     * 微信配置
     */
    function _wechatShareConfig() {
        Ajax.custom({
            url: "/wechat/mp/signature",
            data: {
                url: document.URL //签名需要是未编码的地址，如果接口没有解析直接传值
            }
        }, function(response) {
            var data = response;

            //在调用wx.ready之前必先调用wx.config
            wx.config({
                debug: !1,
                appId: data.appId,
                timestamp: data.timestamp,
                nonceStr: data.noncestr,
                signature: data.signature,
                jsApiList: ["onMenuShareTimeline", "onMenuShareAppMessage", "getLocation"]
            }), wx.error(function() {})
        }, function(textStatus, data) {
            Tools.showAlert('获取微信签名错误');
        })
    }

    /**
     * 使用百度地图定位
     * @param fn 定位成功的回调
     * @param errorFn 定位失败的回调
     */
    function _wechatGetLocation2(fn, errorFn) {
        //设置5秒定位不到结果给用户提示信息
        locationInte = setTimeout(function() {
            common.locationError && common.locationError();
        }, 5000);

        // 百度地图API功能
        var point = new BMap.Point(116.331398, 39.897445);
        var geolocation = new BMap.Geolocation();
        geolocation.getCurrentPosition(function(r) {
            if (locationInte) clearTimeout(locationInte);

            if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                if (r.address.province != '上海市') {
                    errorFn && errorFn(2);
                }
                var latitude = r.point.lat; // 纬度，浮点数，范围为90 ~ -90
                var longitude = r.point.lng; // 经度，浮点数，范围为180 ~ -180。
                //获取定位
                Ajax.custom({
                    url: config.HOST_API_APP + '/building',
                    type: 'GET',
                    data: {
                        latitude: latitude,
                        longitude: longitude,
                    }
                }, function(response) {
                    if (response.body.length == 0) {
                        errorFn && errorFn(3)
                        return;
                    }
                    // Storage.set('BuildInfo', response.body[0]);
                    fn && fn(response.body[0]);
                }, function(textStatus, data) {
                    errorFn && errorFn(3);
                    Tools.showToast(data.message || '服务器异常');
                })
            } else {
                errorFn && errorFn(1);
            }
        }, {
            enableHighAccuracy: true
        })
    }

    /**
     * 使用微信地图定位
     * @param fn 定位成功的回调
     * @param errorFn 定位失败的回调
     */
    function _wechatGetLocation1(fn, errorFn) {
        //微信获取地址
        if (typeof wx == 'undefined' || Tools.isRbyAppBrowser()) return;

        _wechatShareConfig();

        wx.ready(function() {
            wx.getLocation({
                type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                success: function(res) {
                    var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                    var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                    var speed = res.speed; // 速度，以米/每秒计
                    var accuracy = res.accuracy; // 位置精度
                    //获取定位
                    Ajax.custom({
                        url: config.HOST_API_APP + '/building',
                        type: 'GET',
                        data: {
                            latitude: latitude,
                            longitude: longitude,
                        }
                    }, function(response) {
                        Storage.set('BuildInfo', response.body[0]);
                        fn && fn();
                    }, function(textStatus, data) {
                        Tools.showToast(data.message || '服务器异常');
                    })
                },
                cancel: function(res) {
                    errorFn && errorFn();
                }
            });
        })
    }

    /**
     * 自定义微信分享数据
     * @param  data 分享的数据
     * @param  url 分享的链接
     * @return null
     */
    function _wechatShareOverride(data, url) {
        //未加载微信资源库或从app内嵌过来不初始化分享内容
        if (typeof wx == 'undefined') {
            return;
        }

        _wechatShareConfig();

        wx.ready(function() {
            wx.onMenuShareTimeline({ //分享到朋友圈
                title: data.shareData.title,
                link: _getShareIdUrl(url),
                imgUrl: data.shareData.imgUrl,
                success: function() {
                    _wechatAfterShare();
                    _shareTargetStat(data, 2);
                },
                cancel: function() {}
            }), wx.onMenuShareAppMessage({ //分享给朋友
                title: data.shareData.title,
                desc: data.shareData.desc,
                link: _getShareIdUrl(url),
                imgUrl: data.shareData.imgUrl,
                type: "link",
                success: function() {
                    _wechatAfterShare();
                    _shareTargetStat(data, 1);
                },
                cancel: function() {}
            })
        })
    }

    /**
     * 分享成功后的界面操作
     */
    function _wechatAfterShare() {
        common.shareBuy && common.shareBuy();
        if (!common.canOpenShare) return;

        $('#tj-cover-bg').show().addClass('dark');
        $('#tj-pin-share').hide();
        $('#tj-group-share-after').hide();
        $('#tj-pin-share-after').show();
    }

    /**
     * 分享埋点，每次成功分享之后触发
     * @param s_data   分享数据
     * @param s_target 分享目标（1、好友，2、朋友圈）
     */
    function _shareTargetStat(s_data, s_target) {
        if (!s_data) {
            return;
        }

    }

    wechatCommon.share = share;
    window.WechatCommon = wechatCommon;
})();
