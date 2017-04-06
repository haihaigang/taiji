(function() {

    /**
     * 支付相关功能
     */
    var payCommon = {
        /**
         * 微信支付,建行支付
         * @param orderId 订单编号
         * @param pinId 建行支付需要记录
         * @param susFn   支付成功的回调
         * @param errorFn 支付失败的回调
         * @param checkFn 团失效弹框的回调
         * @param payType 支付类型 微信支付:weixinPay 抽奖:weixinPayForChou 建行:ccbPay
         */ 
        payOrder: function(options) {
            options = options || {};
            if (options.payType != 'ccbPay') {
                if (Tools.isRbyAppBrowser()) {
                    Jiao.toPay(options.orderId);
                    return;
                }
            }

            var url = '';
            if (options.payType == 'weixinPay') {
                url = config.HOST_API + '/shopping/getWechatParameters';
            } else if (options.payType == 'weixinPayForChou') {
                url = config.HOST_API + '/prize/getWechatParameters';
            } else if (options.payType == 'ccbPay') {
                url = config.HOST_API + '/shopping/getCCBUrl';
            }

            Ajax.custom({
                url: url,
                data: {
                    orderId: options.orderId
                },
                showLoading: true
            }, function(response) {
                var r = response.body;
                if (options.payType != 'ccbPay') {
                    if (options.payType == 'weixinPay') {
                        //团失效弹框
                        if (r.status == '0' || r.status == '2') {
                            options.checkFn && options.checkFn(r.status);
                            return;
                        }
                    }
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
                            if (options.payType == 'weixinPay') {
                                Storage.set('BAIDUFLAG', options.orderId); //设置百度统计的标志，每次支付成功后设置一个标志，以便追加统计，在跳转页面中清除该标志
                            }
                            var stopTime = r.stopTime ? parseInt(r.stopTime) * 1000 : 2000;
                            _getOrderPayStatus();
                            $('#tj-commit-panel').show();
                            setTimeout(function() {
                                $('#tj-commit-panel').hide();
                                if (options.payType == 'weixinPay') {
                                    if (!r.groupId && r.noPayNums <= 1) {
                                        //非活动的订单且仅仅在支付最后一单成功之后跳转成功页面
                                        location.href = '../member/success.html?noPayNums=' + r.noPayNums + '&groupOrderId=' + r.groupOrderId;
                                        return;
                                    }
                                }
                                options.susFn && options.susFn(r);
                            }, stopTime);
                        } else if ("get_brand_wcpay_request:cancel" == o.err_msg) {
                            options.errorFn && options.errorFn();
                        } else {
                            options.errorFn && options.errorFn();
                        }
                    })

                } else {

                    // 存储groupId,pinId,type 建行跳转用
                    /*Storage.set('ccbInfo', { 'groupId': data.groupId, 'pinId': pinId });*/
                    Cookie.set('ccb-groupId', r.groupId, 1, 0)
                    Cookie.set('ccb-pinId', options.pinId, 1, 0)
                    Cookie.set('ccb-host', location.host, 1, 0)
                    if (!!r.url) {
                        /* if(Tools.isRbyAppBrowser()){
                             var userToken=Storage.get("AccessToken");
                             if(userToken){
                                 Cookie.set("RBYAIRID",userToken)
                             }
                             location.href =config.SHARE_HOST+ '/wechat/shopping/getCCBUrl?orderId='+orderId+'&source=ios';
                         }else{*/
                        location.href = r.url;
                        /*}*/
                    }
                }
            }, function(textStatus, data) {
                if (options.payType != 'ccbPay') {
                    options.errorFn && options.errorFn();
                }
                Tools.showAlert(data.message || '服务器异常');
                console.log(data.message);
            });
        },

    };

    /**
     * 支付成功后的订单通知
     */
    function _getOrderPayStatus() {
        Ajax.custom({
            url: config.HOST_API_APP + '/callback/getOrderPayStatus',
            showLoading: false
        });
    }
    window.payCommon = payCommon;
})();
