(function() {
    var container = $('.container'),
        AD_RATIO = 750 / 354; //轮播图的比例

    function getList() {
        Ajax.custom({
            url: '/products'
        }, function(response) {
            var data = response.content;

            Ajax.render('#tj-list', 'tj-list-tmpl', data);
            $('.home-banner,.home-banner img').css('height', parseInt($('body').width() / AD_RATIO));
            $('.container').show();

            // 在dom显示之后初始化，以便能正确获取dom
            new Swiper(".swiper-container", {
                pagination: '.swiper-pagination',
                wrapperClass: 'swiper-wrapper',
                slideClass: 'swiper-slide',
                loop: true,
                autoplay: 3000,
                autoplayDisableOnInteraction: false
            })

        });
    }

    Common.checkLoginStatus(function() { //入口
        getList();

        //添加默认分享功能
        WechatCommon.Share.commonShare();
    });
})()
