(function() {
    var container = $('.container'),
        newReferId = Tools._GET().newReferId;

    // 获取数据
    function getData() {
        var url = '/members';
        if (newReferId) {
            url = '/members/' + newReferId;
        }

        Ajax.custom({
            url: url
        }, function(response) {
            var data = response;

            if (!data.phoneNumber) {
                // 没有电话则添加公司的电话
                data.phoneNumber = '021-62199925';
            }

            Ajax.render('#tj-promotion', 'tj-promotion-tmpl', data);

            var userSn = Cookie.get("UserSN"),
                shareLink = Config.SHARE_HOST + '/member/promotion.html';

            if (!newReferId) {
                // 确保只有第一次分享追加该参数
                shareLink += '?newReferId=' + userSn;
            }

            // 此连接分享后可转发，转发后会员关系还是原分享者信息。
            // 1、除推广分享页面和优惠券分享页面外所有分享页面关系直接关连至公司。
            // 2、推广分享页面和优惠券分享页面分享关系关连分享者。
            WechatCommon.Share.commonShare({
                shareTitle: Config.PROMOTION_SHARE_DATA.SHARE_TITLE,
                shareDesc: Config.PROMOTION_SHARE_DATA.SHARE_DESC,
                sharePic: Config.PROMOTION_SHARE_DATA.SHARE_PIC,
                shareLink: shareLink
            });
        });
    }

    Common.checkLoginStatus(function() { //入口
        getData();
    });
})()
