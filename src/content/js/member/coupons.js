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
                page: config.page,
                pageSize: config.PAGE_SIZE
            },
            showLoading: true,
            showEmpty: true
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

            WechatCommon.share.commonShare({
                shareTitle: data.shareTitle,
                shareDesc: data.shareDesc,
                sharePic: data.shareImg
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
