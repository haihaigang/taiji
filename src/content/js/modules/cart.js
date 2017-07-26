(function() {
    var container = $('.container'),
        ONE_GROUP_NUM = 5; //商品5盒一组

    // 获取购物车数量
    function getCart() {
        Ajax.custom({
            url: '/carts/items'
        }, function(response) {
            var data = response;
            initCart(data);
        })
    }

    //点击更改数量按钮
    container.on('click', '.goods-qty .btn', function(e) {
        e.preventDefault();
        e.stopPropagation();

        var par = $(this).parent(),
            that = $(this),
            numDom = par.find('.num-ipt'),
            num = parseInt(numDom.text()),
            objIdent = par.attr('data-objident'),
            type = par.attr('data-type'),
            limitNum = par.attr('data-limit'),
            up = "up",
            down = "down";

        curItem = par;
        btnDom = that;

        if ($(this).hasClass('plus') && limitNum <= num) {
            Tools.showToast('该商品已达到限购数量');
            return;
        }
        if ($(this).hasClass('disabled')) {
            return;
        }
        $(this).addClass('disabled');

        if ($(this).hasClass('plus')) {
            num++;
            quickChangeCart(objIdent, num, type);
        } else if ($(this).hasClass('minus')) {
            if (num == 1) {
                num--;
                Tools.showConfirm({
                    message: '您确定将该商品移出购物车吗？',
                    cancelText: '点错了',
                    yesCallback: function() {
                        removeCart(objIdent);
                    },
                    noCallback: resetBtn
                });
            } else {
                num--;
                quickChangeCart(objIdent, num, type);
            }
        }

        //这里返回false取消冒泡事件
        return false;
    });

    //点击结算，如果没绑定跳绑定页,否则直接进入结算页
    container.on('click', '.cart-total-button', function() {

        var goodIds = [], // 商品id
            goodsCounts = [], // 商品数量
            goodsPrices = [], // 商品价格
            totalPrice = undefined, // 商品总价
            hasChecked = true; //购物车中是否有选中的商品

        if (!hasChecked) {
            Tools.showToast('请选择一个商品');
            return;
        }

        location.href = 'commit.html';
    });

    // 点击升级按钮，更改购物车数量
    container.on('click', '.cart-buttons .btn', function() {
        var objIdent = $(this).data('objident'),
            num = 0;

        if ($(this).hasClass('btn-huiyuan')) {
            num = 6;
        } else if ($(this).hasClass('btn-daili')) {
            num = 48;
        } else if ($(this).hasClass('btn-zongdai')) {
            num = 848 / ONE_GROUP_NUM;
        } else {
            return;
        }

        quickChangeCart(objIdent, num, 'REGULAR');
    });

    /**
     * 修改购物车数量
     * @param objIdent 购物车中商品的唯一标识符
     * @param num 变更后的数量
     * @param type 商品的类型，REGULAR、普通商品, COUPON、优惠券商品
     */
    function quickChangeCart(objIdent, num, type) {

        if (type == 'REGULAR') {
            num *= ONE_GROUP_NUM; //普通商品按盒一起购买，优惠券1盒购买
        }

        Ajax.custom({
            url: '/carts/items',
            data: {
                productId: objIdent,
                quantity: num
            },
            type: 'POST',
            contentType: 'application/json'
        }, function(response) {
            tempData = response;
            initCart(response);
        }, function(textStatus, data) {
            Tools.showToast(data.message || '服务器异常');
            resetBtn();
        })
    }

    /**
     * 删除购物车条目
     * @param objIdent 购物车中商品的唯一标识符
     */
    function removeCart(objIdent) {
        Ajax.custom({
            url: '/carts/items/remove',
            data: {
                productId: objIdent
            },
            type: 'POST',
            contentType: 'application/json'
        }, function(response) {
            var data = response;

            initCart(data);
            tempData = data;

            if (data.items.length == 0) {
                //当购车数据为0时
                $('#rby-empty').show();
                showContent(false);
            }
        }, function(textStatus, data) {
            Tools.showToast(data.message || '服务器异常');
            resetBtn();
        })
    }

    function initCart(data) {
        if (data.items && data.items.length == 0) {
            $('#tj-empty').show();
            return;
        }


        for (var i = 0; i < data.items.length; i++) {
            var d = data.items[i];
            if (d.type == 'REGULAR') {
                d.realQuantity = d.quantity;
                // 因为普通商品按盒购买，购物车数量显示为盒数
                d.quantity /= ONE_GROUP_NUM;
                if(d.realQuantity == 848){
                    d.quantity = 0;
                }
                d.isRegular = true;
                d.ONE_GROUP_NUM = ONE_GROUP_NUM;
            }
        }

        Ajax.render('#tj-list', 'tj-list-tmpl', data.items);
        Ajax.render('#tj-cart-total', 'tj-cart-total-tmpl', data);
    }

    /**
     * 重置按钮，btnDom为点击更改数量时的dom
     */
    function resetBtn() {
        btnDom.removeClass('disabled');
    }

    /**
     * 是否已禁用按钮
     */
    function isDisabledBtn(that) {
        return that.hasClass('disabled');
    }

    /**
     * 是否显示购物车内容
     * @param show 是否显示
     */
    function showContent(show) {
        if (show) {
            $('#tj-cart-coupon').show();
            $('#tj-list').show();
            $('#tj-cart-total').show();
        } else {
            $('#tj-cart-coupon').hide();
            $('#tj-list').hide();
            $('#tj-cart-total').hide();
        }
    }

    Common.checkLoginStatus(function() { //入口
        getCart()
            //添加默认分享功能
        WechatCommon.Share.commonShare();
    });
})()
