(function() {
    var container = $('#tj-detail');

    // 点击关闭弹窗
    $('.close,.levelup-close,.levelup-button button').click(function(e) {
        e.preventDefault();
        $(this).parents('.dialog').hide();
    });

    // 点击遮罩关闭
    $('#tj-levelup2-dialog').click(function(e){
        e.preventDefault();

        if($(e.target).hasClass('dialog-content') || $(e.target).parents('.dialog-content').length > 0){
            return;
        }

        $(this).hide();
    });

    // 点击遮罩关闭
    $('#tj-levelup3-dialog').click(function(e){
        e.preventDefault();

        if($(e.target).hasClass('dialog-content') || $(e.target).parents('.dialog-content').length > 0){
            return;
        }

        $(this).hide();
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

            // data = [{
            //     type: 
            // }]

            for (var i = 0; i < data.length; i++) {
                if (data[i].type == Config.NOTIFICATION_TYPE.UPGRADE) {
                    // $('#tj-levelup-dialog').show();
                    // $('#level-name').text(Config.LEVEL[data[i].extendedValue]);
                    
                    // $('#tj-levelup2-dialog').show();
                    // $('#lev-nickname').text(data[i].nickname);
                    // $('#lev-nickname2').text(data[i].nickname);
                    // $('#lev-level-name').text(Config.LEVEL[data[i].extendedValue]);
                    // $('#lev-time').text(Tools.formatDate(data[i].createdAt, 'yyyy年M月d日'));
                    
                    $('#tj-levelup3-dialog').show();
                    $('#l-level').text(Config.LEVEL[data[i].extendedValue]);
                    $('#l-level2').text(Config.LEVEL[data[i].extendedValue]);
                }
                if (data[i].type == Config.NOTIFICATION_TYPE.QUIT) {
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
