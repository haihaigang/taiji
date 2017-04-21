(function() {
    var orderId = Tools._GET().orderId, //订单编号
        source = Tools._GET().source, //周期购需要传递订单来源字段，默认period_buy
        container = $('#tj-detail'),
        targetBtn = undefined,
        tempData = undefined,
        weekFlag = false;


    // 模板帮助方法，获取周期名称，currentStatus=2为当前
    template.helper('$getPeriodNums', function(content, currentStatus) {
        if (currentStatus == 2) {
            return '本期';
        } else {
            return '第' + Utils.numberToChinese(content) + '期';
        }
    });

    //获取订单
    function getDetail() {
        var url = Config.HOST_API_APP + source == 'period_buy' ? '/member/order/getPeriodOrderDetail' : '/member/order/get';
        Ajax.detail({
            url: url,
            data: {
                orderId: orderId
            },
            showLoading: true
        }, function(response) {
            tempData = response.body;

            // 处理周期购的逻辑
            handlePeriodStatus();

            //初始化底部高度
            if (tempData.status == 3) {
                $('body').addClass('has-footer');
            } else if (tempData.status == 2 || tempData.status == 9) {
                $('.container.order').css('padding-bottom', '0');
            }
            if (tempData.status == 5 && (tempData.isInvalid == 0 || tempData.isInvalid == 2)) {
                //团失效弹窗
                groupfail(tempData.isInvalid);
            }

            // 计算周期购进度高度
            calculatePeriodNumsHeight();
        }, function(textStatus, data) {
            container.html('<div class="nodata">' + ((data && data.message) || '服务器异常。' + textStatus) + '</div>')
        });
    }

    // 处理周期购的逻辑
    function handlePeriodStatus() {
        // 如果来源是周期购,待支付5,交易关闭6,交易完成4显示状态栏,不显示周期购进度,其余标题栏状态不显示,显示周期购进度
        if (tempData.source == 'period_buy') {
            $('.delivery-time').css('display', 'block');
            if (tempData.status == 4 || tempData.status == 5 || tempData.status == 6) {
                $('.delivery-time').hide();
            } else {
                $('.order-status').hide();
            }

            // 交易关闭不显示再次购买
            if (tempData.status == 6 || tempData.status == 4) {
                $('.order-fix-btn .again-buy').hide();
            }

        }
    }


    Common.checkLoginStatus(function() { //入口
        getDetail();
    });

    //团失效,团已满弹窗
    //isInvalid:当为1时，一定是支付成功的订单；支付失败的订单会返回0或2, 0是团失效，2是团已满
    function groupfail(status) {
        var msg = '',
            okText = '我去开团';
        // 团失效并且订单状态为待支付状态
        if (status == 0) {
            if (tempData.isActivityOrder == 0) {
                okText = '在去逛逛';
                msg = '您购买的商品已失效哦～～<br>再去逛逛吧';
            } else {
                msg = '您参加的团已失效哦~~<br>自己去当团长吧！';
            }
        } else if (status == 2) {
            msg = '您参加的团已满哦~~<br>自己去当团长吧！';
        }

        Tools.showConfirm({
            message: msg,
            okText: okText,
            cancelText: '取消订单',
            yesCallback: function() {
                if (tempData.isActivityOrder == 0) {
                    location.href = '../category/goods.html';
                } else {
                    if (tempData.activityType == 1) {
                        location.href = "../pin/group-detail.html?pinId=" + tempData.pinId;
                    } else if (tempData.activityType == 2) {
                        location.href = "../group/activity-detail.html?pinId=" + tempData.pinId;
                    }
                }
            },
            noCallback: cancelOrder
        });
    }

    //取消订单
    container.on('click', '.btn-cancel', function(e) {
        e.preventDefault();

        if (!tempData) {
            Tools.showAlert('数据错误，订单不存在');
            return;
        }

        Tools.showConfirm('你确定要取消订单吗？', cancelOrder)

        // 订单详情页 取消订单埋点
        MeiStat.to('0514', { 'orderid': orderId });
    });

    //删除订单
    container.on('click', '.delete-order', function(e) {
        e.preventDefault();

        if (!tempData) {
            Tools.showAlert('数据错误，订单不存在');
            return;
        }

        Tools.showConfirm('你确定要删除订单吗？', function() {
            Ajax.custom({
                url: Config.HOST_API + '/member/deleteOrder',
                data: {
                    orderId: tempData.orderId
                },
                type: 'POST'
            }, function(response) {
                gotoUrl();
            }, function(textStatus, data) {
                Tools.showToast(data.message || '服务器异常');
            })
        })

        // 订单详情页 删除订单埋点
        MeiStat.to('0512', { 'orderid': orderId });
    });

    //再次购买
    container.on('click', '.again-buy', function(e) {
        e.preventDefault();
        if (!tempData) {
            Tools.showAlert('数据错误，订单不存在');
            return;
        }

        Ajax.custom({
            url: Config.HOST_API_APP + '/member/order/againBuy',
            data: {
                orderId: tempData.orderId
            },
            type: 'GET'
        }, function(response) {
            location.href = '../shopping/cart.html';
        }, function(textStatus, data) {
            Tools.showToast(data.message || '服务器异常');
        })

        // 订单详情页 再次购买埋点
        MeiStat.to('0515', { 'orderid': orderId });
    });

    //热门活动
    container.on('click', '.hot-activ', function(e) {
        e.preventDefault();
        // 订单详情页 热门活动埋点
        MeiStat.to('0513', { 'orderid': orderId });

        if (tempData.activityType == 1) {
            location.href = '../index.html';
        } else if (tempData.activityType == 2) {
            location.href = '../group/activity.html';
        }

    });

    //去支付，临时订单跳转到结算页，未支付订单打开支付
    container.on('click', '.order-btn-buy', function(e) {
        e.preventDefault();

        // 订单详情页 去支付埋点
        MeiStat.to('0510', { 'orderid': orderId });

        targetBtn = $(this);

        if ($(this).hasClass('disabled')) return;

        if (!tempData) {
            Tools.showAlert('数据错误，订单不存在');
            return;
        }

        targetBtn.find('p').addClass('gray').text('支付中...');

        //固定三秒后还原按钮状态，为了解决嵌入app的webview中打开支付界面然后取消支付回到app按钮不能还原问题
        setTimeout(function() {
            targetBtn.find('p').text('去支付').removeClass('gray');
        }, 3000);

        if (tempData.payment.paymentId == 'ccb') {
            // 调建行银行支付接口
            payCommon.payOrder({
                orderId: orderId,
                payType: 'ccbPay'
            })

        } else {
            //其它支付方式（包括支付宝等）都使用微信
            payCommon.payOrder({
                orderId: orderId,
                payType: 'weixinPay',
                susFn: payCallback,
                errorFn: errorCallback
            })
        }
    });
    //团详情埋点
    container.on('click', '.pin-name a', function() {
        var href = $(this).attr("href");
        var groupid, pinid
        var get = href.split("?");
        var param = get[1].split("&");
        for (var i in param) {
            var temp = param[i].split("=");
            switch (temp[0]) {
                case "pinId":
                    pinid = temp[1];
                    break;
                case "groupId":
                    groupid = temp[1];
                    break;
            }
        }
        MeiStat.to('0518', { 'orderid': orderId, 'groupid': groupid, 'pinid': pinid });
    });

    // 查看物流
    container.on('click', '.look-logistics', function(e) {
        // 订单详情页 查看物流埋点
        MeiStat.to('0509', { 'orderid': orderid });
    });

    //确认收货
    container.on('click', '.confirm-btn-primary', function(e) {
        e.preventDefault();
        var id = orderId;

        if (source == 'period_buy') {
            id = tempData.currSubOrder.orderId ? tempData.currSubOrder.orderId : '';
        }
        if (!id) {
            Tools.showAlert('数据错误，订单不存在');
            return;
        }

        Tools.showConfirm('是否确认已收货？', function() {
            Ajax.custom({
                url: Config.HOST_API_APP + '/member/order/confirmReceive',
                data: {
                    orderId: id
                },
                type: 'POST'
            }, function(response) {
                // 如果是周期购还停留在当前页面,并且刷新页面
                if (source == 'period_buy') {
                    location.reload();
                    return;
                }
                location.href = '../member/orders.html?status=0';
            }, function(textStatus, data) {
                Tools.showToast(data.message || '服务器异常');
            })
        })

        // 订单详情页 确认收货埋点
        MeiStat.to('0511', { 'orderid': orderId });
    });

    // 动态计算列表前两个商品的高度
    function calculatePeriodNumsHeight() {
        // 只计算数组前两个元素的长度 

        if (tempData.subOrders && tempData.subOrders.length > 4) {
            $('.order .period-nums').css('height', 78);
        } else {
            $("#show-more").css("display", "none");
        }
    }
    container.on("click", "#show-more", function() {
        weekFlag = !weekFlag;
        if (weekFlag) {
            $(".order .period-nums").css("height", "auto");
            $(this).html("收起周期进度");
        } else {
            $('.order .period-nums').css('height', 78);
            $(this).html("查看周期进度");
        }
    });
    //支付成功回调
    function payCallback(data) {
        baiduTJ.baiduTrackOrder(orderId); //百度统计
        targetBtn.addClass('disabled').find('p').text('已支付');
        $('.btn-cancel').hide(); //隐藏取消订单按钮
        location.reload();
    }

    //取消支付回调
    function errorCallback() {
        targetBtn.removeClass('disabled').find('p').removeClass('gray').text('去支付');
    }

    //发起取消订单请求
    function cancelOrder() {
        Ajax.custom({
            url: Config.HOST_API + '/member/cancelOrder',
            data: {
                orderId: tempData.orderId
            },
            type: 'POST'
        }, function(response) {
            gotoUrl();
            // 订单详情页 取消订单页面埋点
            MeiStat.to('0507', { 'orderid': tempData.orderId });
        }, function(textStatus, data) {
            Tools.showToast(data.message || '服务器异常');
        })
    }

    // 取消,删除订单跳转周期购列表,其它跳转全部订单列表
    function gotoUrl() {
        if (source == 'period_buy') {
            if (Tools.isRbyAppBrowser()) {
                Jiao.toOrders(4);
            } else {
                location.href = 'orders.html?status=4'
            }
            return;
        }
        location.href = 'orders.html';
    }

})()
