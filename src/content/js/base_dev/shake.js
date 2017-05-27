(function() {
    function shake() {}

    var endLock = true,
        startLock = false,
        shakeInfo = null,
        shakeTimer = 0,
        noshakeNum = 0,
        option = { ios: 5, android: 3, duration: 700, onShaking: function() {}, onEnd: function() {} },
        os = detect(),
        env = os.ios ? "ios" : "android";
    shake.start = function(opt) {
        if (typeof opt == 'function') {
            option.onEnd = opt;
            option.onShaking = function() {};
        } else if (typeof opt != "undefined") {
            for (var i in opt) { option[i] = opt[i]; }
        }
        endLock = false, startLock = false, noshakeNum = 0;
        shakeInfo = { times: 0, datas: [], history: [] };
        window.addEventListener('devicemotion', motionDetect, false);
    }
    shake.destroy = function() {
        endLock = true;
        unbind();
        shakeInfo = null;
    }

    function motionDetect(event) {
        var nowData = { x: event.accelerationIncludingGravity.x, y: event.accelerationIncludingGravity.y, z: event.accelerationIncludingGravity.z, a: event.rotationRate ? event.rotationRate.alpha : 0, b: event.rotationRate ? event.rotationRate.beta : 0, g: event.rotationRate ? event.rotationRate.gamma : 0 },
            oldData = shakeInfo.datas[shakeInfo.datas.length - 1] || nowData;
        shakeInfo.datas.push(nowData);
        shakeInfo.datas = shakeInfo.datas.slice(-10);
        if (isShake(oldData, nowData)) {
            shakeInfo.times++;
            noshakeNum = 0;
            startEndTimer();
        } else if (!startLock) {
            noshakeNum++;
            if (noshakeNum > 3) {
                noshakeNum = 0, shakeInfo.times = 0;
                clearTimeout(shakeTimer);
            }
        }
    }

    function startEndTimer() {
        clearTimeout(shakeTimer);
        if (endLock) return true;
        if (!startLock && shakeInfo.times >= 3) {
            startLock = true;
            option.onShaking();
        }
        if (startLock) {
            shakeTimer = setTimeout(function() {
                if (endLock) {
                    return false;
                }
                endLock = true;
                unbind();
                option.onEnd();
            }, option.duration);
        }
    }

    function isShake(oldData, nowData) {
        var result = { x: Math.abs(nowData.x - oldData.x), y: Math.abs(nowData.y - oldData.y), z: Math.abs(nowData.z - oldData.z), a: Math.abs(nowData.a - oldData.a), b: Math.abs(nowData.b - oldData.b), g: Math.abs(nowData.g - oldData.g) },
            minus = { x: 0, y: 0, z: 0 },
            positive = { x: 0, y: 0, z: 0 };
        shakeInfo.history.push({ x: nowData.x - oldData.x, y: nowData.y - oldData.y, z: nowData.z - oldData.z });
        shakeInfo.history = shakeInfo.history.slice(-10);
        if (shakeInfo.history.length < 10) {
            return false;
        }
        if (startLock && (result.x + result.y + result.z) > 2) {
            return true;
        }
        shakeInfo.history.forEach(function(ceil) {
            ceil.x < -1 && minus.x++;
            ceil.y < -1 && minus.y++;
            ceil.z < -1 && minus.z++;
            ceil.x > 1 && positive.x++;
            ceil.y > 1 && positive.y++;
            ceil.z > 1 && positive.z++;
        });
        var xBool = (minus.x > 1 && positive.x > 1) || minus.x > 3 || positive.x > 7,
            yBool = (minus.y > 1 && positive.y > 1) || minus.y > 3 || positive.y > 7,
            zBool = (minus.z > 1 && positive.z > 1) || minus.z > 3 || positive.z > 7;
        if (minus.z > 5 || positive.z > 5) {
            return false;
        }
        if (!((xBool && yBool) || (yBool && zBool) || (xBool || zBool))) {
            return false;
        }
        if ((result.z > 2 && result.y < 5) || (result.g < 2 && (result.a + result.b) > 1.5)) {
            return false;
        }
        if ((result.x + result.y) > option[env] || (result.y + result.z) > option[env] || (result.x + result.z) > option[env]) {
            return true;
        }
        return false;
    }

    function unbind() {
        window.removeEventListener('devicemotion', motionDetect);
        clearTimeout(shakeTimer);
    }

    function detect() {
        var os = {},
            ua = navigator.userAgent,
            android = ua.match(/(Android);?[\s\/]+([\d.]+)?/),
            ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
            ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/),
            iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);
        if (android) os.android = true, os.version = android[2]
        if (iphone && !ipod) os.ios = os.iphone = true, os.version = iphone[2].replace(/_/g, '.')
        if (ipad) os.ios = os.ipad = true, os.version = ipad[2].replace(/_/g, '.')
        if (ipod) os.ios = os.ipod = true, os.version = ipod[3] ? ipod[3].replace(/_/g, '.') : null
        return os;
    }

    window.jdShake = shake;
})();