/**
 * 配置信息
 * 把配置信息分为基础配置、提示信息
 */
(function() {
    var config = {
        PAGE_SIZE: 10, //默认分页大小
        page: 1, //当前第几页，从1开始
        PAGE: 1, //当前第几页，从1开始
        HOST_API: '/wechat', //相对地址
        HOST_API_APP: '', //相对地址
        JAVA_HOST_URL: '/api', //相对地址
        HOST_IMAGE: location.protocol + '//' + location.host + '/', //图片地址的前缀，完整地址
        SHARE_HOST: location.protocol + '//' + location.host, //分享链接前缀，完整地址
        DEF_IMG_URL: '../content/images/common/default.png', //默认图片
        OAUTHURL: "https://open.weixin.qq.com/connect/oauth2/authorize?appid=APPID&redirect_uri=REDIRECT_URI&response_type=code&scope=SCOPE&state=STATE&connect_redirect=1#wechat_redirect", //微信授权跳转地址
        APPID: "wx9c0b5913dd495352", //微信appId，正式（皇家空港）
        RATIO_OF_MAINPIC: 640 / 480, //商品图片的宽高比
        RATIO_OF_ADPIC: 2 / 1, //广告图片的宽高比
        RATIO_OF_MAINBANNER: 2 / 1, //首页图片的宽高比
        RATIO_OF_MAINADS: 157 / 375, //首页广告位的宽高比
        RATIO_OF_MAINADSPINSELECTION: 750 / 259, //首页一起买
        RATIO_OF_MAINADSSELECTION: 375 / 150, //首页精选，特卖
        RATIO_OF_MAINADSHOT: (375 / 2) / 271, //首页热卖单品
        RATIO_OF_MAINADSADS: 375 / 75, //首页广告栏
        RATIO_OF_SECONDKILLADS: 375 / 120, // 秒杀广告栏
        RATIO_OF_MAINGOODSLIST: 375 / 175, //首页热卖单品
        GROUP_OF_ADPIC: 376 / 143, //专题团分类图片尺寸
        RATIO_OF_GOODSLIST: 375 / 100, //海外精选商品列表模式
        RATIO_OF_GOODSBLOCKLIST: 375 / 138, //海外精选商品列表俩列模式
        RATIO_OF_SECONDKILLLIST: 375 / 160, //海外精选商品列表模式
        RATIO_OF_PINMAINPIC: 375 / 230, //一起买详情页活动头图
        RATIO_OF_PINADPIC: 375 / 105, //一起买详情页广告图
        GOODS_AVERAGE_IMGSCALE: 155 / 155, //两列商品图(w:50%)1:1尺寸
        SMS_DURATION: 120, //发短信计时间隔，秒
        BAIDU_ID: '5fffc31d90b052e2a95c9070595d35dc', //百度统计,正式
        IOS_VERSION: '2.2.0', //发布之初隐藏ios中相关抽奖栏目，若版本号与配置的一致则隐藏
        SHARE_HOSTS: [],
        REPLACE_HOST: [ //替换域名，对native的webview中某些配置链接非当前域名
            'm.meigooo.com',
            'v4.meigooo.com'
        ],
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
        DEBUG_HOSTS: [ //默认开启调试模式的域名
            'wx.rbyair.com'
        ],
        IS_MOCK_ON: false, //是否开启mock接口
        TH_HOST: 'http://th.meigooo.com/_?', //统计信息的路由，正式
        VERSION: '2.4.4' //版本号
    };

    if ('IS_DEBUG' in window) {
        config.IS_DEBUG = IS_DEBUG;
    }

    if ('VERSION' in window) {
        config.VERSION = VERSION;
    }

    //约定wx.rbyair.com等来源的地址都启用调试模式
    for (var i in config.DEBUG_HOSTS) {
        if (location.hostname.indexOf(config.DEBUG_HOSTS[i]) == 0) {
            config.IS_DEBUG = true;
            break;
        }
    }

    //设置多个分享的链接，以防止微信中分享到朋友圈被屏蔽
    for (var i = 0; i < 100; i++) {
        config.SHARE_HOSTS.push("http://m" + i + ".share.meigo.net.cn");
    }

    if (config.IS_DEBUG) {
        //配置测试相关信息，只有开启调试模式或者是通过wx.rbyair.com域名访问使用该配置
        config.APPID = "wx9c0b5913dd495352"; //微信appId，测试（美购皇家空港跨境购）
        config.SHARE_HOSTS = ['http://wx.rbyair.com'];
        config.BAIDU_ID = 'b9a810f993975be7beb26c5482351888'; //百度统计，测试
        config.IOS_VERSION = '9.9.9'; //设置不存在的版本号，忽略隐藏
        config.REPLACE_HOST = [ //替换富文本的域名
            'm.meigooo.com',
            'wx.rbyair.com'
        ];
        config.TH_HOST = 'http://th-test.meigooo.com/_?'; //统计信息的路由，测试
    }

    config.DETAIL_SHARE_LINK = config.SHARE_HOST + '/detail.html?id=ID&cid=CID'; //商品详情的分享链接
    config.COUPON_SHARE_LINK = config.SHARE_HOST + '/detail.html?cid=CID'; //优惠券详情的分享链接
    config.SHARE_TITLE = '美购微官网';
    config.SHARE_TEXT = '全球精品超市，尽在美购微官网！组团、拼美货、助力团，各种活动任亲挑选！';
    config.DEF_AVATAR = config.HOST_IMAGE + 'content/images/logo.png'; //默认头像

    config.ORDER_STATUS = { //订单状态
        '1': '未支付',
        '2': '未支付',
        '3': '已支付'
    };

    config.NEW_ORDER_STATUS = { //订单状态
        '1': '未完成',
        '2': '待发货',
        '3': '待收货',
        '4': '已完成',
        '5': '去支付'
    };

    config.ORDER_DETAIL_STATUS = { //订单详情状态
        '2': '待发货',
        '3': '待收货',
        '4': '交易完成',
        '5': '待支付',
        '6': '交易关闭',
        '9': '已支付待成团'
    };

    config.ORDERFLOW_STATUS = { //订单物流状态
        '0': '在途中',
        '1': '已揽收',
        '2': '疑难',
        '3': '已签收',
        '4': '退签',
        '5': '同城派送中',
        '6': '退回',
        '7': '转单'
    };

    config.LEVEL = { //用户等级
        USER: '用户',
        MEMBER: '会员',
        AGENT: '代理',
        GENERAL_AGENT: '总代理'
    };

    window.config = config;
})();
