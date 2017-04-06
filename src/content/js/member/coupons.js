(function() {
    var status = Tools._GET().status || 0, //优惠券状态，0未使用、1已试用、2已过期，默认0
        container = $('.coupon'),
        rbyListDom = $('#tj-list'),
        tempData = undefined;

    initTabWithStatus();

    //获取优惠券列表
    function getList() {
        Ajax.paging({
            url: config.HOST_API_APP + '/member/coupon/getList',
            data: {
                status: status || 0,
                page: config.page,
                pageSize: config.PAGE_SIZE
            },
            showLoading: true,
            showEmpty: true
        }, function(response) {
            tempData = response.body;
            initTabWithStatus();
            container.show();
            
            if (tempData && tempData.length == 0) {
                var ckoutEmptyTitle = '您还没有任何优惠券';
                if (status == 0) {
                    ckoutEmptyTitle = '您还没有未使用的优惠券';
                } else if (status == 1) {
                    ckoutEmptyTitle = '您还没有已使用的优惠券';
                } else if (status == 2) {
                    ckoutEmptyTitle = '您还没有已过期的优惠券';
                }
                $('.ckout-title').text(ckoutEmptyTitle);
            }
        }, function(textStatus, data) {
            rbyListDom.html('<div class="list-empty-data icon-coupon-empty">' + ((data && data.message) || '服务器异常。' + textStatus) + '</div>')
        });
    }

    common.getList = getList;

    common.checkLoginStatus(function() { //入口
        getList();
    });

    //切换tab
    $('.tab-link').click(function(e) {
        e.preventDefault();
        status = $(this).attr('data-v');
        $('.tab-link').removeClass('active');
        $(this).addClass('active');
        config.page = 1;
        getList();
        if ('pushState' in history) {
            history.replaceState({
                status: status
            }, null, "?status=" + status);
        }
    });

    window.addEventListener("popstate", function() {
        var currentState = history.state;
        if (currentState && currentState.status) {
            status = currentState.status;
            config.page = 1;
            getList();
        }
    });

    //根据优惠券状态初始化tab状态
    function initTabWithStatus() {
        $('.tab-link').each(function() {
            if ($(this).attr('data-v') == status) {
                $(this).addClass('active');
                var objs = rbyListDom.find('ul>li');
                objs.each(function() {
                    var currentObj = objs.find('a');
                    var currentObjDate = objs.find('.expiry-date');
                    if (status == '0') {
                        if (currentObj.hasClass('used')) {
                            currentObj.removeClass('used');
                        } else if (currentObj.hasClass('expire')) {
                            currentObj.removeClass('expire');
                        }
                        currentObjDate.removeClass('used');
                        currentObjDate.removeClass('expire');
                    } else if (status == '1') {
                        if (currentObj.hasClass('expire')) {
                            currentObj.removeClass('expire');
                        }
                        currentObjDate.removeClass('expire');
                        currentObj.addClass('used');
                        currentObjDate.addClass('used');
                    } else if (status == '2') {
                        if (currentObj.hasClass('used')) {
                            currentObj.removeClass('used');
                        }
                        currentObjDate.removeClass('used');
                        currentObj.addClass('expire');
                        currentObjDate.addClass('expire');
                    }
                })
            } else {
                $(this).removeClass('active');
            }
        })
    }

})()
