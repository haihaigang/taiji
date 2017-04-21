(function() {
    var status = Tools._GET().status || 0, //优惠券状态，0未使用、1已试用、2已过期，默认0
        container = $('.coupon'),
        rbyListDom = $('#tj-list'),
        tempData = undefined;

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

            initShare(cid);
        });
    });

    // 点击分享框，直接关闭
    $('#tj-cover-share').click(function(e) {
        e.preventDefault();
        $('#tj-cover-bg').hide();
        $('#tj-cover-share').hide();
    });

    //获取优惠券列表
    function getList() {
        Ajax.paging({
            url: '/members/coupons',
            data: {
                status: status || 0,
                page: Config.PAGE,
                pageSize: Config.PAGE_SIZE
            },
            showLoading: true,
            showEmpty: true,
            key: 'content'
        }, function(response) {
            tempData = response;
            container.show();

            if (tempData.content && tempData.content.length > 0) {
                // 默认初始化分享第一个优惠券数据
                initShare(tempData.content[0].id);
            }
        }, function(textStatus, data) {
            rbyListDom.html('<div class="list-empty-data icon-coupon-empty">' + ((data && data.message) || '服务器异常。' + textStatus) + '</div>')
        });
    }

    //初始化分享
    function initShare(cid) {
        WechatCommon.Share.commonShare({
            shareTitle: Config.COUPON_SHARE_DATA.SHARE_TITLE,
            shareDesc: Config.COUPON_SHARE_DATA.SHARE_DESC,
            sharePic: Config.COUPON_SHARE_DATA.SHARE_PIC,
            shareLink: Common.getShareLink({
                type: 'coupon',
                couponId: cid
            })
        });
    }

    Common.getList = getList;

    Common.checkLoginStatus(function() { //入口
        getList();
    });

})()
