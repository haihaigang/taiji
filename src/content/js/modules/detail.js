(function() {
    var container = $('.container'),
        DETAIL_RATIO = 1, //轮播图的尺寸比例
        id = Tools._GET().id, //商品ID
        cid = Tools._GET().cid, //优惠券ID
        hasUsed = false; //优惠券是否已被使用

    // 点击按钮，添加购物车
    $('.btn-addcart').click(function(e) {
        e.preventDefault();

        if ($(this).hasClass('disabled')) {
            if (hasUsed) {
                showUsedTip();
            }
            return;
        }
        addCart($(this));
    });

    // 点击确定提交绑定数据
    $('#tj-bind-dialog .btn-primary').click(function(e) {
        e.preventDefault();

        bindUser();
    });

    // 获取详情数据
    function getDetail() {
        if (cid) {
            url = '/products/coupon'
        } else {
            url = '/products/' + id;
        }

        if (!cid && !id) {
            showEmpty();
            return;
        }

        Ajax.detail({
            url: url,
            data: {
                id: id,
                couponId: cid
            }
        }, function(response) {
            var data = response,
                sharePic = '';

            id = data.id;

            Ajax.render('#tj-detail', 'tj-detail-tmpl', data);

            //固定图片的高度
            $('.detail-product-img img').css('height', parseInt($('body').width() / DETAIL_RATIO));

            // 初始化轮播图
            if (data.images && data.images.length > 1) {
                var swiper = new Swiper('.swiper-container', {
                    pagination: '.swiper-pagination',
                    paginationClickable: true,
                    loop: true,
                    autoplay: 3000,
                    autoplayDisableOnInteraction: false
                });
            }

            if (data.images && data.images.length > 0) {
                // 分享图默认使用第一张图片
                sharePic = data.images[0];
            }

            $('.btn-addcart').removeClass('disabled');

            if (data.used) {
                // 如果优惠券已经使用，显示提示信息
                $('.btn-addcart').addClass('disabled');
                showUsedTip();
                hasUsed = true;
            }

            // 初始化分享数据
            WechatCommon.Share.commonShare({
                shareTitle: Config.DEFAULT_SHARE_DATA.SHARE_TITLE,
                shareDesc: Config.DEFAULT_SHARE_DATA.SHARE_TEXT,
                sharePic: sharePic,
                shareLink: Common.getShareLink({
                    type: 'detail',
                    id: id,
                    couponId: cid
                })
            });

            container.show();
            $('.bottom-btns').show();
        }, function(textStatus, data){
            showEmpty();
        });
    }

    // 调用接口添加购物车
    function addCart(btnDom) {
        if (btnDom && btnDom.hasClass('disbled')) {
            return;
        }

        var qty = 1;
        if (!cid && id) {
            //普通商品默认要30盒一起购买，优惠券1盒购买
            qty = 30;
        }

        Ajax.custom({
            url: '/carts/items',
            data: {
                productId: id,
                couponId: cid || '',
                quantity: qty
            },
            type: 'POST',
            contentType: 'application/json'
        }, function(response) {
            location.href = 'cart.html';
        }, function(textStatus, data) {
            if (data.exception.indexOf('NotSignupPhoneException') != -1) {
                // 用户未绑定手机号，提示
                $('#tj-bind-dialog').show();
                return;
            }
            Tools.showToast(data.message)
        });
    }

    // 绑定用户，没有绑定过手机的新用户在点击加入购物车的时候提示
    function bindUser() {
        var phone = $('#tj-bind-dialog input[name="phone"]').val(),
            realname = $('#tj-bind-dialog input[name="realname"]').val();

        if (realname.isEmpty()) {
            Tools.showToast('请填写姓名');
            return;
        }
        if (phone.isEmpty()) {
            Tools.showToast('请填写联系方式');
            return;
        }
        if (!/^1\d{10}$/.test(phone)) {
            Tools.showToast('格式错误，请填写正确手机号');
            return;
        }

        Ajax.custom({
            url: '/members/signup/phone',
            data: {
                phone: phone,
                realname: realname
            },
            type: 'POST',
            contentType: 'application/json'
        }, function(response) {
            addCart(); //绑定成功之后在继续添加购物车
        }, function(textStatus, data) {
            Tools.showToast(data.message)
        });
    }

    // 显示已使用提示
    function showUsedTip() {
        Tools.showAlert({
            showTitle: true,
            titleText: '温馨提示',
            message: '您来晚了一步，优惠券被抢完了<br/>购买商品，自己成为会员吧'
        });
    }

    // 显示空数据，同时隐藏底部按钮
    function showEmpty() {
        $('#tj-empty').show();
    }

    Common.checkLoginStatus(function() { //入口
        getDetail()
    });
})()
