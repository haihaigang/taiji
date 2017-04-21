(function() {
    var noPayNums = Tools._GET().noPayNums,
        groupOrderId = Tools._GET().groupOrderId,
        count = 3;

    if (!isNaN(noPayNums) && parseInt(noPayNums) > 1) {
        $('#btn-view').attr('href', 'checkout.html?groupId=' + groupOrderId).text('支付其他订单');
    }

    // 点击关闭弹窗
    $('.levelup-close').click(function(e) {
        e.preventDefault();
        $(this).parents('.dialog').hide();
    });

    // 点击跳转到优惠券列表
    $('.levelup-button button').click(function(e) {
        e.preventDefault();
        location.href = 'member/coupons.html'
    });

    // 获取状态信息，获取用户等级提升
    function getStatus() {
        Ajax.custom({
            url: '/notifications',
            showLoading: true
        }, function(response) {
            var data = response;

            for (var i = 0; i < data.length; i++) {
                if (data[i].type == 'UPGRADE') {
                    $('#tj-levelup-dialog').show();
                    $('#level-name').text(data[i].extendedValue1 + '张优惠券');
                }
            }
        })
    }

    Common.checkLoginStatus(function() { //入口
        //添加默认分享功能
        WechatCommon.Share.commonShare();
    });
})()
