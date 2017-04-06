(function() {
    var $commonSearch = $(".common-search"),
        $wrapper = $commonSearch.find(".common-search-wrapper"),
        $commonSearchBlockTag = $(".common-search-block-tag"),
        $commonSearchBlockHistory = $(".common-search-block-history"),
        $commonSearchInput = $(".common-search input"),
        $commonSearchInputClear = $(".common-search a.clear"),
        $body = $("body"),
        isFromApp=Tools._GET().isFromApp,//是否来自App;
        windowWidth = $body.width() , //屏宽
        windowHeight = $(window).height(),
        userSN = Cookie.get("UserSN"),
        storageName = undefined,
        animation = true, //进入动画
        historyList = [],
        mainPage = null,
        isReady = false,
        keyword='纸尿裤',
        tagsData = null;
    var commonSearch = {};
    //默认热搜 temp
    $(".widget-app-search a span").text(keyword);
    $commonSearchInput.attr("placeholder",keyword).attr("autocomplete","off");
    //获取所有标签
    function getTags() {
        if (tagsData != null) return;

        Ajax.custom({
            url: config.JAVA_HOST_URL + '/widgets/' + 723,
            showLoading: false
        }, function(response) {
            tagsData = response.body.contents
            if (tagsData.length == 0) {
                return;
            }
            var html = "";
            $.each(tagsData, function(k, v) {
                html += '<a href="#">' + v.contentName + '</a>';
            });
            $commonSearchBlockTag.find("p").html(html);
            $commonSearchBlockTag.show();
        })
    }
    //获取用户历史并展示
    function getHistory() {
        setUserParam();
        getStorageHistory();
        if (historyList.length == 0) {
            return;
        }
        var html = "";
        var tempArr = historyList;
        $.each(tempArr.reverse(), function(k, v) {
            html += '<li><a href="#" class="common-search-txt">' + v + '</a><a class="common-search-delete" href="#"><i class="iconfont icon-iconfontguanbi1"></i></a></li>';
        });
        $commonSearchBlockHistory.find("ul").html(html);
        $commonSearchBlockHistory.show();
    }
    //获取用户数据 用于获取历史
    function setUserParam() {
        var id = userSN ? userSN : "Customer";
        storageName = "SearchHistory" + id
    }
    //获取历史记录
    function getStorageHistory() {
        var value = Storage.get(storageName);
        if (!value) return;
        historyList = value.split(",");
    }
    //保存历史
    function saveStorageHistory(txt) {
        var value = Storage.get(storageName);
        var tempArr = []
        if (value) tempArr = value.split(",");
        //大于10条删除
        if (tempArr.length >= 10) {
            tempArr.splice(0, tempArr.length - 9)
        }
        //有相同的 去重
        $.each(tempArr, function(k, v) {
            if (txt == v) {
                tempArr.splice(k, 1)
            }
        })
        tempArr.push(txt);
        value = tempArr.join(",");
        historyList = tempArr;
        Storage.set(storageName, value);
    }
    //删除历史
    function deleteStorageHistory(txt) {
        var value = Storage.get(storageName);
        var tempArr = [];
        if (value) tempArr = value.split(",");
        $.each(tempArr, function(k, v) {
            if (txt == v) {
                tempArr.splice(k, 1)
            }
        });
        historyList = tempArr;
        value = tempArr.join(",");
        Storage.set(storageName, value);
    }
    //删除所有历史
    function deleteAllStorageHistory() {
        Storage.set(storageName, "");
        historyList = [];
    }
    //提交   noHistory 0 or undefined  ;存入历史; 1 : 不存历史
    //isFromHot 是否点击热词
    function searchSubmit(noHistory, isFromHot) {
        var value = $.trim($commonSearchInput.val()),
            url = "/search/search.html",
            id = '',
            pathname = location.pathname;
        if (value == "") value=keyword;
        //是否存入历史
        if (!noHistory) {
            saveStorageHistory(value);
        }

        //热搜
        var ishot="";
        if(isFromHot ){
            ishot= '&hot=1'
        }else{
            ishot= '&hot=0'
        }
        switch (pathname) {
            case '/index.html':
                {
                    id = '0609';
                    break;
                }
            case '/group/activity.html':
                {
                    id = '0112';
                    break;
                }
            case '/category/goods.html':
                {
                    id = '0315';
                    break;
                }
        }
        MeiStat.to(id, { keyword: value });
        location.href = url + '?keyword=' + (value) +ishot;
    }
    //初始构建
    function _construct() {
        $wrapper.css({
            width: windowWidth,
            height: windowHeight,
            "margin-left":'-'+windowWidth/2+"px",

        });
        if (animation) {
            $commonSearch.css({
                width: windowWidth,
                height: windowHeight
            });
            mainPage.css({
                width:windowWidth,
                position:'absolute',
                top:'0',
                bottom:'0',
                left:'50%',
                "margin-left":'-'+windowWidth/2+"px",
                "overflow-y": "scroll",
                "-webkit-overflow-scrolling": "touch",
                'padding-bottom':0
            });
        } else {
            $commonSearch.addClass("active")
        }
    }
    //启动
    function _init() {
        getTags();
        getHistory();
        isReady = true;
    }
    //关闭搜索面板
    function closeCommonSearch() {
        if (!animation) {
            $commonSearch.hide();
            mainPage.show();
        } else {
            $commonSearch.removeClass("active");
            setTimeout(function() {
                $commonSearch.hide()
            }, 300)
        }
    };
    //打开搜索面板 (暴露)  txt: 需要在输入框中展现的默认字符
    commonSearch.openCommonSearch = function(txt) {
        if (!mainPage) return
        if (!isReady) _init();

        if (!animation) {
            mainPage.hide();
            $commonSearch.show();
        } else {
            $commonSearch.show()
            setTimeout(function() {
                $commonSearch.addClass("active");
            }, 100)
        }
        if (txt && $.trim(txt) != "") {
            $commonSearchInput.val(txt)
            $commonSearchInputClear.show()
        }

        $commonSearchInput.trigger("focus")
    };
    //设置互动面板(暴露) obj :  关联对象
    // bool : 是否开启进入动画 默认开启
    commonSearch.setCommonSearch = function(obj, bool) {
        mainPage = obj;
        if (bool) {
            animation = true;
        } else if (typeof(bool) == "boolean") {
            animation = false;
        } else {
            animation = true;
        }
        _construct();
    }


    //事件
    //搜索
    $commonSearch.find(".common-search-submit").click(function(e) {
        e.preventDefault();
        searchSubmit();
    });
    //搜索历史
    $commonSearch.find(".common-search-back").click(function(e) {
        e.preventDefault();
        closeCommonSearch()
    });
    //搜索清空
    $commonSearch.find(".common-search-clear").click(function(e) {
        e.preventDefault();
        deleteAllStorageHistory();
        $commonSearchBlockHistory.find("ul").html("");
        $commonSearchBlockHistory.hide();
    });
    //删除某个历史
    $commonSearch.on("click", ".common-search-delete", function(e) {
        e.preventDefault();
        var parent = $(this).parents("li");
        var value = $.trim(parent.find(".common-search-txt").text());
        deleteStorageHistory(value);
        parent.remove();
        if ($commonSearchBlockHistory.find("li").length == 0) {
            $commonSearchBlockHistory.hide()
        }
    });
    //快捷搜索
    $commonSearch.on("click", ".common-search-block p a", function(e) {
        e.preventDefault();
        var value = $.trim($(this).text());
        $commonSearchInput.val(value);
        searchSubmit(false, true);
    });
    //快捷历史搜索
    $commonSearch.on("click", ".common-search-block ul a.common-search-txt", function(e) {
        e.preventDefault();
        var value = $.trim($(this).text());
        $commonSearchInput.val(value);
        searchSubmit(true);
    });
    //搜索输入框删除显示
    $commonSearchInput.keyup(function(e) {
        var value = $commonSearchInput.val();
        if (value != "") {
            $commonSearchInputClear.show()
        } else {
            $commonSearchInputClear.hide()
        }
    });
    //搜索输入框删除
    $commonSearchInputClear.click(function(e) {
        $commonSearchInput.val("");
        $commonSearchInputClear.hide()
        $commonSearchInput.trigger("focus")
    });

    $body.on("click", ".widget-app-search a", function(e) {
        e.preventDefault();
        commonSearch.openCommonSearch()
    })
    window.commonSearch = commonSearch;
    $(function(){
        if(isFromApp=="1"){
            commonSearch.openCommonSearch()
        }
    })

})();