(function() {
    var container = $('.container'),
        pickupPage = new SecondPage('#pickup-page'),
        productId = 0, //当前选择的提货的商品ID
        stock = 0, //当前选择的提货的商品库存
        targetBtn, //当前点击的按钮
        inteBtn; //还原按钮的计时器

    window.pickupPage = pickupPage; //抛出全局以便测试

    // 点击补货，弹出选择窗口，设置库存，商品ID
    container.on('click', '.btn-pick-open', function(e) {
        e.preventDefault();

        // 每次打开弹窗都重置上一次的提交结果
        stock = $(this).data('stock');
        productId = $(this).data('id');
        initBtns(1);
        $('.btn-pick-sure').text('提货').removeClass('disabled').data('orderId', '');
        if (inteBtn) {
            clearTimeout(inteBtn);
        }

        getAddresses();

        pickupPage.openSidebar();
    });

    // 点击减
    $('.minus').click(function(e) {
        e.preventDefault();

        if ($(this).hasClass('disabled')) {
            return;
        }

        var num = parseInt($(this).parent().find('span').text());
        num--;

        initBtns(num);
    });

    // 点击加
    $('.plus').click(function(e) {
        e.preventDefault();

        if ($(this).hasClass('disabled')) {
            return;
        }

        var num = parseInt($(this).parent().find('span').text());
        num++;

        initBtns(num);
    });

    // 点击确认提货
    $('.btn-pick-sure').click(function(e) {
        e.preventDefault();

        var that = $(this);
        var quantity = $('#pickup-num').data('quantity');
        var addressId = $('.pickup-address-item.active').data('id');
        var revOrderId = that.data('orderId');

        if (!addressId) {
            Tools.showToast('请选择一个地址');
            return;
        }

        if (that.hasClass('disabled')) {
            return;
        }

        if (inteBtn) {
            clearTimeout(inteBtn);
        }

        targetBtn = that;

        if (revOrderId && revOrderId != '0') {
            // 如果已经提交过订单直接发起支付

            that.addClass('disabled').text('支付中…');

            //固定三秒后还原按钮状态
            inteBtn = setTimeout(function() {
                that.text('支付').removeClass('disabled');
            }, 3000);

            WechatCommon.Pay.weixinPayOrder(revOrderId, payCallback, errorCallback);
            return;
        }

        that.addClass('disabled').text('提交中…');

        Ajax.custom({
            url: '/pickups',
            type: 'POST',
            data: {
                addressId: addressId,
                productId: productId,
                quantity: quantity
            },
            contentType: 'application/json'
        }, function(response) {
            var data = response;

            // 一旦提交成功则数量、收货地址都不能在更改了
            $('.minus, .plus, .pickup-address-item').addClass('disabled');

            that.text('支付中...').data('orderId', data.pickupNumber);

            //固定三秒后还原按钮状态
            inteBtn = setTimeout(function() {
                that.text('支付').removeClass('disabled');
            }, 3000);

            // 发起支付
            WechatCommon.Pay.weixinPayOrder(data.pickupNumber, payCallback, errorCallback);
        }, function(textStatus, data) {
            Tools.showToast(data.message);
            that.text('提货');
        })
    });

    // 点击选择地址
    $('#tj-addresses').on('click', '.pickup-address-item', function(e) {
        if ($(this).hasClass('disabled')) {
            return;
        }

        $('.pickup-address-item').removeClass('active');
        $(this).addClass('active');
    });

    // 初始化按钮以及数量
    function initBtns(num) {
        num *= 10;//10盒一起提货

        if (num <= 10) {
            num = 10;
            $('.minus').addClass('disabled');
        } else {
            $('.minus').removeClass('disabled');
        }
        if (num >= stock) {
            num = stock;
            $('.plus').addClass('disabled');
        } else {
            $('.plus').removeClass('disabled');
        }

        $('#pickup-num').data('quantity', num).text(num / 10);
        $('.pickup-text').html('本次共提货' + num + '件<br>提货量&lt;240盒 邮费20元<br>240盒&lt;=提货量&lt;6000盒 邮费80元<br>提货量&gt;=6000盒 邮费200元');
    }

    // 获取数据
    function getData() {
        Ajax.custom({
            url: '/members/inventories'
        }, function(response) {
            var data = response;

            Ajax.render('#tj-info', 'tj-info-tmpl', data);
            Ajax.render('#tj-list', 'tj-list-tmpl', data.inventories);

            container.show();
        });
    }

    //获取地址列表
    function getAddresses() {
        Ajax.custom({
            url: '/members/addresses',
            showLoading: true,
        }, function(response) {
            var data = response;

            Ajax.render('#tj-addresses', 'tj-addresses-tmpl', data);
        });
    }

    //支付成功回调
    function payCallback(data) {
        Tools.showToast('提货成功');
        pickupPage.closeSidebar();
        getData();
    }

    //取消支付回调
    function errorCallback() {
        // targetBtn.text('支付').removeClass('disabled'); //还原支付按钮
    }

    Common.checkLoginStatus(function() { //入口
        getData();
        //添加默认分享功能
        WechatCommon.Share.commonShare();
    });
})()
