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

            // 这里存储头像为了个人中心其它需要显示头像的页面使用，比如兑换优惠码
            if (data.avatar) {
                $('#me-avatar').attr('src', data.avatar.replace('/0', '/96'));
                Storage.set('avatar', data.avatar);
            } else {
                Storage.set('avatar', '');
            }
            $('#me-name').text(data.nickname || '--');
            $('#me-level').text(config.LEVEL[data.level]);

            container.show();
        }, function(textStatus, data) {
            container.show().html(data.message || '服务器异常');
        })
    }

    common.checkLoginStatus(function() { //入口
        getDetail();
    });
    
})()
