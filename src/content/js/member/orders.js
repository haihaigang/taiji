(function() {
    var status = Tools._GET().status || 0, //订单状态，0全部、5待支付、2待发货、3已发货，4周期购,默认0
        container = $('.order'),
        rbyListDom = $('#tj-list'),
        orderId = undefined,
        tempData = undefined;


    //获取订单列表
    function getList() {
        var tempStatus = status;
        if (tempStatus == 4) {
            tempStatus = 10;
        }
        Ajax.paging({
            url: '/members/orders',
            data: {
                status: tempStatus || 0,
                page: config.page,
                pageSize: config.PAGE_SIZE
            },
            showLoading: true,
            showEmpty: true
        }, function(response) {
            tempData = response.body;
            $('#tj-empty').removeClass('icon-order-empty');
            $('#tj-empty').removeClass('icon-nopay-empty');
            $('#tj-empty').removeClass('icon-dispatch-empty');
            $('#tj-empty').removeClass('icon-receive-empty');
            $('#tj-empty').removeClass('icon-period-empty');
            if (tempData && tempData.length == 0) {
                if (status == 0) {
                    $('#tj-empty').addClass('icon-order-empty');
                    $('.ckout-title').text('您还没有相关订单');
                } else if (status == 5) {
                    $('#tj-empty').addClass('icon-nopay-empty');
                    $('.ckout-title').text('您还没有待支付订单');
                } else if (status == 2) {
                    $('#tj-empty').addClass('icon-dispatch-empty');
                    $('.ckout-title').text('您还没有待发货订单');
                } else if (status == 3) {
                    $('#tj-empty').addClass('icon-receive-empty');
                    $('.ckout-title').text('您还没有待收货订单');
                } else if (status == 4) {
                    $('#tj-empty').addClass('icon-period-empty');
                    $('.ckout-title').text('您还没有周期购订单');
                }

            }

            initTabWithStatus();
            container.show();
            // 如果是周期购隐藏导航栏
            if (Tools.isRbyAppBrowser()) {
                $('.tabs-fixed').hide();
                $('.order-box').css('padding-top', 0);
            }
            // 页面埋点
            // MeiStat.to('0851');

        }, function(textStatus, data) {
            rbyListDom.html('<div class="list-empty-data icon-order-empty">' + ((data && data.message) || '服务器异常。' + textStatus) + '</div>')
        });
    }

    common.getList = getList;

    common.checkLoginStatus(function() { //入口
        getList();
    });

    //切换tab
    $('.tab-link').click(function(e) {
        e.preventDefault();

        status = $(this).attr('data-v');
        $('.tab-link').removeClass('active');
        $(this).addClass('active');

        config.page = 1;
        getList();

        if ('pushState' in history) {
            //push和replace的区别，push向历史记录中追加一条记录（历史记录有多条），replace替换当前的历史记录（历史记录就一条）
            // history.pushState({
            //     status: status
            // }, null, "?status=" + status);
            history.replaceState({
                status: status
            }, null, "?status=" + status);
        }

    });

    window.addEventListener("popstate", function() {
        var currentState = history.state;
        if (currentState && currentState.status) {
            status = currentState.status;
            config.page = 1;
            getList();
        }
    });


    //删除订单
    container.on('click', '.delete-order', function(e) {
        e.preventDefault();
        var that = $(this),
            par = that.parents('.order-list'),
            oid = that.attr('data-oid');

        if (!oid) {
            Tools.showAlert('数据错误，订单不存在');
            return;
        }

        Tools.showConfirm('你确定要删除订单吗？', function() {
            Ajax.custom({
                url: config.HOST_API + '/member/deleteOrder',
                data: {
                    orderId: oid
                },
                type: 'POST'
            }, function(response) {
                par.prev().remove();
                par.remove();
                if ($('.order-list').length == 0) {
                    $("#tj-empty").css("display", "block").addClass('icon-order-empty');
                } else {
                    $("#tj-empty").css("display", "none").removeClass('icon-order-empty');
                }

                // 订单列表页 删除订单页面埋点
                MeiStat.to('0505', { 'orderid': oid });

            }, function(textStatus, data) {
                Tools.showToast(data.message || '服务器异常');
            })
        })
    });

    //再次购买
    container.on('click', '.again-buy', function(e) {
        e.preventDefault();
        var that = $(this),
            oid = that.attr('data-oid');

        if (!oid) {
            Tools.showAlert('数据错误，订单不存在');
            return;
        }

        Ajax.custom({
            url: config.HOST_API_APP + '/member/order/againBuy',
            data: {
                orderId: oid
            },
            type: 'GET'
        }, function(response) {
            location.href = '../shopping/cart.html';
        }, function(textStatus, data) {
            Tools.showToast(data.message || '服务器异常');
        })

        // 订单列表页 再次购买页面埋点
        MeiStat.to('0508', { 'orderid': oid });
    });

    //确认收货订单
    container.on('click', '.confirm-order-btn', function(e) {
        e.preventDefault();
        var that = $(this),
            par = that.parents('.order-list'),
            oid = that.attr('data-oid');
        if (!oid) {
            Tools.showAlert('数据错误，订单不存在');
            return;
        }
        Tools.showConfirm('是否确认已收货？', function() {
            Ajax.custom({
                url: config.HOST_API_APP + '/member/order/confirmReceive',
                data: {
                    orderId: oid
                },
                type: 'POST'
            }, function(response) {
                //that.remove();
                par.prev().remove();
                par.remove();
                if (rbyListDom.children().length == 0) {
                    config.page = 1;
                    getList();
                }

                // 订单列表页 确认收货页面埋点
                MeiStat.to('0504', { 'orderid': oid });
            }, function(textStatus, data) {
                Tools.showToast(data.message || '服务器异常');
            })
        })
    })

    //取消订单
    container.on('click', '.btn-cancel', function(e) {
        e.preventDefault();

        var that = $(this),
            par = $(this).parent(),
            gid = $(this).attr('data-gid'),
            oid = $(this).attr('data-oid'),
            d = undefined;

        if (!oid) {
            Tools.showAlert('数据错误，订单不存在');
            return;
        }

        if (gid) {
            d = {
                tmpOrderId: oid
            };
        } else {
            d = {
                orderId: oid
            };
        }

        Tools.showConfirm('你确定要取消订单吗？', function() {
            Ajax.custom({
                url: config.HOST_API_APP + '/member/cancelOrder',
                data: d,
                type: 'POST'
            }, function(response) {
                // getList();
                that.parent().parent().parent().remove();
                if (rbyListDom.children().length == 0) {
                    config.page = 1;
                    getList();
                }

            }, function(textStatus, data) {
                Tools.showToast(data.message || '服务器异常');
            })
        })

        // 订单列表页 取消订单页面埋点
        MeiStat.to('0507', { 'orderid': oid });
    });

    //去支付，临时订单跳转到结算页，未支付订单打开支付
    container.on('click', '.btn-pay', function(e) {

        var par = $(this).parent(),
            oid = $(this).attr('data-oid');
        orderId = oid;

        // 订单列表页 去支付埋点
        MeiStat.to('0503', { 'orderid': orderId });
    });

    // 查看物流
    container.on('click', '.white', function(e) {

        var that = $(this),
            par = that.parents('.order-list'),
            orderId = that.attr('data-oid');
        // 订单列表页 查看物流埋点
        MeiStat.to('0502', { 'orderid': orderId });
    });

    //热门活动
    container.on('click', '.hot-activ', function(e) {
        var par = $(this).parent(),
            oid = $(this).attr('data-oid');
        orderId = oid;
        // 订单列表页 查看物流埋点
        MeiStat.to('0506', { 'orderid': orderId });
    });
    //去逛逛
    container.on('click', '#tj-empty a', function(e) {
        if (Tools.isRbyAppBrowser()) {
            e.preventDefault();
            Jiao.toHome();
            return;
        }
    });

    //根据订单状态初始化tab状态
    function initTabWithStatus() {
        $('.tab-link').each(function() {
            if ($(this).attr('data-v') == status) {
                $(this).addClass('active');
            } else {
                $(this).removeClass('active');
            }
        })
    }

})()
