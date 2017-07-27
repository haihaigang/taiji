(function() {
    var container = $('.container'),
        addressId = Tools._GET().addressId,
        inteBtn //还原按钮的计时器

    // 提交订单
    container.on('click', '.cart-total-button', function(e) {
        e.preventDefault();

        submitOrder($(this));
    });

    // 点击选择配送方式
    container.on('click', '.goods-deliverys a', function(e) {
        e.preventDefault();

        if ($(this).hasClass('active')) {
            // 当已选中则忽略
            return;
        }

        if ($(this).hasClass('disabled')) {
            // 当已禁用则忽略
            return;
        }

        getData($(this).data('delivery'));
    });

    // 点击选择支付方式
    container.on('click', '.goods-methods a', function(e) {
        e.preventDefault();

        if ($(this).hasClass('active')) {
            // 当已选中则忽略
            return;
        }

        if ($(this).hasClass('disabled')) {
            // 当已禁用则忽略
            return;
        }

        $('.goods-methods a').removeClass('active');
        $(this).addClass('active');
        // getData($(this).data('delivery'));
    });

    // 获取展示的购物车数据
    function getData(deliveryMethod) {
        deliveryMethod = deliveryMethod || 'EXPRESS';

        Ajax.custom({
            url: '/carts/checkout',
            data: {
                addressId: addressId,
                deliveryMethod: deliveryMethod
            },
            type: 'POST',
            contentType: 'application/json'
        }, function(response) {
            response.deliveryMethod = deliveryMethod;
            renderCart(response);
        }, function(textStatus, data) {
            if (data.status == 400 && data.message == '购物车没有商品') {
                // 没有商品的错误显示空数据提示
                $('#tj-empty').show();
                return;
            }
            if (data.status == 400 && data.message == '请先添加收货地址') {
                // 没有地址的时候
                redirectToChoose(true);
                return;
            }
            Tools.showToast(data.message);
        });
    }

    //初始化购物车，
    function renderCart(responseData) {
        if (responseData.items && responseData.items.length == 0) {
            // 没有商品就显示空数据提示
            $('#tj-empty').show();
            return;
        }

        //初始化地址信息
        var d = undefined,
            d1 = undefined;
        for (var i in responseData.addresses) {
            var address = responseData.addresses[i];
            if (address.id == addressId) {
                d1 = address;
                break;
            }
            if (address.prior) {
                d = address;
            }
        }
        d = d1 || d;

        if (!d) {
            redirectToChoose();
            return;
        } else {
            addressId = d.id;
            responseData.address = d;
        }

        for (var i = 0; i < responseData.items.length; i++) {
            var d = responseData.items[i];
            if (d.type == 'REGULAR') {
                // 因为普通商品的按盒一起购买，显示数量需要计算
                d.quantity /= Config.ONE_GROUP_NUM;
                d.isRegular = true;
                d.ONE_GROUP_NUM = Config.ONE_GROUP_NUM;
            }
        }

        Ajax.render('#tj-detail', 'tj-detail-tmpl', responseData);

        $('.shipping').attr('href', getAddressUrl());

        if (responseData.items.length <= 2) {
            //商品数量小于2不显示更多按钮
            $("#show-more").css("display", "none");
            $(".goods-list").css({
                height: "auto"
            });
        }
    }

    // 提交订单并发起支付
    function submitOrder(th) {
        var that = th,
            revOrderId = that.attr('data-rid');

        if (that.hasClass('disabled')) {
            return;
        }

        // 判断支付方式
        var paymentDoms = $('.goods-methods a.active');
        if (paymentDoms.length == 0) {
            Tools.showToast('请选择一个支付方式');
            return;
        }

        // 判断配送方式
        var deliveryDoms = $('.goods-deliverys a.active');
        if (deliveryDoms.length == 0) {
            Tools.showToast('请选择一个配送方式');
            return;
        }

        that.text('支付中').addClass('disabled');
        targetBtn = that;

        //固定三秒后还原按钮状态
        inteBtn = setTimeout(function() {
            targetBtn.text('支付').removeClass('disabled');
        }, 3000);

        var payment = paymentDoms.data('payment') || 'WECHAT'; // WECHAT, BALANCE

        if (revOrderId && revOrderId != '0') {
            // 如果已经提交过订单直接发起支付
            pay(revOrderId, payCallback, errorCallback);
            return;
        }

        Ajax.custom({
            url: '/orders',
            data: {
                addressId: addressId,
                paymentMethod: payment,
                deliveryMethod: deliveryDoms.data('delivery') || 'EXPRESS' // EXPRESS、INVENTORY
            },
            type: 'POST',
            showLoading: true,
            contentType: 'application/json'
        }, function(response) {
            var data = response,
                orderId = data.orderNumber;

            that.removeAttr('data-oid').attr('data-rid', orderId);
            disabledChooseAddress();

            if (payment == 'BALANCE') {
                // 余额支付，在下单成功后直接跳转到
                location.href = 'success.html';
            } else {
                pay(orderId, payCallback, errorCallback);
            }
        }, function(textStatus, data) {
            that.find('span').text('支付').removeClass('disabled'); //还原支付按钮
            Tools.showToast(data.message || '服务器异常。');
        });
    }

    //获取地址连接
    function getAddressUrl(isDetail) {
        return '../member/' + (isDetail ? 'address' : 'addresses') + '.html?' + '&from=' + encodeURIComponent(location.href);
    }

    //当没有选择地址时跳转到选择地址页面
    function redirectToChoose(isDetail) {
        location.href = getAddressUrl(isDetail);
    }

    //支付成功回调
    function payCallback(data) {
        location.href = 'success.html';
    }

    //取消支付回调
    function errorCallback() {
        targetBtn.find('span').text('支付').removeClass('disabled'); //还原支付按钮
    }

    //禁用地址的选择功能，在获取的数据中有已支付订单，或是在首次提交订单成功后
    function disabledChooseAddress() {
        $('.shipping').attr('href', 'javascript:;');
        $('.shipping-icon .icon-arrow').hide();
        $('.goods-deliverys a').addClass('disabled');
        $('.goods-methods a').addClass('disabled');
    }

    // 发起支付
    function pay(orderId) {
        WechatCommon.Pay.weixinPayOrder(orderId, payCallback, errorCallback);
    }

    Common.checkLoginStatus(function() { //入口
        getData()
            //添加默认分享功能
        WechatCommon.Share.commonShare();
    });

})();
