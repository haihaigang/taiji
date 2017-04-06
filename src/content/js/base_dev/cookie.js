/**
 * 本地cookie读写
 */
(function() {
    var Cookie = {
        get: function(sname) {
            var sre = "(?:;)?" + sname + "=([^;]*);?";
            var ore = new RegExp(sre);
            if (ore.test(document.cookie)) {
                try {
                    return unescape(RegExp["$1"]); // decodeURIComponent(RegExp["$1"]);
                } catch (e) {
                    return null;
                }
            } else {
                return null;
            }
        },

        /**
         * 设置Cookie
         * @param {[String]}
         * @param {[String]} 
         * @param {[Number]} 天数
         * @param {[Number]} 小时数
         * @param {[Number]} 分钟数
         * @param {[Number]} 秒数
         */
        _set: function(c_name, value, days, hours, minutes, seconds ) {
            var expires = null;
            var domain =  location.host.indexOf("meigooo.com")>=0 ? "domain= meigooo.com":"";
            if (typeof days == 'number' && typeof hours == 'number' && typeof minutes == 'number' && typeof seconds == 'number') {
                if (days == 0 && hours == 0 && minutes == 0 && seconds == 0) {
                    expires = null;
                } else {
                    expires = this.getExpDate(days, hours, minutes, seconds);
                }
            } else {
                expires = days || this.getExpDate(7, 0, 0, 0);
            }

            document.cookie = c_name + "=" + escape(value) + ((expires == null) ? "" : ";expires=" + expires) + "; path=/ ;"+domain;
        },

        /**
         * 设置Cookie
         * @param {[type]} name
         * @param {[type]} value
         * @param {[type]} 天数，默认7天、0不设置、-1移除
         * @param {[type]} 小時，默認0
         */
        set: function(c_name, value, days, hours ,minites) {
            if(!hours) hours = 0;
            if(!minites) minites = 0;
            this._set(c_name, value, days, hours, minites, 0 );
        },

        remove: function(key) {
            this.set(key, '', -1);
        },

        delTest:function(key) {//删除已提交的测试环境下的重复cookie值，只保留线上主域名cookie值
            var exp = new Date(); 
            exp.setTime(exp.getTime() - 1); 
            var domain = "domain= rbyair.com";
            document.cookie = key + "=;expires=" + exp.toGMTString() + "; path=/ ; "+domain;  
        },

        del:function(key) {//删除不同域名下的重复cookie，只保留线上主域名cookie值
            var exp = new Date(); 
            exp.setTime(exp.getTime() - 1); 
            document.cookie = key + "=;expires=" + exp.toGMTString() + "; path=/ ; ";  
        },
        //获取过期时间，d天数、h小时、m分钟、s秒
        getExpDate: function(d, h, m, s) {
            var r = new Date;
            if (typeof d == "number" && typeof h == "number" && typeof m == "number" && typeof s == 'number')
                return r.setDate(r.getDate() + parseInt(d)), r.setHours(r
                        .getHours() + parseInt(h)), r.setMinutes(r.getMinutes() + parseInt(m)), r.setSeconds(r.getSeconds() + parseInt(s)),
                    r.toGMTString()
        }
    };
    window.Cookie = Cookie;
})()
