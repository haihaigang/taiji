/**
 * 扩展模板帮助方法
 * 依赖artTemplate，tools
 */
(function(template) {
    if (!template) return;

    template.openTag = "<!--[";
    template.closeTag = "]-->";

    // 模板帮助方法，判断地址是否直辖市展示逻辑
    template.helper('$getPendingAddress', function(province, city ,district) {
        var arr = ['上海', '北京', '重庆', '天津'];
        var isCity = arr.every(function(n) {
            return n.indexOf(province) == -1;
        })
        return isCity ?  province +" "+ city : city + " " +district;
    })

    // 模板帮助方法，绝对化图片地址 空白1，
    template.helper('$absImg', function(content, defaultValue) {
        return Tools.absImg(content, defaultValue);
    });

    // 模板帮助方法，转换时间戳成字符串1
    template.helper('$formatDate', function(content, type, defaultValue) {
        return Tools.formatDate(content, type, defaultValue || '--');
    });

    //模板帮助方法，编码url参数
    template.helper('$encodeUrl', function(content) {
        return encodeURIComponent(content);
    });

    //模板帮助方法，格式化货币
    template.helper('$formatCurrency', function(content, defaultValue, unit) {
        return Tools.formatCurrency(content, defaultValue, unit);
    });

    //模板帮助方法，\r\n替换换行
    template.helper('$convertRN', function(content) {
        if (!content) {
            return '--';
        }
        return content.replace(/\r\n/gi, '<br/>');
    });

    //模板帮助方法，根据序列值添加样式名
    template.helper('$addClassByIdx', function(i, v, className) {
        if (i == v) {
            return className || '';
        }
    });

    //模板帮助方法，截取内容长度添加省略号
    template.helper('$ellipsis', function(content, length) {
        var v = content.replace(/[^\x00-\xff]/g, '__').length;
        if (v / 2 > length) {
            return content.substring(0, length) + '...';
        }
        return content;
    });

    //模板帮助方法， 从时间字符串中截取日期，限定字符串yyyy-MM-dd...
    template.helper('$getDateFromStr', function(content) {
        if (!content || content.length == 0) {
            return;
        }

        var len = content.length > 10 ? 10 : content.length;
        return content.substring(0, len);
    });

    //模板帮助方法，转换价格
    template.helper('$rbyFormatCurrency', function(content) {
        return Tools.rbyFormatCurrency(content);
    });

    // 模版帮助方法，转换价格成数组
    template.helper('$rbySpecialCurrency', function(content) {
        return Tools.rbySpecialCurrency(content)
    });

    //模板帮助方法，根据条件添加样式
    template.helper('$addClassByCondition', function(condition, className, className2) {
        if (condition) {
            return className || '';
        } else {
            return className2 || '';
        }
    });

    //模板帮助方法，获取订单状态值
    template.helper('$getOrderStatus', function(content, type) {
        return config.ORDER_STATUS[content] || '--';
    });

    //模板帮助方法，获取用户等级名称
    template.helper('$getLevelName', function(content) {
        return config.LEVEL[content] || '--';
    });

    //模板帮助方法，获取订单物流状态值
    template.helper('$getOrderFlowStatus', function(content) {
        return config.ORDERFLOW_STATUS[content] || content;
    });

    //模板帮助方法，转换数字
    template.helper('$number', function(content) {
        return Number(content);
    });

    //模板帮助方法，获取订单物流电话号码
    template.helper('$getOrderFlowTel', function(content) {
        var pattern = /\d{11}/;
        var contentTel = content.match(pattern);
        if (contentTel) {
            if (contentTel.length > 0) {
                return content.replace(pattern, '<a href="tel:' + contentTel[0] + '">' + contentTel[0] + '</a>');
            } else {
                return content;
            }
        } else {
            return content;
        }

    });

    //模板帮助方法，
    template.helper('$addClassForGoods', function(data, className, className2) {
        if (!data || isNaN(data.limitNum) || isNaN(data.store) || isNaN(data.quantity)) return '';
        data.limitNum = parseInt(data.limitNum);
        data.store = parseInt(data.store);
        data.quantity = parseInt(data.quantity);
        // isDeals 1:特惠商品 0:普通商品
        if (data.isDeals == 1) {
            return className || '';
        } else {
            return className2 || '';
        }
        if (data.quantity >= Math.min(data.limitNum, data.store)) {
            return className || '';
        } else {
            return className2 || '';
        }
    });

    // 模板帮助方法，格式化倒计时
    template.helper('$getCountDown', function(data, other, isPre, showStyle, isNewVersion) {

        if (typeof data == 'object') {
            return Tools.getRunTime(data.serverTime, data.endTime, data.isPre, data.showStyle, isNewVersion);
        } else {
            return Tools.getRunTime(data, other, isPre, showStyle, isNewVersion);
        }
    });

    // 模板帮助方法，转换微信头像，最后一个数值代表正方形头像大小（有0、46、64、96、132数值可选，0代表640*640正方形头像），用户没有头像时该项为空。若用户更换头像，原有头像URL将失效。
    template.helper('$absWechatIcon', function(content) {
        if (!content || content.indexOf('http://') != 0) return '../content/images/common/icon-group-member.png';
        //http://wx.qlogo.cn/mmopen/xxx/0
        var arr = content.split('/');
        if (arr[arr.length - 1] == '0') {
            arr[arr.length - 1] = '96';
        }
        return arr.join('/');
    });

    // 模版帮助方法，获取URL某个参数的值
    template.helper('$getQueryValue', function(name) {
        return Tools.getQueryValue(name);
    });

    // 模版帮助方法，判断是否APP中打开
    template.helper('$isRbyAppBrowser', function() {
        return Tools.isRbyAppBrowser()
    });

    // 模版帮助方法，获取国家图标地址
    template.helper('$getCountryImg', function(content) {
        if (!content) return content;
        if (content.indexOf('http://') == 0) {
            return content;
        } else {
            return '/content/resources/flag/' + content + '.png';
        }
    });

    // 模版帮助方法，替换富文本中的域名
    template.helper('$replaceHost', function(content) {
        if (!content || !config.REPLACE_HOST || config.REPLACE_HOST.length != 2 || !Tools.isRbyAppBrowser()) {
            return content;
        }

        var reg = new RegExp(config.REPLACE_HOST[0], 'g');
        return content.replace(reg, config.REPLACE_HOST[1]);
    });

    /*
     * 模板帮助方法，转换内容配置的target，新的java接口规则
     * @param data 内容数据，eg:{contentType: 'number', target: 'string'}
     * @return string 最终跳转的链接地址
     * 
     * contentType的值说明：
     * '1': '链接地址',
     * '2': '海外精选商品详情',
     * '3': '海外精选商品分类',
     * '4': '一起买详情',
     * '5': '专题团详情',
     * '6': '抽奖详情',
     * '7': '拼团活动页面',
     * '8': '文本',
     * '9': '首页',
     * '10': '一起买团详情,暂定搜索结果页用',
     * '11': '专题团团详情,暂定搜索结果页用',
     * '12': '秒杀团团详情,暂定搜索结果页用',
     */
    template.helper('$absUrl', function(data) {
        var url = '',
            prefix = '',
            type = data.contentType ? data.contentType : null,
            value = data.target ? data.target.toString() : '';

        if (!type || !value) {
            return "javascript:void(0)";
        }

        // 优先处理不需要值的类型跳转
        if (type == 8) {
            return "javascript:void(0)";
        }
        if (type == 9) {
            return "javascript:Go.toHome()";
        }

        // 值判断需要在不需要值的类型判断之后
        if (value.indexOf('#') == 0 || value.indexOf("javascript") == 0) {
            //约定#开头或javascript开头都设置空链接
            return "javascript:void(0)";
        }

        if (type == 2) {
            return "javascript:Go.toDetail(" + value + ")";
        }
        if (type == 3) {
            return "javascript:Go.toCategory(" + value + ")";
        }
        if (type == 7) {
            return "javascript:Go.toGroup(" + value + ")";
        }

        switch (parseInt(type)) {
            case 1:
                {
                    prefix = '';
                    url = value;
                    break;
                }
            case 4:
                {
                    prefix = '';
                    url = '/pin/group-detail.html?pinId=' + value;
                    break;
                }
            case 5:
                {
                    prefix = '';
                    url = '/group/activity-detail.html?pinId=' + value;
                    break;
                }
            case 6:
                {
                    prefix = '';
                    url = '/chou/detail.html?activityId=' + value;
                    break;
                }
            case 10:
                {
                    prefix = '';
                    url = '/pin/detail.html?groupId=' + value;
                    break;
                }
            case 11:
                {
                    prefix = '';
                    url = '/group/detail.html?groupId=' + value;
                    break;
                }
            case 12:
                {
                    prefix = '';
                    url = '/secondkill/detail.html?groupId=' + value;
                    break;
                }
            default:
                {
                    prefix = '';
                    url = '';
                    break;
                }
        }

        if (url.indexOf('http://') != 0) {
            // 不以http开头则追加上当前页面的域名
            url = config.SHARE_HOST + url;
        }

        if (Tools.isRbyAppBrowser()) {
            prefix = prefix ? (prefix + ':') : '';

            url = prefix + url;
            if (config.REPLACE_HOST && config.REPLACE_HOST.length == 2) {
                //从app过来的替换域名
                return url.replace(config.REPLACE_HOST[0], config.REPLACE_HOST[1]);
            } else {
                return url;
            }
        } else {
            return url;
        }

    });


    // 模版帮助方法，获取最小值
    template.helper('$min', function(a, b) {
        return Math.min(a, b);
    });


})(window.template);
