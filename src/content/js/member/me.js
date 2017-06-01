(function() {
    var container = $('#tj-detail');

    // 点击关闭弹窗
    $('.levelup-close,.levelup-button button').click(function(e) {
        e.preventDefault();
        $(this).parents('.dialog').hide();
    });

    // 获取个人数据
    function getDetail() {
        Ajax.custom({
            url: '/members',
            showLoading: true
        }, function(response) {
            var data = response;

            // 添加昵称到标题
            // Common.setWechatTitle(data.nickname);

            if (data.avatar) {
                $('#me-avatar').attr('src', data.avatar);
            }
            $('#me-name').text(data.nickname || '--');
            $('#me-level').text(Config.LEVEL[data.level]);

            container.show();

            getStatus();
        }, function(textStatus, data) {
            container.show().html(data.message || '服务器异常');
        })
    }

    // 获取状态信息，获取用户等级提升和用户解绑的提示
    function getStatus() {
        Ajax.custom({
            url: '/members/notifications',
            showLoading: true
        }, function(response) {
            var data = response;

            for (var i = 0; i < data.length; i++) {
                if (data[i].type == 'UPGRADE') {
                    $('#tj-levelup-dialog').show();
                    $('#level-name').text(Config.LEVEL[data[i].extendedValue]);
                }
                if (data[i].type == 'QUIT') {
                    $('#tj-userleave-dialog').show();
                    $('#user-name').text(data[i].extendedValue);
                }
            }
        })
    }

    Common.checkLoginStatus(function() { //入口
        getDetail();
        //添加默认分享功能
        WechatCommon.Share.commonShare();
    });

})()
