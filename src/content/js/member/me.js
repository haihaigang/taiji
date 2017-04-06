(function() {

    var container = $('#tj-detail');

    // 获取个人数据
    function getDetail() {
        Ajax.custom({
            url: config.HOST_API_APP + '/member/info/get',
            showLoading: true
        }, function(response) {

            // 添加昵称到标题
            common.setWechatTitle(response.body.nickname);

            // 这里存储头像为了个人中心其它需要显示头像的页面使用，比如兑换优惠码
            if (response.body.avatar) {
                $('#me-avatar').attr('src', response.body.avatar.replace('/0', '/96'));
                Storage.set('avatar', response.body.avatar);
            } else {
                Storage.set('avatar', '');
            }
            $('#me-name').text(response.body.nickname || '--');

            container.show();
        }, function(textStatus, data) {
            container.show().html(data.message || '服务器异常');
        })
    }

    common.checkLoginStatus(function() { //入口
        getDetail();
    });
    
})()
