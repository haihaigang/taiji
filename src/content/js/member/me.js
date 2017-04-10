(function() {
    var container = $('#tj-detail');

    // 获取个人数据
    function getDetail() {
        Ajax.custom({
            url: '/members',
            showLoading: true
        }, function(response) {
            var data = response;

            // 添加昵称到标题
            common.setWechatTitle(data.nickname);

            if (data.avatar) {
                $('#me-avatar').attr('src', data.avatar);
            }
            $('#me-name').text(data.nickname || '--');
            $('#me-level').text(config.LEVEL[data.level]);

            container.show();
        }, function(textStatus, data) {
            container.show().html(data.message || '服务器异常');
        })
    }

    // 获取状态信息，获取用户等级提升和用户解绑的提示
    function getStatus() {
        Ajax.custom({
            url: '/members',
            showLoading: true
        }, function(response) {
            var data = response;

            if (data.levelUp) {
                $('#tj-levelup-dialog').show();
                $('#level-name').text(config.LEVEL[data.level]);
            }
            if (data.userLeave) {
                $('#tj-userleave-dialog').show();
                $('#user-name').text(data.userName);
            }
        })
    }

    common.checkLoginStatus(function() { //入口
        getDetail();
    });

})()
