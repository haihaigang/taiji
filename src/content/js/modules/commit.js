(function() {
    var container = $('.container'),
        addressId = Tools._GET().addressId,
        inteBtn//还原按钮的计时器

    // 提交订单
    container.on('click', '.cart-total-button', function(e) {
        e.preventDefault();

        submitOrder($(this));
    });

    // 点击选择配送方式
    container.on('click', '.goods-deliverys a', function(e) {
        e.preventDefault();

        getData($(this).data('delivery'));
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

        for(var i = 0; i < responseData.items.length; i++){
            var d = responseData.items[i];
            if(d.type == 'REGULAR'){
                // 因为普通商品的10盒一起购买，而数量显示／10
                d.quantity /= 10;
                d.isRegular = true;
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

        if (revOrderId && revOrderId != '0') {
            // 如果已经提交过订单直接发起支付
            pay(revOrderId, payCallback, errorCallback);
            return;
        }

        Ajax.custom({
            url: '/orders',
            data: {
                addressId: addressId,
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
            pay(orderId, payCallback, errorCallback);
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
