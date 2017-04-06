(function() {
    var couponId = Tools._GET().couponId, //优惠券编号
        container = $('#tj-detail'), //
        tempData = undefined,
        couponCode = $('input[name="vcode"]');

    if (Storage.get('avatar')) {
        $('#coupon-avatar').attr('src', Storage.get('avatar'));
    }

    //兑换优惠码
    $('#cashCoupon').click(function(e) {
        e.preventDefault();

        if (couponCode.val().isEmpty()) {
            Tools.showToast('优惠码不正确');
            return;
        }

        Ajax.custom({
            url: config.HOST_API_APP + '/member/gift/exchangeCode',
            data: Tools.formJson('#tj-form'),
            showLoading: true,
            type: 'POST'
        }, function(response) {
            $('.coupon-cash').hide();
            tempData = response.body;
            container.show();
            Ajax.render('#tj-detail', 'tj-detail-tmpl', tempData);
        }, function(textStatus, data) {
            Tools.showToast(data.message || '服务器异常');
        })
    });

    container.on('click', '.show-coupon', function() {
        location.href = "../member/coupons.html?status=0";
    });

    container.on('click', '.coupon-used', function() {
        location.href = "../index.html";
    });

})()
