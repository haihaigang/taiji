/**
 * 配置信息
 * 把配置信息分为基础配置、提示信息
 */
(function() {
    var config = {
        PAGE_SIZE: 10, //默认分页大小
        PAGE: 1, //当前第几页，从1开始
        HOST_API: '/wechat', //相对地址
        HOST_IMAGE: location.protocol + '//' + location.host + '/', //图片地址的前缀，完整地址
        SHARE_HOST: location.protocol + '//' + location.host, //分享链接前缀，完整地址
        DEF_IMG_URL: '../content/images/default.png', //默认图片
        APPID: "wx9c0b5913dd495352", //微信appId，正式
        WHITELISTS: [ //静态资源的白名单
            'rbyair.com',
            'meigooo.com',
            'meigo.com',
            'baidu.com',
            'qq.com',
        ],
        IS_FILTER_ON: true, //是否开启静态资源过滤
        OSS_HOST: 'http://img01.rbyair.com', //oss的域名
        IS_WEBP_ON: true, //是否开启webp功能
        IS_MOCK_ON: false, //是否开启mock接口
        VERSION: '0.0.1' //版本号
    };

    if ('IS_DEBUG' in window) {
        config.IS_DEBUG = IS_DEBUG;
    }

    if ('VERSION' in window) {
        config.VERSION = VERSION;
    }

    if (config.IS_DEBUG) {
        //配置测试相关信息
        config.APPID = "wx9c0b5913dd495352"; //微信appId，测试
    }

    config.DETAIL_SHARE_LINK = config.SHARE_HOST + '/detail.html?id={ID}&cid={CID}'; //商品详情的分享链接
    config.COUPON_SHARE_LINK = config.SHARE_HOST + '/detail.html?cid={CID}'; //优惠券详情的分享链接

    config.ORDER_STATUS = { //订单状态
        PENDING: '未支付',
        PROCESSING: '已支付待发货',
        IN_TRANSIT: '已发货',
        DELIVERED: '已完成',
        PAYMENT_DUE: '支付超时',
        CANCELLED: '已取消',
        RETURNED: '已退货'
    };

    config.LEVEL = { //用户等级
        USER: '用户',
        MEMBER: '会员',
        AGENT: '代理',
        GENERAL_AGENT: '总代理'
    };

    config.DEFAULT_SHARE_DATA = { //默认分享数据
        SHARE_TITLE: '90+营养代餐健康购',
        SHARE_TEXT: '含有12大类，90多种食材，198元/盒，更多惊喜请点击',
        SHARE_PIC: config.SHARE_HOST + '/content/images/logo.png' //默认头像
    };

    config.COUPON_SHARE_DATA = { //优惠券的分享数据
        SHARE_TITLE: '90+营养代餐免费领',
        SHARE_DESC: '一份分享，一份爱心，收获一份健康，点击免费领取',
        SHARE_PIC: config.SHARE_HOST + '/content/images/share-coupon.jpg'
    };

    window.config = config;
})();
