(function() {
    var container = $('.container'),
        pickupPage = new SecondPage('#pickup-page'),
        productId = 0, //当前选择的提货的商品ID
        stock = 0; //当前选择的提货的商品库存

    window.pickupPage = pickupPage; //抛出全局以便测试


    // 点击补货，弹出选择窗口，设置库存，商品ID
    container.on('click', '.btn-pick-open', function(e) {
        e.preventDefault();

        // 每次打开另一个商品的窗口都重置选择的数量
        if (productId != $(this).data('id')) {
            $('#pickup-num').text(1);
            stock = $(this).data('stock');
            productId = $(this).data('id');
        }

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

        Ajax.cusotm({
            url: '/add',
            type: 'POST',
            contentType: 'application/json'
        }, function(resposne) {
            pickupPage.closeSidebar();
            // TODO 
        }, function(textStatus, data) {
            Tools.showToast(data.message);
        })
    });

    // 初始化按钮以及数量
    function initBtns(num) {
        if (num <= 1) {
            num = 1;
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

        $('#pickup-num').text(num);
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

    common.checkLoginStatus(function() { //入口
        getData();
        //添加默认分享功能
        WechatCommon.Share.commonShare();
    });
})()
