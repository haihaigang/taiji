(function() {
    var container = $('#tj-detail');

    // 点击关闭弹窗
    $('.levelup-close,.levelup-button button').click(function(e) {
        e.preventDefault();
        $(this).parents('.dialog').hide();
    });

    // 点击兑换商品
    $('#tj-footer-end .btn').click(function(e){
        e.preventDefault();
        addCart();
    });

    startShake()

    /**
     * 获取数据
     * @return {[type]} [description]
     */
    function getData() {
        Ajax.custom({
            url: '/members',
            showLoading: true
        }, function(response) {
            var data = response;

            if (data.avatar) {
                $('#me-avatar').attr('src', data.avatar);
            }
            $('#me-name').text(data.nickname || '--');
            $('#me-level').text(Config.LEVEL[data.level]);

            container.show();

            // canRedeem:
            // level
            // memberId
            // nickname
            // phoneNumber
            // points
            // remainingShakes

            if(data.canRedeem){
                // 积分已满足
                $('#tj-footer-end').show();
            }else{
                $('#tj-shake-times').text(data.remainingShakes);
                $('#tj-shake-credit').text(data.points);
                $('#tj-footer-common').show();

                if(data.remainingShakes == 0){
                    // 如果剩余次数为0则弹出提示框
                    $('#tj-shake-max-dialog').show();
                }
            }

        }, function(textStatus, data) {
            container.show().html(data.message || '服务器异常');
        })
    }

    /**
     * 初始化摇一摇动画
     * @return {[type]} [description]
     */
    function startShake() {
        jdShake.start({
            duration: 500,
            onShaking: function() {
                $('.shake-shake-ani').addClass('shake');
                return false;
            },
            onEnd: function() {
                $('.shake-shake-ani').removeClass('shake');
                jdShake.destroy();
                sendShake();
                startShake();
                return false;
            }
        });
    }

    /**
     * 发起获取积分请求，在摇一摇之后
     * @return {[type]} [description]
     */
    function sendShake(){
        Ajax.custom({
            url: '/members/shake',
            type: 'POST'
        }, function(response){
            var data = response;

            $('#tj-shake-one-credit').text(data.points + '积分');
            $('#tj-shake-result-dialog').show();
        }, function(textStatus, data){
            Tools.showToast(data.message || '服务器异常');
        })
    }

    // 调用接口添加购物车
    function addCart(btnDom) {
        if (btnDom && btnDom.hasClass('disbled')) {
            return;
        }

        Ajax.custom({
            url: '/carts/items',
            data: {
                productId: 2, //这里商品ID固定为优惠券商品2
                quantity: 1
            },
            type: 'POST',
            contentType: 'application/json'
        }, function(response) {
            location.href = 'cart.html';
        }, function(textStatus, data) {
            if (data.exception.indexOf('NotSignupPhoneException') != -1) {
                // 用户未绑定手机号，提示
                $('#tj-bind-dialog').show();
                return;
            }
            Tools.showToast(data.message)
        });
    }

    window.sendShake = sendShake;

    Common.checkLoginStatus(function() { //入口
        getData();
        //添加默认分享功能
        WechatCommon.Share.commonShare();
    });
})();
