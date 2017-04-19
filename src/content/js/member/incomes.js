(function() {
    var container = $('.container');

    function getInfo() {}

    function getData() {
        Ajax.custom({
            url: '/members/earnings'
        }, function(response) {

            var data = response;

            Ajax.render('#tj-info', 'tj-info-tmpl', data);
            Ajax.render('#tj-list', 'tj-list-tmpl', data.earnings);

            container.show();
        })
    }

    common.checkLoginStatus(function() { //入口
        getData();
        //添加默认分享功能
        WechatCommon.Share.commonShare();
    });
})()
