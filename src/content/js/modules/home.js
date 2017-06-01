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

            getAds();

            getQuickAd();

        });
    }

    /**
     * 获取滚动广告
     * 广告位=1
     * @return {[type]} [description]
     */
    function getAds() {
        Ajax.custom({
            url: '/ads/1/contents'
        }, function(response) {
            var data = response;
            Ajax.render('#tj-ads', 'tj-ads-tmpl', data);

            initSwiper();
        });
    }

    /**
     * 获取文字滚动广告
     * 广告位=2
     * @return {[type]}            [description]
     */
    function getQuickAd() {
        Ajax.custom({
            url: '/ads/2/contents'
        }, function(response) {
            var data = response;

            if(data.length > 0){
                $('.home-quickad').show();
                $('.home-quickad-content').text(data[0].text);
            }
        });
    }

    /**
     * 初始化滚动广告
     * @return {[type]} [description]
     */
    function initSwiper() {
        new Swiper(".swiper-container", {
            pagination: '.swiper-pagination',
            wrapperClass: 'swiper-wrapper',
            slideClass: 'swiper-slide',
            loop: true,
            autoplay: 3000,
            autoplayDisableOnInteraction: false
        })
    }

    Common.checkLoginStatus(function() { //入口
        getList();

        //添加默认分享功能
        WechatCommon.Share.commonShare();
    });
})()
