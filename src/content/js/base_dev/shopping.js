/**
 * 列表点击添加购物车
 */
(function() {
    var shopping = function(){
        this.addCartDom = [];              // 添加购物车DOM
        this.addCartPopDom = [];        // 多规格弹窗添加购物车DOM
        this.swithSkuDom = [];            // 多规格弹窗增加减少按钮
        this.cateSkuList = [];                  // 列表页多规格弹窗
        this.cateSkuDetail = [];               // 详情页多规格弹窗
        
        this.pathname = null;
        this.pos = null;
        this.index = null;
        this.productId = null;
        this.limitNum = null;
        this.categoryId = null;

    };

    /**
     * 初始化购物车事件
     * @param  tempData     当前列表页hotGoodses列表
     * @param  fn           添加购物车成功后回调函数
     */
    shopping.prototype.initShoppingList = function(tempData, fn, extendOjb){
        var _this = this;
        _this.addCartDom = $('[data-addcart]');              // 添加购物车DOM
        _this.addCartPopDom = $('#subCart');        // 多规格弹窗添加购物车DOM
        _this.swithSkuDom = $('.goods-qty .btn');            // 多规格弹窗增加减少按钮
        _this.cateSkuList = $('.cate-sku');                  // 列表页多规格弹窗
        _this.cateSkuDetail = $('#skus-page');               // 详情页多规格弹窗
        _this.pathname = location.pathname;
        _this.categoryId = Tools._GET().categoryId;

        tempData = tempData || [];
        extendOjb = extendOjb || {};

        // 列表页添加购物车事件
        _this.addCartDom.off('click').on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            var that = $(this),
                par = that.closest('.goods-item'), 
                index = par.index(),
                addData = {};
        

            _this.index = index;
            _this.pos = that.data('pos');
            MeiStat.pushInitPit(MeiStat.pageVisit.level,_this.pos);

            if (that.hasClass('disabled')) {
                Tools.showToast('商品已抢光！');
                return;
            }

            _this.productId = tempData[index] ? tempData[index].productId : that.attr("data-productId");

            if(_this.pathname.indexOf('act2') != -1){//活动页面获取productId
                _this.productId = par.attr("data-productId");
            }

            addData = {
                productId: _this.productId,
                quantity: 1,
                shopId:extendOjb.shopId?extendOjb.shopId:0
            };

            if(_this.pathname.indexOf('secondkill') != -1){
                addData.isUserLimit = 1;
            }

            if (tempData.length != 0 && !isSingleSpec(tempData[index])) {
                commonSKU.openFilter(tempData[index])
                commonSKU.submitFilterFunction(function(data){
                    addCart(data, fn, true, _this.index);
                })
            } else {
                addCart(addData, fn, false, index, extendOjb);
            }
        }).bind(_this);


        // 多规格弹层增加减少商品数量
       /* _this.swithSkuDom.off('click').on('click', function(e) {
            e.preventDefault();

            var that = $(this),
                par = that.parent(),
                numDom = par.find('.num-ipt'),
                num = parseInt(numDom.text());

            that.find('span').removeClass('active');

            if (that.hasClass('plus')) {
                if (num >= _this.limitNum) {
                    Tools.showToast('每单限购' + _this.limitNum + '件！');
                    return;
                }
                num++;
                par.find('span').removeClass('active');
            }

            if (that.hasClass('minus')) {
                num--;
                if (num <= 1) {
                    num = 1;
                }
            }

            if (num == 1) {
                that.find('span').addClass('active');
            }

            numDom.text(num);
        });*/


        // 多规格弹层切换SKU内容
        /*_this.cateSkuList.off('click').on('click', '.sku-type dd', function(e) {
            e.preventDefault();

            var that = $(this);

            if (that.hasClass('active') || that.hasClass('sell-over')) {
                return;
            }

            _this.productId = that.attr('data-prodid');
            that.siblings().removeClass('active');

            getGoodsSku();

        }).bind(_this);*/



       /* // 弹出的规格选择框中点击添加购物车
        _this.addCartPopDom.off('click').on('click', function(e) {
            e.preventDefault();

            MeiStat.pushInitPit(MeiStat.pageVisit.level,_this.pos);

            var num = Number(_this.cateSkuList.find('.num-ipt').text());

            if (num > _this.limitNum) {
                Tools.showToast('每单限购' + _this.limitNum + '件！');
                return;
            }

            addCart({productId:_this.productId, quantity:num}, fn, true, _this.index);
        }).bind(_this);
        //外放加入购物车接口
        */
        _this.addCart=addCart;
    }


    /*//获取商品SKU
    function getGoodsSku() {
        Ajax.custom({
            url: config.HOST_API_APP + '/category/getSpecs',
            data: {
                categoryId: Shopping.categoryId,
                productId: Shopping.productId
            },
            showLoading: false
        }, function(response) {
            initSku(response.body);
        }, function(textStatus, data) {

        })
    };*/

    //添加购物车数量
    function addCart(data, fn, isPopup, index, extendOjb) {
        Ajax.custom({
            url: config.HOST_API_APP + '/shopping/cart/add',
            data: data,
            type: 'POST'
        }, function(response) {
            fn && fn(response, Shopping.productId, index, extendOjb);

            Tools.showToast('加入购物车成功');
            // iosapp中不通知添加购物车数量
            if(!Tools.isRbyAppBrowser() && !Tools.isIos()){
                common.noticeCart(true);
            }
            
        }, function(textStatus, data) {
            Tools.showToast(data.message || '服务器异常');
        })
    };

    
    

    //判断某商品是否单规格
    function isSingleSpec(data) {
        if (!data) return true;
        if (!data.gspecDesc) return true;
        for (var x in data.gspecDesc) {
            if (data.gspecDesc[x].specValues.length > 1 && !data.gspecDesc[x].products) {
                return false;
            }
        }

        return true;
    }

    
    

    /*/!**
     * 初始化SKU选择框
     * @param specs
     * @param data
     * @param pos
     *!/
    function initSku(specs, data, pos) {
        data = data || {};
        Ajax.render('#tj-goodssku', 'tj-goodssku-tmpl', specs);

        var d;
        for (var i in specs) {
            for (var j in specs[i].specValues) {
                if (specs[i].specValues[j].checked == '1') {
                    d = specs[i].specValues[j];
                    Shopping.limitNum = d.limitNum;
                }
            }
        }
        if (data.name) {
            $('.sku-head > h3').html(data.name);
        }
        if (d.mainPic || data.mainPic) {
            $('.sku-head > img').attr('src', d.mainPic || data.mainPic);
        }

        if (pos) {
            Shopping.pos = pos;
        }

        $('#sku-price').html('￥' + Tools.rbyFormatCurrency(d.price));

        if (d.mktPrice != '') {
            $('#sku-mktprice').html('￥' + Tools.rbyFormatCurrency(d.mktPrice));
        } else {
            $('#sku-mktprice').html('');
        }

        showCateSku();
    }

    /!**
     * 显示sku选择框
     *!/
    function showCateSku() {
        $('#tj-cover-bg').show();
        Shopping.cateSkuList.show();
        var width = $(window).width(),
            height = $(window).height(),
            cateSkuHeight = Shopping.cateSkuList.height(),
            left = (width - 310) / 2,
            top = (height - cateSkuHeight) / 2;
        Shopping.cateSkuList.css({
            'left': left,
            'top': top - 30
        });

    }

    /!**
     * 隐藏sku选择框
     *!/
    function closeCateSku() {
        $('.cate-sku,#tj-cover-bg').hide();
    }


    $('#tj-cover-bg,.cate-sku-close').on('click', function(e) {
        closeCateSku();
    })*/


    window.Shopping = new shopping();

})();

