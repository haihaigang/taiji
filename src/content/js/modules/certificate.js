(function(){

	var container = $('.container');
	
	// 获取个人数据
    function getDetail() {
        Ajax.custom({
            url: '/members',
            showLoading: true
        }, function(response) {
            var data = response;

            if(data.level == 'USER'){
            	$('.certificate-empty').show();
            	return;
            }

            $('#cert-name').text(data.nickname || '--');
            $('#cert-level').text(Config.LEVEL[data.level]);
            $('#cert-phone').text(data.phoneNumber || '--');
            $('.certificate-content').show();

        }, function(textStatus, data) {
            container.show().html(data.message || '服务器异常');
        })
    }

    Common.checkLoginStatus(function() { //入口
        getDetail();
    });
})()