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
            // $('.qrcode-img').attr('src','');

            container.show();
        }, function(textStatus, data) {
            container.show().html(data.message || '服务器异常');
        })
    }

    common.checkLoginStatus(function() { //入口
        getDetail();
    });
})();
