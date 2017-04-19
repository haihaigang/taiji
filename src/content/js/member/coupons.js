(function() {
    var status = Tools._GET().status || 0, //优惠券状态，0未使用、1已试用、2已过期，默认0
        container = $('.coupon'),
        rbyListDom = $('#tj-list'),
        tempData = undefined;

    //获取优惠券列表
    function getList() {
        Ajax.paging({
            url: '/members/coupons',
            data: {
                status: status || 0,
                page: config.PAGE,
                pageSize: config.PAGE_SIZE
            },
            showLoading: true,
            showEmpty: true,
            key: 'content'
        }, function(response) {
            tempData = response;
            container.show();
        }, function(textStatus, data) {
            rbyListDom.html('<div class="list-empty-data icon-coupon-empty">' + ((data && data.message) || '服务器异常。' + textStatus) + '</div>')
        });
    }

    // 点击优惠券弹出分享提示框
    container.on('click', '.coupon-box li', function(e) {
        e.preventDefault();

        //打开分享提示框
        $('#tj-cover-bg').show();
        $('#tj-cover-share').show();

        var cid = $(this).data('id');

        Ajax.custom({
            url: '/members/coupons/' + cid
        }, function(response) {
            var data = response;

            WechatCommon.Share.commonShare({
                shareTitle: config.COUPON_SHARE_DATA.SHARE_TITLE,
                shareDesc: config.COUPON_SHARE_DATA.SHARE_DESC,
                sharePic: config.COUPON_SHARE_DATA.SHARE_PIC,
                shareLink: common.getShareLink({
                    type: 'coupon',
                    couponId: cid
                })
            });
        });
    });

    // 点击分享框，直接关闭
    $('#tj-cover-share').click(function(e) {
        e.preventDefault();
        $('#tj-cover-bg').hide();
        $('#tj-cover-share').hide();
    })

    common.getList = getList;

    common.checkLoginStatus(function() { //入口
        getList();
    });

})()
