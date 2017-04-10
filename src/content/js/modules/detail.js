(function() {
    var container = $('.container'),
        DETAIL_RATIO = 1, //轮播图的尺寸比例
        id = Tools._GET().id, //商品ID
        cid = Tools._GET().cid; //优惠券ID

    // 点击按钮，添加购物车
    $('.btn-addcart').click(function(e) {
        e.preventDefault();

        addCart($(this));
    });

    // 获取详情数据
    function getDetail() {
        if (cid) {
            url = '/products/coupon/' + cid
        } else {
            url = '/products/' + id;
        }

        Ajax.detail({
            url: url,
            data: {
                id: id,
                couponId: cid
            }
        }, function(response) {
            var data = response;
            Ajax.render('#tj-detail', 'tj-detail-tmpl', data);

            //固定图片的高度
            $('.detail-product-img img').css('height', parseInt($('body').width() / DETAIL_RATIO));

            // 初始化轮播图
            if (data.images && data.images.length > 0) {
                var swiper = new Swiper('.swiper-container', {
                    pagination: '.swiper-pagination',
                    paginationClickable: true,
                    loop: true,
                    autoplay: 3000,
                    autoplayDisableOnInteraction: false
                });
            }

            // 如果优惠券已经使用，显示提示信息
            if (data.used) {
                $('.btn-addcart').addClass('disabled');
                Tools.showAlert({
                    showTitle: true,
                    titleText: '温馨提示',
                    message: '您来晚了一步，优惠券被抢完了购买商品，自己成为会员吧'
                });
            }

            container.show();
        })
    }

    // 调用接口添加购物车
    function addCart(btnDom) {
        if (btnDom.hasClass('disbled')) {
            return;
        }

        Ajax.custom({
            url: '/carts/items',
            data: {
                productId: id,
                quantity: 1
            },
            type: 'POST',
            contentType: 'application/json'
        }, function(response) {
            location.href = 'cart.html';
        }, function(textStatus, data) {
            Tools.showToast(data.message)
        });
    }

    // 绑定用户，没有绑定过手机的新用户在点击加入购物车的时候提示
    function bindUser() {
        var phone = $('#tj-bind-dialog input[name="phone"]'),
            realname = $('#tj-bind-dialog input[name="realname"]');

        if (realname.isEmpty()) {
            Tools.showToast('请填写姓名');
            return;
        }
        if (phone.isEmpty()) {
            Tools.showToast('请填写联系方式');
            return;
        }
        if (/^1\d{10}$/.test(phone)) {
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

    common.checkLoginStatus(function() { //入口
        getDetail()
    });
})()
