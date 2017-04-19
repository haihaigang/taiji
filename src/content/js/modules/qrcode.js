(function() {
    var container = $('.container');

    function getDetail() {
        Ajax.custom({
            url: '/members',
            showLoading: true
        }, function(response) {
            var data = response;

            if (data.avatar) {
                $('.qrcode-avatar').attr('src', data.avatar.replace('/0', '/96'));
            }
            $('.qrcode-title1').text(data.nickname || '--');

            var qr = qrcode(10, 'M');
            qr.addData(config.SHARE_HOST + '/index.html?referId=' + data.memberId);
            qr.make();
            $('.qrcode-img').html(qr.createImgTag(3));

            container.show();
        }, function(textStatus, data) {
            container.show().html(data.message || '服务器异常');
        })
    }

    common.checkLoginStatus(function() { //入口
        getDetail();
        //添加默认分享功能
        WechatCommon.Share.commonShare();
    });
})();
