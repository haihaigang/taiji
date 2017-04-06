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
        APPID: "wxc6e2d0540bf45180", //微信appId，正式（皇家空港）
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

    if ('VERSION' in window){
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
        config.APPID = "wx457594644bbb9ac8"; //微信appId，测试（美购皇家空港跨境购）
        config.SHARE_HOSTS = ['http://wx.rbyair.com'];
        config.BAIDU_ID = 'b9a810f993975be7beb26c5482351888'; //百度统计，测试
        config.IOS_VERSION = '9.9.9'; //设置不存在的版本号，忽略隐藏
        config.REPLACE_HOST = [ //替换富文本的域名
            'm.meigooo.com',
            'wx.rbyair.com'
        ];
        config.TH_HOST = 'http://th-test.meigooo.com/_?'; //统计信息的路由，测试
    }

    config.GROUP_SHARE_LINK = config.SHARE_HOST + '/group/detail.html?pinId=PINID&groupId=GROUPID'; //专题团组团分享的链接
    config.GROUP_ACTIVITY_SHARE_LINK = config.SHARE_HOST + '/group/activity-detail.html?pinId=PINID'; //专题团分享的链接
    //config.__CUT_SHARE_LINK = config.SHARE_HOST + '/bargain/bargain-detail.html?bargainId=BARGAINID&joinId=JOINID'; //砍价分享的链接
    config.PIN_SHARE_LINK = config.SHARE_HOST + '/pin/group-detail.html?pinId=PINID&groupId=GROUPID'; //一起买详情分享的链接
    config.PIN_GROUP_SHARE_LINK = config.SHARE_HOST + '/pin/detail.html?pinId=PINID&groupId=GROUPID'; //一起买组团分享的链接
    config.SECONDKILL_SHARE_LINK = config.SHARE_HOST + '/pin/group-detail.html?pinId=PINID'; //秒杀详情分享的链接
    config.SECONDKILL_GROUP_SHARE_LINK = config.SHARE_HOST + '/secondkill/detail.html?pinId=PINID&groupId=GROUPID'; //秒杀团分享的链接
    config.GROUP_DETAIL_SHARE_LINK = config.SHARE_HOST + '/group/askForGroup.html?pinId=PINID&groupId=GROUPID&memberId=MEMBERID'; //专题团分享的链接
    config.CHOU_SHARE_LINK = config.SHARE_HOST + '/chou/detail.html?activityId=ACTIVITYID&groupId=GROUPID'; //抽奖分享的链接
    config.SHARE_TITLE = '美购微官网';
    config.SHARE_TEXT = '全球精品超市，尽在美购微官网！组团、拼美货、助力团，各种活动任亲挑选！';
    config.DEF_AVATAR = config.HOST_IMAGE + 'content/images/common/logo.png'; //默认头像

    // config.__TIPS_GROUP_NOLOWPRICE = '还差{PERSONS}人即可享受最低价，是否确定现在下单？';
    // config.__TIPS_GROUP_HAVEJOIN = '您已参加{NAME}的团购活动，是否退出之前活动参与当前团购？';
    // config.__TIPS_BARGAIN_NOLOWPRICE = '还差{PERSONS}元即可享受最低价，是否确定现在下单？';

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

    // 用户角色userRole，非团员0、团长1、团员2
    // 活动状态actStatus，未开始0、已开始1、已结束2、已售罄3
    // 开团状态groupStatus，未开团0、组团中（开团成功、参团成功）1、组团成功2、组团失败3
    config.PIN_STATUS = {
        1: {
            0: {
                title: '快来加入一起买',
                desc: '就差你了',
                btn: '我也要参团'
            },
            1: {
                title: '开团成功',
                desc: '快去邀请好友加入吧',
                btn: '还差{PERSONS}人，点击分享'
            },
            2: {
                title: '参团成功',
                desc: '快去邀请好友加入吧',
                btn: '还差{PERSONS}人，点击分享'
            }
        },
        2: {
            0: {
                title: '来晚一步，该团已被挤爆',
                desc: '求人不如求己，自己当团长吧！',
                btn: '我要开团'
            },
            1: {
                title: '一起买成功',
                desc: '敬请期待快递小哥送货上门！',
                btn: '再次开团'
            },
            2: {
                title: '一起买成功',
                desc: '敬请期待快递小哥送货上门！',
                btn: '我要开团'
            }
        },
        3: {
            0: {
                title: '来晚一步',
                desc: '',
                btn: '我要开团'
            },
            1: {
                title: '只差一点点',
                desc: '一起买失败',
                btn: '再次开团'
            },
            2: {
                title: '只差一点点',
                desc: '一起买失败',
                btn: '我要开团'
            }
        },
        open: {
            title: '开团成功',
            desc: '快去邀请好友加入吧',
            btn: '还差{PERSONS}人一起买成功'
        },
        join: {
            title: '参团成功',
            desc: '快去邀请好友加入吧',
            btn: '还差{PERSONS}人一起买成功'
        },
        beforeJoin: {
            title: '快来加入一起买',
            desc: '就差你了',
            btn: '我也要参团'
        },
        success: {
            title: '一起买成功',
            desc: '敬请期待快递小哥送货上门！',
            btn: '再次开团'
        },
        fail: {
            title: '只差一点点',
            desc: '一起买失败',
            btn: '我要开团'
        },
        fail: {
            title: '只差一点点',
            desc: '一起买失败',
            btn: '我也开个团'
        },
        winner: {
            title: '开奖成功',
            desc: '',
            btn: '已开奖，去首页看看'
        },
        end: {
            title: '来晚一步',
            desc: '该活动已结束',
            btn: ''
        }
    };

    // 用户角色userRole，非团员0、团长1、团员2
    // 活动状态actStatus，未开始0、已开始1、已结束2、已售罄3
    // 开团状态groupStatus，未开团0、组团中（开团成功、参团成功）1、组团成功2、组团失败3
    config.GROUP_STATUS = {
        1: {
            0: {
                title: '快来加入专题团',
                desc: '就差你了',
                btn: '我也要参团'
            },
            1: {
                title: '开团成功',
                desc: '快去邀请好友加入吧',
                btn: '邀请好友'
            },
            2: {
                title: '参团成功',
                desc: '快去邀请好友加入吧',
                btn: '邀请好友'
            }
        },
        2: {
            0: {
                title: '来晚一步，该团已被挤爆',
                desc: '求人不如求己，自己当团长吧！',
                btn: '我要开团'
            },
            1: {
                title: '专题团成功',
                desc: '敬请期待快递小哥送货上门！',
                btn: '再次开团'
            },
            2: {
                title: '专题团成功',
                desc: '敬请期待快递小哥送货上门！',
                btn: '我要开团'
            }
        },
        3: {
            0: {
                title: '来晚一步',
                desc: '',
                btn: '我要开团'
            },
            1: {
                title: '只差一点点',
                desc: '专题团失败',
                btn: '再次开团'
            },
            2: {
                title: '只差一点点',
                desc: '专题团失败',
                btn: '我要开团'
            }
        },
        open: {
            title: '开团成功',
            desc: '快去邀请好友加入吧',
            btn: '还差{PERSONS}人专题团成功'
        },
        join: {
            title: '参团成功',
            desc: '快去邀请好友加入吧',
            btn: '还差{PERSONS}人专题团成功'
        },
        beforeJoin: {
            title: '快来加入专题团',
            desc: '就差你了',
            btn: '我也要参团'
        },
        success: {
            title: '专题团成功',
            desc: '敬请期待快递小哥送货上门！',
            btn: '再次开团'
        },
        fail: {
            title: '只差一点点',
            desc: '专题团失败',
            btn: '我要开团'
        },
        fail: {
            title: '只差一点点',
            desc: '专题团失败',
            btn: '我也开个团'
        },
        winner: {
            title: '开奖成功',
            desc: '',
            btn: '已开奖，去首页看看'
        },
        end: {
            title: '来晚一步',
            desc: '该活动已结束',
            btn: ''
        }
    };

    //抽奖前的状态
    config.CHOU_STATUS = {
        1: {
            0: {
                title: '快来加入拼团吧',
                desc: '就差你了',
                statusMsg: '还差<em>{PERSONS}</em>人，拼团成功',
                btn: '我也要参团'
            },
            1: {
                title: '开团成功',
                desc: '赶快招募好友加入吧',
                statusMsg: '还差<em>{PERSONS}</em>人，拼团成功',
                btn: '还差{PERSONS}人，点击分享'
            },
            2: {
                title: '参团成功',
                desc: '赶快招募好友加入吧',
                statusMsg: '还差<em>{PERSONS}</em>人，拼团成功',
                btn: '还差{PERSONS}人拼团成功'
            }
        },
        2: {
            0: {
                title: '来晚一步，该团已被挤爆',
                desc: '求人不如求己，自己当团长吧！',
                statusMsg: '对于诸位大侠相助，团长感激涕零',
                btn: '我要开团'
            },
            1: {
                title: '拼团成功',
                desc: '期待大家抽中大奖',
                statusMsg: '对于诸位大侠相助，团长感激涕零',
                btn: '再次开团'
            },
            2: {
                title: '拼团成功',
                desc: '期待大家抽中大奖',
                statusMsg: '对于诸位大侠相助，团长感激涕零',
                btn: '再次开团'
            }
        },
        3: {
            0: {
                title: '来晚一步',
                desc: 'APP优惠券已发放，下次努力哦~',
                statusMsg: '拼团失败，支付款项将自动退回<br />一大波鼓励优惠券已发送至您的APP账户中',
                btn: '我要开团'
            },
            1: {
                title: '只差一点点',
                desc: 'APP优惠券已发放，下次努力哦~',
                statusMsg: '拼团失败，支付款项将自动退回<br />一大波鼓励优惠券已发送至您的APP账户中',
                btn: '再次开团'
            },
            2: {
                title: '只差一点点',
                desc: 'APP优惠券已发放，下次努力哦~',
                statusMsg: '拼团失败，支付款项将自动退回<br />一大波鼓励优惠券已发送至您的APP账户中',
                btn: '再次开团'
            }
        },
        groupWinner: {
            title: '恭喜团友中奖',
            desc: '下次就是您哦～',
            statusMsg: '',
            btn: '查看中奖名单'
        },
        selfWinner: {
            title: '恭喜您中奖啦!',
            desc: '',
            statusMsg: '',
            btn: '查看中奖名单'
        },
        end: {
            title: '来晚一步',
            desc: '该活动已结束',
            statusMsg: '',
            btn: ''
        },
        drawNoGroup: {
            title: '来晚一步',
            desc: '该拼团活动已于{DATE}开出大奖~',
            statusMsg: '',
            btn: ''
        }

    };


    //抽奖后的状态
    config.CHOU_END_STATUS = {
        1: {},
        2: {
            0: {
                title: 'APP优惠券已发放',
                desc: '下次努力哦~',
                statusMsg: '本次拼团已开奖，您的支付款项将自动退回<br /> 一大波鼓励优惠券已发送至您的APP账户中',
                btn: '查看中奖名单'
            },
            1: {
                title: '只差一点点',
                desc: 'APP优惠券已发放，下次努力哦~',
                statusMsg: '本次拼团已开奖，您的支付款项将自动退回<br /> 一大波鼓励优惠券已发送至您的APP账户中',
                btn: '查看中奖名单'
            },
            2: {
                title: 'APP优惠券已发放',
                desc: '下次努力哦~',
                statusMsg: '本次拼团已开奖，您的支付款项将自动退回<br /> 一大波鼓励优惠券已发送至您的APP账户中',
                btn: '查看中奖名单'
            }
        },
        3: {
            0: {
                title: '来晚一步',
                desc: 'APP优惠券已发放，下次努力哦~',
                statusMsg: '拼团失败，支付款项将自动退回<br /> 一大波鼓励优惠券已发送至您的APP账户中',
                btn: '查看中奖名单'
            },
            1: {
                title: '只差一点点',
                desc: 'APP优惠券已发放，下次努力哦~',
                statusMsg: '拼团失败，支付款项将自动退回<br /> 一大波鼓励优惠券已发送至您的APP账户中',
                btn: '查看中奖名单'
            },
            2: {
                title: 'APP优惠券已发放',
                desc: '下次努力哦~',
                statusMsg: '拼团失败，支付款项将自动退回<br /> 一大波鼓励优惠券已发送至您的APP账户中',
                btn: '查看中奖名单'
            }
        },
        4: {
            0: {
                title: '恭喜团友中奖',
                desc: '下次就是您哦～',
                statusMsg: '恭喜团友中奖！您的支付款项将自动退回<br /> 一大波鼓励优惠券已发送至您的APP账户中',
                btn: '查看中奖名单'
            },
            1: {
                title: '恭喜团友中奖',
                desc: '下次就是您哦～',
                statusMsg: '恭喜团友中奖！您的支付款项将自动退回<br /> 一大波鼓励优惠券已发送至您的APP账户中',
                btn: '查看中奖名单'
            },
            2: {
                title: '恭喜团友中奖',
                desc: '下次就是您哦～',
                statusMsg: '恭喜团友中奖！您的支付款项将自动退回<br /> 一大波鼓励优惠券已发送至您的APP账户中',
                btn: '查看中奖名单'
            }
        }

    };

    //npage Id
    config.npageId = {
        'index' : 200003,
        'group': 200020,
        'secondKill': 200030
    };

    //widget height_radio
    //widget图片高度设置
    var $body = $("body"),
        windowWidth = $body.width()
    config.heightRatio = {
        title: "height:" + 44 / 375 * windowWidth + "px", //title
        old_pic: "height:" + ((50 / 100 * windowWidth) - 6) + "px", //old_pic旧版图片
        type_11: "height:" + 150 / 375 * windowWidth + "px", //banner
        type_12: "height:" + 170 / 375 * windowWidth + "px", //广告图
        type_14: "height:" + ((windowWidth - 39) / 2) + "px", //商品block
        type_14_sp_w: "width:" + 136 / 375 * windowWidth + "px;", //商品list宽度
        type_14_sp_h: "height:" + 136 / 375 * windowWidth + "px;", //商品list高度
        type_17: "height:" + 52 / 77 * ((windowWidth - 66) / 4) + "px", //快速功能区
        type_24: "height:" + 230 / 375 * windowWidth + "px", //一起买
        type_25: "height:" + ((windowWidth - 36) / 3) + "px" //猜你喜欢
    };

    window.config = config;
})();
