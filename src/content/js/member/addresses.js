(function() {
    var targetId = Tools._GET().targetId, //目标编号
        type = Tools._GET().type, //类型
        from = Tools._GET().from,
        container = $('#tj-list');

    //获取地址列表
    function getList() {
        Ajax.custom({
            url: '/members/addresses',
            showLoading: true,
            showEmpty: true
        }, function(response) {
            var data = response;

            Ajax.render('#tj-list', 'tj-list-tmpl', data);

            processData();
        }, function(textStatus, data) {
            container.html('<div class="list-empty-data icon-address-empty">' + ((data && data.message) || '服务器异常。' + textStatus) + '</div>')
        });
    }

    common.checkLoginStatus(function() { //入口
        getList();
    });

    //处理其他逻辑
    function processData() {}

    //选择地址
    container.on('click', '.address-content', function(e) {
        e.preventDefault();
        e.stopPropagation();

        var that = $(this),
            url = $(this).attr('href'),
            addressId = $(this).attr('data-id');

        if (from) {
            var url = decodeURIComponent(from);
            url = Tools.changeURLArg(url, 'addressId', addressId);
            location.href = url;
        } else {
            location.href = url;
        }
    })

    //编辑地址
    container.on('click', '.edit-address', function(e) {
        e.preventDefault();
        e.stopPropagation();

        var that = $(this),
            url = $(this).attr('href'),
            addressId = $(this).attr('data-id');
        if (from) {
            location.href = url + '&from=' + from;
        } else {
            location.href = url;
        }
    })

    //设置默认地址
    container.on('click', '.operate-fl', function(e) {
        e.preventDefault();
        e.stopPropagation();

        var that = $(this),
            par = that.parents('.address-item'),
            addressId = that.attr('data-id'),
            isDefault = that.attr('data-isdefault');
        if (isDefault == "0") {
            Ajax.custom({
                url: '/members/addresses/' + addressId + '/prior',
                data: {
                    consigneeId: addressId
                },
                type: 'POST'
            }, function(response) {
                //getList();
                that.empty();
                $('.address-item .def').remove();
                $('.operate-fl').attr('data-isdefault', '0');
                that.attr('data-isdefault', '1');
                $('.operate-fl .iconfont').removeClass('icon-check').addClass('icon-uncheck');
                $('.operate-fl .iconfont').next().text('设为默认');
                par.find('a>p').eq(0).append('<span class="def">(默认)</span>');
                that.html('<em class="iconfont icon-check"></em><span>默认地址</span>');
                Tools.showToast('默认地址设置成功');

            }, function(textStatus, data) {
                Tools.showToast('默认地址设置失败');
                return;
            })
        }
    })

    //删除收货地址
    container.on('click', '.delete-address', function(e) {
        e.preventDefault();
        e.stopPropagation();

        var par = $(this).parents('.address-item'),
            addressId = $(this).attr('data-id');

        Tools.showConfirm('你确定要删除地址吗？', function() {
            Ajax.custom({
                url: '/members/addresses/' + addressId + '/delete',
                data: {
                    consigneeId: addressId
                },
                type: 'POST'
            }, function(response) {
                par.remove();
                if ($('.address-item').length == 0) {
                    $("#tj-empty").show();
                } else {
                    $("#tj-empty").hide();
                }

            }, function(textStatus, data) {
                Tools.showToast(data.message || '服务器异常');
            })
        })
    })

    //点击添加收货地址按钮
    $('#addAddressBtn,#empty-address-btn').on('click', function() {
        var url = "address.html";
        if (targetId) {
            url = url + "?targetId=" + targetId;
        }
        if (Tools._GET().from) {
            location.href = url + "?from=" + Tools._GET().from;
            return;
        } else {
            location.href = url;
        }
    })

})()
