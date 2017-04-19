/**
 * 过滤http拦截，这里需要尽可能在自定义的代码之前
 */
(function() {
    if (!config.IS_FILTER_ON || !('MutationObserver' in window)) {
        return;
    }

    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            var nodes = mutation.addedNodes;
            for (var i = 0; i < nodes.length; i++) {
                if (nodes[i].nodeName == 'SCRIPT' && !_isWhite(nodes[i].src)) {
                    nodes[i].src = '';
                }
            }
        });
    });

    observer.observe(document, { //初始化行为
        childList: true,
        subtree: true
    });

    function _isWhite(url) {
        if (!config.WHITELISTS) {
            return true;
        }
        //添加当前域名
        config.WHITELISTS.push(location.hostname);

        if (!url) {
            return true;
        }

        if (url.indexOf('//') != 0 && url.indexOf('http://') != 0 && url.indexOf('https://') != 0) {
            return true;
        }
        var obj = url.replace('https://', '').replace('http://', '').replace('//', '');
        var obj = obj.split('/');

        var flag = false;
        for (var i in config.WHITELISTS) {
            if (obj[0].indexOf(config.WHITELISTS[i]) != -1) {
                flag = true;
                break;
            }
        }
        console.log(url + ' is white? ' + flag);

        return flag;
    }
})();
