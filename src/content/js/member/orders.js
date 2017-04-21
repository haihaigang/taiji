(function() {
    var container = $('.order'),
        rbyListDom = $('#tj-list'),
        orderId = undefined,
        tempData = undefined,
        targetBtn = undefined;

    //立即支付，未支付订单打开支付
    container.on('click', '.btn-pay', function(e) {
        var that = $(this),
            oid = $(this).attr('data-oid');
        orderId = oid;

        targetBtn = $(this);

        if(targetBtn.hasClass('gray')){
            return;
        }

        targetBtn.text('支付中').addClass('gray');

        //固定三秒后还原按钮状态
        inteBtn = setTimeout(function() {
            targetBtn.text('立即支付').removeClass('gray');
        }, 3000);

        pay(orderId)
    });

    //去逛逛
    container.on('click', '#tj-empty a', function(e) {
        if (Tools.isRbyAppBrowser()) {
            e.preventDefault();
            Jiao.toHome();
            return;
        }
    });

    //支付成功回调
    function payCallback(data) {
        // location.href = 'success.html';
        // TODO 变更当前订单状态
        $('.imb-btn-box').hide();
        $('.icon-sub-tab label').text(Config.ORDER_STATUS['PROCESSING']);
    }

    //取消支付回调
    function errorCallback() {
        targetBtn.text('立即支付').removeClass('gray'); //还原支付按钮
    }

    // 发起支付
    function pay(orderId) {
        WechatCommon.Pay.weixinPayOrder(orderId, payCallback, errorCallback);
    }

    //获取订单列表
    function getList() {
        
        Ajax.paging({
            url: '/members/orders',
            data: {
                page: Config.PAGE,
                pageSize: Config.PAGE_SIZE
            },
            showLoading: true,
            showEmpty: true,
            key: 'content'
        }, function(response) {
            tempData = response;

            container.show();
        }, function(textStatus, data) {
            rbyListDom.html('<div class="list-empty-data icon-order-empty">' + ((data && data.message) || '服务器异常。' + textStatus) + '</div>')
        });
    }

    Common.getList = getList;

    Common.checkLoginStatus(function() { //入口
        getList();
        //添加默认分享功能
        WechatCommon.Share.commonShare();
    });

})()
