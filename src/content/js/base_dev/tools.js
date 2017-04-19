/**
 * 工具类，包括自定义提示框、格式化日期、格式化货币、获取查询字符串、格式化表单等
 **/
(function() {
    var that = this,
        preventDefault, panel, commitPanel, panelBg, delay, count = 0,
        toastPanel, temp;

    function prevent(e) {
        e.preventDefault();
    }

    //按指定格式格式化日期
    function format(date, pattern) {
        var that = date;
        var o = {
            "M+": that.getMonth() + 1,
            "d+": that.getDate(),
            "h+": that.getHours(),
            "m+": that.getMinutes(),
            "s+": that.getSeconds(),
            "q+": Math.floor((that.getMonth() + 3) / 3),
            "S": that.getMilliseconds()
        };
        if (/(y+)/.test(pattern)) {
            pattern = pattern.replace(RegExp.$1, (that.getFullYear() + "")
                .substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(pattern)) {
                pattern = pattern.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return pattern;
    };

    var Tools = {
        //绝对化图片地址
        absImg: function(content, defaultValue) {
            if (!content) {
                //图片为空时且约定传递@开头，则返回默认图
                if (defaultValue && defaultValue.indexOf('@') == 0) {
                    return config.DEF_IMG_URL;
                }
                switch (defaultValue) {
                    case 1:
                        return config.WHITE_IMG_URL;
                        break;
                    default:
                        return defaultValue || config.DEF_IMG_URL;
                        break;
                }
            }

            if (typeof(content) == 'object' && content.length > 0) {
                //如果是数组则获取第一条
                content = content[0]
            }

            //测试时临时开启的替换
            if (content.indexOf('http://') == 0) {
                content = content.replace('http://img03.rbyair.com', config.OSS_HOST);
            }

            if (content.indexOf(config.OSS_HOST) == 0) {
                //oss过来的图片
                if (defaultValue && defaultValue.indexOf('@') == 0) {
                    //约定传递@开头的字符串拼接到阿里云图片的后面
                    content = content + defaultValue;
                }

                if (Webp.getSupport()) {
                    // 当前客户端支持或者在iosapp的251版本之后默认都开启webp，
                    content += (content.indexOf('@') != -1 ? '' : '@') + '.webp';
                }
                return content;
            } else if (content.indexOf('http://') == 0) {
                return content;
            }

            return config.HOST_IMAGE + content;
        },
        //时间戳格式化
        formatDate: function(content, type, defaultValue) {
            if (content == 0) {
                return '--';
            }
            var pattern = type || "yyyy-MM-dd hh:mm";
            if (isNaN(content) || content == null) {
                return defaultValue || content;
            } else if (typeof(content) == 'object') {
                var y = dd.getFullYear(),
                    m = dd.getMonth() + 1,
                    d = dd.getDate();
                if (m < 10) {
                    m = '0' + m;
                }
                var yearMonthDay = y + "-" + m + "-" + d;
                var parts = yearMonthDay.match(/(\d+)/g);
                var date = new Date(parts[0], parts[1] - 1, parts[2]);
                return format(date, pattern);
            } else {
                if (typeof content == 'string') {
                    content = content * 1;
                }
                if (content < 9999999999) {
                    content = content * 1000;
                }
                var date = new Date(parseInt(content));
                return format(date, pattern);
            }
        },
        // 货币格式化，2050.5=>2,050.5
        formatCurrency: function(content, defaultValue, unit) {
            if (!content) {
                return defaultValue || '--';
            }

            content = content + ''; //转字符串

            var prefix, subfix, idx = content.indexOf('.');
            if (idx > 0) {
                prefix = content.substring(0, idx);
                subfix = content.substring(idx, content.length);
            } else {
                prefix = content;
                subfix = '';
            }

            var mod = prefix.toString().length % 3;
            var sup = '';
            if (mod == 1) {
                sup = '00';
            } else if (mod == 2) {
                sup = '0';
            }

            prefix = sup + prefix;
            prefix = prefix.replace(/(\d{3})/g, '$1,');
            prefix = prefix.substring(0, prefix.length - 1);
            if (sup.length > 0) {
                prefix = prefix.replace(sup, '');
            }
            if (subfix) {
                if (subfix.length == 2) {
                    subfix += '0';
                } else if (subfix.length == 1) {
                    subfix += '00';
                }
                subfix = subfix.substring(0, 3);
            }
            return prefix + subfix;
        },
        strToDate: function(str) { //字符串转日期，yyyy-MM-dd hh:mm:ss
            var tempStrs = str.split(" ");
            var dateStrs = tempStrs[0].split("-");
            var year = parseInt(dateStrs[0], 10);
            var month = parseInt(dateStrs[1], 10) - 1;
            var day = parseInt(dateStrs[2], 10);

            var timeStrs = tempStrs[1].split(":");
            var hour = parseInt(timeStrs[0], 10);
            var minute = parseInt(timeStrs[1], 10) - 1;
            var second = parseInt(timeStrs[2], 10);
            var date = new Date(year, month, day, hour, minute, second);
            return date;
        },
        getRunTime: function(systemTime, endTime, isPre, showStyle, isNewVersion) {
            if (!systemTime || isNaN(systemTime) || !endTime || isNaN(endTime)) {
                return '数据错误';
            }

            var showTime = parseInt(endTime) - parseInt(systemTime);

            var aft = '',
                bef = '';
            switch (isPre) {
                case 1:
                    {
                        bef = '还有'
                        aft = '开始';
                        break;
                    }
                case 2:
                    {
                        bef = '剩余'
                        aft = '开奖';
                        break;
                    }
                case 3:
                    {
                        aft = '后开始';
                        break;
                    }
                case 4:
                    {
                        aft = '后抢购结束';
                        break;
                    }
                case 5:
                    {
                        aft = '后结束';
                        break;
                    }
                case 6:
                    {
                        bef = '还剩'
                        aft = '活动开始';
                        break;
                    }
                case 7:
                    {
                        bef = '还剩'
                        aft = '活动结束';
                        break;
                    }
                case 8:
                    {
                        bef = '仅剩'
                        aft = '';
                        break;
                    }
                default:
                    {
                        bef = '剩余'
                        aft = '结束';
                        break;
                    }
            }

            if (showTime <= 0) {
                return '已结束';
            }
            var nD = Math.floor(showTime / (60 * 60 * 24));
            var nH = Math.floor(showTime / (60 * 60)) % 24;
            var nM = Math.floor(showTime / 60) % 60;
            var nS = Math.floor(showTime) % 60;
            if (systemTime > 9999999999) {
                nD = Math.floor(showTime / (60 * 60 * 24 * 1000));
                nH = Math.floor(showTime / (60 * 60 * 1000)) % 24;
                nM = Math.floor(showTime / (60 * 1000)) % 60;
                nS = Math.floor(showTime / 1000) % 60;

            }
            if (showStyle == 0) {
                if (nD == 0) {
                    return bef + ' <span><em>' + Tools.checkTime(nH) + '</em>:<em>' + Tools.checkTime(nM) + '</em>:<em>' + Tools.checkTime(nS) + '</em> </span> ' + aft;
                } else {
                    return bef + ' <span><em>' + Tools.checkTime(nD) + '</em> 天 <em>' + Tools.checkTime(nH) + '</em>:<em>' + Tools.checkTime(nM) + '</em>:<em>' + Tools.checkTime(nS) + '</em> </span> ' + aft;
                }
            } else if (showStyle == 2) {
                return ' <span><em>' + Tools.checkTime(nD * 24 + nH) + '</em> <em>' + Tools.checkTime(nM) + '</em> <em>' + Tools.checkTime(nS) + '</em> </span>';
            } else if (showStyle == 3 && isNewVersion) {
                if (nD == 0) {
                    return bef + ' ' + Tools.checkTime(nH) + '时' + Tools.checkTime(nM) + '分' + Tools.checkTime(nS) + '秒 ' + aft;
                } else {
                    return bef + ' ' + Tools.checkTime(nD) + '天' + Tools.checkTime(nH) + '时' + Tools.checkTime(nM) + '分' + Tools.checkTime(nS) + '秒 ' + aft;
                }
            }else if (showStyle == 4) {
                return bef + ' ' + (Number(Tools.checkTime(nH))+nD*24) + ':' + Tools.checkTime(nM) + ':' + Tools.checkTime(nS) + aft;

            } else {
                if (nD == 0) {
                    return bef + ' <span><em>' + Tools.checkTime(nH) + '</em>时<em>' + Tools.checkTime(nM) + '</em>分<em>' + Tools.checkTime(nS) + '</em>秒</span> ' + aft;
                } else {
                    return bef + ' <span><em>' + Tools.checkTime(nD) + '</em>天<em>' + Tools.checkTime(nH) + '</em>时<em>' + Tools.checkTime(nM) + '</em>分<em>' + Tools.checkTime(nS) + '</em>秒</span> ' + aft;
                }
            }
        },
        checkTime: function(i) { //时分秒为个位，用0补齐
            if (i < 10) {
                i = "0" + i;
            }
            return i;
        },

        //获取URL参数
        getQueryValue: function(key) {
            var q = location.search,
                keyValuePairs = new Array();

            if (q.length > 1) {
                var idx = q.indexOf('?');
                q = q.substring(idx + 1, q.length);
            } else {
                q = null;
            }

            if (q) {
                for (var i = 0; i < q.split("&").length; i++) {
                    keyValuePairs[i] = q.split("&")[i];
                }
            }

            for (var j = 0; j < keyValuePairs.length; j++) {
                if (keyValuePairs[j].split("=")[0] == key) {
                    // 这里需要解码，url传递中文时location.href获取的是编码后的值
                    // 但FireFox下的url编码有问题
                    return decodeURI(keyValuePairs[j].split("=")[1]);

                }
            }
            return '';
        },
        // 获取窗口尺寸，包括滚动条
        getWindow: function() {
            return {
                width: window.innerWidth,
                height: window.innerHeight
            };
        },
        // 获取窗口可视区域尺寸，不包括滚动条
        getNoScrollWin: function() {
            return {
                width: $(window).width(),
                height: $(window).height()
            };
        },
        // 获取文档尺寸，不包括滚动条但是高度是文档的高度
        getDocument: function() {
            var doc = document.documentElement || document.body;
            return {
                width: doc.clientWidth,
                height: doc.clientHeight
            };
        },
        // 获取屏幕尺寸
        getScreen: function() {
            return {
                width: screen.width,
                height: screen.height
            };
        },
        // 显示、禁用滚动条
        showOrHideScrollBar: function(isShow) {
            preventDefault = preventDefault || function(e) {
                e.preventDefault();
            };
            (document.documentElement || document.body).style.overflow = isShow ? 'auto' : 'hidden';
            // 手机浏览器中滚动条禁用取消默认touchmove事件
            if (isShow) {
                // 注意这里remove的事件必须和add的是同一个
                document.removeEventListener('touchmove', preventDefault, false);
            } else {
                document.addEventListener('touchmove', preventDefault, false);
            }
        },
        // 显示对话框
        showDialog: function() {},
        // 显示着遮罩层
        showOverlay: function() {},
        // 显示确认框
        showConfirm: function(msg, yesCallback, noCallback) {
            Dialog.showConfirm(msg, yesCallback, noCallback);
        },
        // 显示提示
        showAlert: function(msg, tick, callback) {
            Dialog.showAlert(msg, tick, callback);
        },
        // 显示加载框
        showLoading: function() {
            $('#tj-loading').show();
        },
        hideLoading: function() {
            $('#tj-loading').hide();
        },
        hidePanel: function(yesClick) {
            panel && panel.hide(yesClick);
        },
        showToast: function(msg, tick) {
            toastPanel = toastPanel || $('#tj-toast');
            tick = tick || 4000;

            if (delay) {
                //多次点击清除动画以及定时器
                toastPanel.removeClass('show').hide();
                clearTimeout(delay);
            }

            //！。来识别，只要句子中间，就断行
            if (typeof msg !== 'string') {
                msg = JSON.stringify(msg);
            }
            msg = msg.replace(/！/g, '！<br/>');
            msg = msg.replace(/！<br\/>$/, '！');
            msg = msg.replace(/。/g, '。<br/>');
            msg = msg.replace(/。<br\/>$/, '。');
            toastPanel.find('span').html(msg);

            if(tick != 4000){
                //设置自定义的动画时长
                toastPanel.css('animation-duration', tick / 1000 + 's');
            }
            toastPanel.addClass('show').show();
            delay = setTimeout(function() {
                toastPanel.removeClass('show');
                toastPanel.hide();
            }, tick);
        },
        isIPad: function() {
            return (/iPad/gi).test(navigator.appVersion);
        },
        isIos: function() {
            return (/iphone|iPad/gi).test(navigator.appVersion);
        },
        isAndroid: function() {
            return (/android/gi).test(navigator.appVersion);
        },
        isWeChatBrowser: function() {
            var e = navigator.appVersion.toLowerCase();
            return "micromessenger" == e.match(/MicroMessenger/i) ? !0 : !1
        },
        getAndroidVersion: function() {
            var e = navigator.appVersion;
            var result = e.match(/Android\s([^;])./i);
            if (result) {
                return result[1];
            }
            return -1;
        },
        isRbyAppBrowser: function() {
            var e = navigator.userAgent.toLowerCase();
            return "rbyapp" == e.match(/rbyapp/i) ? !0 : !1
        },
        // 将form中的值转换为键值对
        formJson: function(form) {
            var o = {};
            var a = $(form).serializeArray();
            $.each(a, function() {
                if (o[this.name] !== undefined) {
                    if (!o[this.name].push) {
                        o[this.name] = [o[this.name]];
                    }
                    o[this.name].push(this.value || '');
                } else {
                    o[this.name] = this.value || '';
                }
            });
            return o;
        },
        alert: function(e) {
            !Cookie.get("DevDebug") ? console.log(e) : alert(e)
        },
        _GET: function() {
            var e = location.search,
                o = {};
            if ("" === e || void 0 === e) return o;
            e = e.substr(1).split("&");
            for (var n in e) {
                var t = e[n].split("=");
                o[t[0]] = decodeURI(t[1])
            }
            if (o.from) {
                delete o.code
            } //o.from得到的是什么值(类型)
            return o
        },
        removeParamFromUrl: function(e) {
            var o = Tools._GET();
            for (var n in e) delete o[e[n]];
            return location.pathname + Tools.buildUrlParamString(o)
        },
        buildUrlParamString: function(e) {
            var o = "";
            for (var n in e) o += n + "=" + e[n] + "&";
            o = o.slice(0, o.length - 1);
            var t = "" === o || void 0 === o;
            return t ? "" : "?" + o
        },
        //格式化价格，显示两位小数，当两位小数都为0是省略
        rbyFormatCurrency: function(content) {
            if (!content || isNaN(content)) return content;

            var v = parseFloat(content),
                result = v.toFixed(2);
            if (result.indexOf('.00') >= 0) {
                result = parseFloat(content).toFixed(0);
            }
            return result;
        },
        //替换URL参数
        changeURLArg: function(url, arg, arg_val) {
            var pattern = arg + "=([^&]*)",
                replaceText = arg + "=" + arg_val;
            if (url.match(pattern)) {
                var tmp = "/(" + arg + "=)([^&]*)/gi";
                return tmp = url.replace(eval(tmp), replaceText)
            }
            return url.match("[?]") ? url + "&" + replaceText : url + "?" + replaceText
        },

        //根据不同的终端取得Mid，如果非APP则随机生成32位,同时存到本地存储,优先获取本地存储的,没有则生成
        getMid: function() {
            var m;
            if (Tools.isRbyAppBrowser()) {
                m = Storage.get('rudder_deviceId');
                if (!m) {
                    m = Storage.get('mid');
                }
            } else {
                m = Storage.get('mid');
                if (!m) {
                    m = GUID.NewGuid().ToString();
                    Storage.set('mid', m);
                }
            }
            return m;
        },
        //根据不同的终端取得appid
        getAppid: function() {
            var m;
            // (Tools.isIos() && ( m = 101 )) || (Tools.isAndroid() && ( m = 102 )) || (m = 103);
            if (Tools.isRbyAppBrowser()) {
                var apppHeader = Storage.get('AppHeader');
                if (apppHeader && apppHeader.rudder_market == 'iOS') {
                    m = 101;
                } else {
                    m = 102;
                }
            } else {
                m = 103;
            }
            return m;
        },
        //是否ios内嵌的app
        isRbyIosAppBrowser: function() {
            var appHeader = Storage.get('AppHeader');
            if (!appHeader || !appHeader.rudder_appType) {
                return false;
            }
            return appHeader.rudder_appType.indexOf("iOS") != -1;
        },
        //获取app的版本号，非正确版本号返回-1，否则返回整型
        getAppVersion: function() {
            var appHeader = Storage.get('AppHeader');

            if (!appHeader || (!appHeader.rudder_appSystemVersion && !appHeader.rudder_version)) {
                return -1;
            }

            var patternVer = /(\d\.\d\.\d)/gi,
                patterndot = /\./gi,
                appVersion = appHeader.rudder_appSystemVersion || appHeader.rudder_version,
                isVersion = appVersion.match(patternVer) + '';

            if (!isVersion) {
                return -1;
            }

            return parseInt(appVersion.replace(patterndot, ''));
        },

        // 模版帮助方法，转换价格成数组
        rbySpecialCurrency: function (content) {
            content = Tools.rbyFormatCurrency(content);
            if (!content && content!=0) return ['',''];
            var arr=String(content).split(".");
            if(arr.length==1) arr[1]="";
            else arr[1]="."+arr[1];
            return arr
        }
    };

    window.Tools = Tools;
})();

(function(){
    // 数字转中文
    var Utils = {
        /* 
            单位 
        */
        units: '个十百千万@#%亿^&~',
        /* 
            字符 
        */
        chars: '零一二三四五六七八九',
        /* 
            数字转中文 
            @number {Integer} 形如123的数字 
            @return {String} 返回转换成的形如 一百二十三 的字符串              
        */
        numberToChinese: function(number) {
            var a = (number + '').split(''),
                s = [],
                t = this;
            if (a.length > 12) {
                throw new Error('too big');
            } else {
                for (var i = 0, j = a.length - 1; i <= j; i++) {
                    if (j == 1 || j == 5 || j == 9) { //两位数 处理特殊的 1*  
                        if (i == 0) {
                            if (a[i] != '1') s.push(t.chars.charAt(a[i]));
                        } else {
                            s.push(t.chars.charAt(a[i]));
                        }
                    } else {
                        s.push(t.chars.charAt(a[i]));
                    }
                    if (i != j) {
                        s.push(t.units.charAt(j - i));
                    }
                }
            }
            //return s;  
            return s.join('').replace(/零([十百千万亿@#%^&~])/g, function(m, d, b) { //优先处理 零百 零千 等  
                b = t.units.indexOf(d);
                if (b != -1) {
                    if (d == '亿') return d;
                    if (d == '万') return d;
                    if (a[j - b] == '0') return '零'
                }
                return '';
            }).replace(/零+/g, '零').replace(/零([万亿])/g, function(m, b) { // 零百 零千处理后 可能出现 零零相连的 再处理结尾为零的  
                return b;
            }).replace(/亿[万千百]/g, '亿').replace(/[零]$/, '').replace(/[@#%^&~]/g, function(m) {
                return { '@': '十', '#': '百', '%': '千', '^': '十', '&': '百', '~': '千' }[m];
            }).replace(/([亿万])([一-九])/g, function(m, d, b, c) {
                c = t.units.indexOf(d);
                if (c != -1) {
                    if (a[j - c] == '0') return d + '零' + b
                }
                return m;
            });
        }
    };
    window.Utils = Utils;
})()