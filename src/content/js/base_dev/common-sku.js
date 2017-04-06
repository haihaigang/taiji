(function(){
    var $filter=$(".common-sku"),//主DOM
        openAnimation=null,//用于控制动画
        tempData=null,//主数据  一般为 单商品数据
        tempId=undefined, //商品Id
        specObj=null,//所有条件 以及所有符合条件的商品
        specList=[],//所有条件的二维列表
        submitFunction=function(){}, //提交后的callback
        targetProduct=null, //目标货品
        btnText=undefined,//底部按钮文字
        commonSKU={};


    // 模板帮助方法，获取数量控件状态
    template.helper('$defineSKUNumber', function(list) {
        //商品列表
        if(list.length==0 || list.length>1) return false;
        if(list[0].store==0) return false;
        if(list[0].store!=0) return list[0].store;
    });
    //初始化数据 并展示
    function _init(data){
        //存入tempData
        tempData=data;
        tempId=data.goodsId


        //重置参数
        specObj=null;
        specList=[];
        targetProduct=null;

        //预处理数据
        _beforeData();

        Ajax.render('#tj-common-sku', 'tj-common-sku-tmpl', tempData);

        //商品可以购买状态
        if(targetProduct!=null){
            var limitMin=targetProduct.limitMin?targetProduct.limitMin:1;
            var limitMax=targetProduct.limitMax?targetProduct.limitMax:targetProduct.store;

            $filter.find(".common-sku-submit").removeClass("disabled");
            $filter.find(".common-sku-num")
                .find("span").text(targetProduct.quantity?targetProduct.quantity:limitMin);
            $filter.find(".common-sku-num-btn")
                .attr("data-num",targetProduct.quantity?targetProduct.quantity:limitMin)
                .attr("data-max",limitMax)
                .attr("data-min",limitMin)

            //库存上限标示
            if(!targetProduct.limitMax){
                $filter.find(".common-sku-num-btn").addClass("store")
            }

            if(targetProduct.quantity){
                if(Number(targetProduct.quantity)>=limitMax){
                    $filter.find(".add").addClass("disabled")
                }
                if(Number(targetProduct.quantity)<=limitMin){
                    $filter.find(".min").addClass("disabled")
                }
            }else{
                $filter.find(".min").addClass("disabled")
                if(limitMin==limitMax){
                    $filter.find(".add").addClass("disabled")
                }
            }


        }else{
            $filter.find(".common-sku-num a").addClass("disabled");
            $filter.find(".common-sku-num")
                .attr("data-num",1)
                .attr("data-max",1)
                .find("span").text(1);
        }
    }
    //预处理数据  获取展示用商品
    function _beforeData() {
        //没有囤货 把specStr 等同于 specStrAll
        if(!tempData.isExistSpecShowTypeStockpile){
            tempData.specStr=tempData.specStrAll
            $.each(tempData.products,function(k,v){
                v.specStr=v.specStrAll
            })
        }
        //去除多余的筛选字段
        $.each(tempData.gspecDesc,function(k,v){
            if(v.specShowType=="stockpile"){
                tempData.gspecDesc.splice(k,1)
                return false
            }
        })
        //加入底部按钮文字
        if(btnText){
            tempData.btnText=btnText
        }


        _changeSpecFormat()//给商品增加备用字段  将条件字符串转换为数组
        _getSKUs();//用于获得包含在选条件 和 符合条件的所有商品对象
        _getPoisbility();//获取筛选条件的可能性(筛选逻辑)

        //
        var target={}
        //搜索结果商品列表内容没有
        if(specObj.productArray.length==0){
            target.imageDefaultUrl=tempData.mainPic
            target.minPrice=_getSection(tempData.products)[0];
            target.maxPrice=_getSection(tempData.products)[1];
            if(target.minPrice==target.maxPrice){
                target.maxPrice=undefined
            }
        }else{
            target=specObj.productArray[0];
            var noSelect=true;//判断是否没有被选中
            $.each(specObj.productArray,function(k,v){
                if(v.isSelect){
                    target=v
                    noSelect=false;
                    return false
                }
            })
            //有被选中则显示价格范围
            if(noSelect){
                target.minPrice=_getSection(specObj.productArray)[0];
                target.maxPrice=_getSection(specObj.productArray)[1];
                if(target.maxPrice==target.minPrice){
                    target.maxPrice=undefined
                }
            }else{
                target.minPrice=target.price||target.groupPrice
                target.maxPrice=undefined
            }
        }
        target.specTitle=_getSKUValue()
        //设定展示用数据
        tempData.defaultPro=target
        //设定最后条件
        tempData.specObjProducts=specObj.productArray;
    }
    //将商品条件字符串转化为数组 增加searchSpec字段(字符串转化为  数字数组   [1,2,3] 条件)
    function _changeSpecFormat(){
        $.each(tempData.products,function(k,v){
            var txt=v.specStr;
            v.searchSpec=txt.split("_");
            //转化成数字
            $.each(v.searchSpec,function(K,V){
                v.searchSpec[K]=Number(V)
            })
        })


    }
    /**
     * 获取可能商品列表  赋予按钮disable
     * 根据商品规格字符串和用户已经选择的规格字符串，规格组组合后的规格字符串
     * @return {[type]} [description]
     */
    function _getPoisbility(){
        var allSpec=[];//所有商品自生条件
        var customSpec=[];//用户选取的条件
        var posiblity=[];//所有可能出现的条件
        var disable=[];//被禁用的条件()
        //获取所有商品自生条件
        $.each(tempData.products,function(k,v){
            allSpec.push(v.searchSpec.join("_"))
        })
        //获取用户选取的条件
        $.each(tempData.specStr.split("_"),function(k,v){
            customSpec.push(Number(v))
        })
        //获取所有可能的值
        var tempArr=[],//
            customCondition=0;//用户选择条件数


        //用户未选择条件   放空所有条件
        $.each(customSpec,function(k,v){
            if(v){
                customCondition ++;
            }
        })
        if(customCondition==0){
            disable=[];//空选择条件时  放出所有条件
        } else{
            //获取所有条件id  二位数组
            $.each(tempData.gspecDesc,function(k,v){
                tempArr[k]=[]
                $.each(v.specValues,function(K,V){
                    tempArr[k][K]=Number(V.specValueId)
                })
            })
            //遍历二位数组  形成所有可能的条件组合 (可能会包含 含0的垃圾数据)
            $.each(customSpec,function(k,v){
                $.each(tempArr,function(x,y){
                    if(k!=x) return;
                    $.each(y,function(x2,y2){
                        var newPos=customSpec.concat();//复制数组
                        newPos[k]=y2;
                        posiblity.push(newPos.join("_"))
                    })
                })

            })
            //对比数据  产生disable数组
            var tempArr1=[];//根据现有的产品   得到不可能的组合
            $.each(posiblity,function(k,v){
                if(allSpec.indexOf(v)<0){
                    tempArr1.push(v)
                }
            })
            $.each(tempArr1,function(k,v){
                var arr=v.split("_");
                //避开不可能的选项
                if(arr.indexOf("0")>=0) return
                for(var i=0;i<arr.length;i++){
                    if(customSpec.indexOf(Number(arr[i]))<0){
                        disable.push(Number(arr[i]))
                    }
                }
            })
        }


        //设置disabled值
        $.each(tempData.gspecDesc,function(k,v){
            $.each(v.specValues,function(K,V){
                V.disabled=0;
                if(disable.indexOf(Number(V.specValueId))>=0){
                    V.disabled=1;
                }
            })
        })
    }
    //获取商品价格范围
    function _getSection(list){
        var priceArr=[];
        $.each(list,function(k,v){
            if(v.price){
                priceArr.push(v.price||v.groupPrice)
            }
        })
        var array=[]
        array[0]=Math.min.apply(Math, priceArr);
        array[1]=Math.max.apply(Math, priceArr);
        return array
    }
    //获取规格字符串
    function _getSKUValue(){
        var txt="";
        if(tempData.specStr.split("_").indexOf("null")>-1){
            txt="请选择规格";
            return
        };
        $.each(specObj.specArray,function(k,v){
            txt+=v.specValue+" ";
        })
        if(tempData.isExistSpecShowTypeStockpile && targetProduct){
            txt+=targetProduct.unitSpec;
        }
        if(txt=="")
            txt="请选择规格"
        return txt

    }
    //设置规格
    function _setSKUs(key,value){
        var spec=tempData.specStr;
        var getArray=spec.split("_");
        if(key>=0){//选择条件
            getArray[key]=value;

            //设置active 值
            $.each(tempData.gspecDesc,function(k,v){
                $.each(v.specValues,function(K,V){
                    V.specValueSelected=0
                    if(Number(getArray[k])==Number(V.specValueId)){
                        V.specValueSelected=1
                    }
                })
            })


            tempData.specStr=getArray.join("_")
            if(tempData.isExistSpecShowTypeStockpile){
                tempData.specStrAll=""
            }else{
                tempData.specStrAll=getArray.join("_")
            }
        }else{//囤货条件
            tempData.specStrAll=value
        }


    }
    //用于解析规格字符串 获得包含在选条件 和 符合条件的所有商品对象
    function _getSKUs(){
        //获取已选择的条件
        var key={
            specStrAll:tempData.specStrAll,
            specStr:tempData.specStr
        }
        var getArray=key.specStr.split("_");
        var returnObj={
            specArray:[],
            productArray:[]
        };
        specList=[];
        //获取已选择的条件详情
        $.each(tempData.gspecDesc,function(k,v){
            specList[k]=[];
            $.each(v.specValues,function(K,V){
                specList[k].push(Number(V.specValueId))
                //清空所有已选
                V.specValueSelected=0
                if(Number(getArray[k])==Number(V.specValueId)){
                    returnObj.specArray.push(V)
                    V.specValueSelected=1

                }
            })
        })
        //获取已选择的商品详情
        targetProduct=null;
        $.each(tempData.products,function(k,v){
            v.isSelect=0 //增加被选中字段
            if(tempData.isExistSpecShowTypeStockpile){
                //获取已选择的囤货商品详情
                if(key.specStrAll==v.specStrAll){
                    returnObj.productArray.push(v)
                    v.isSelect=1
                    targetProduct=v
                }else
                if(key.specStr==v.specStr){
                    returnObj.productArray.push(v)
                }
            }else{
                if(key.specStr==v.specStr || key.specStrAll==v.specStrAll){
                    returnObj.productArray.push(v)
                    v.isSelect=1
                    targetProduct=v
                }
            }


        });
        //如果能直接得到一件商品  默认选中
        if(!targetProduct && returnObj.productArray.length==1 ){
                returnObj.productArray[0].isSelect=1;
                targetProduct=returnObj.productArray[0]
        }

        //增加促销字段  (依据为单品最小价格)
        var minUnitPrice=tempData.products[0].minUnitPrice;
        var minUnitProIndex=0;
        $.each(returnObj.productArray,function(k,v){

            if(minUnitPrice>v.minUnitPrice){
                minUnitProIndex=k;
                minUnitPrice=v.minUnitPrice;
            }
        });
        if(returnObj.productArray[minUnitProIndex])
            returnObj.productArray[minUnitProIndex].isCu=1;
        specObj=returnObj
    }
    /**
    * 开启弹窗 并获取该商品data
    * @param  data  商品对象
     *          text 底部按钮文字
    *
    * */
    function openFilter(data,text){
        if(!data) {
            Tools.showToast('数据异常');
            return
        }
        if(data.products.length==0 || data.gspecDesc.length==0){
            Tools.showToast('数据异常');
            return
        }
        if(data.products.specStrAll==""  && data.products.specStr=="" ){
            Tools.showToast('数据异常');
            return
        }
        btnText=text;
        _init(data);
        $filter.show();
        clearTimeout(openAnimation)
        openAnimation=setTimeout(function(){
            $filter.addClass("active")
        },300);
    }
    function closeFilter(){
        clearTimeout(openAnimation)
        $filter.removeClass("active");
        openAnimation=setTimeout(function(){
            $filter.hide();
        },300)
    };
    //提交用方法
    function submitFilterFunction(fun){
        if(typeof fun !="function")   return
        submitFunction=fun
    }
    //关闭
    $filter.on("click",".close",function(e){
        e.preventDefault();
        closeFilter()
    })
    //选定按钮
    $filter.on("click",".common-sku-btns a",function(e){
        e.preventDefault();
        e.stopPropagation();
        var obj=$(this);
        var key=obj.parents(".common-sku-listitem").index(),
            value=Number(obj.attr("data-id"));
        if(obj.hasClass("disabled")) return;

        if(obj.hasClass("product")){
            if(obj.hasClass("active")){
                 obj.removeClass("active")
                 _setSKUs(-1,null)
            }else{
                obj.parents(".common-sku-listitem").find("a").removeClass("active");
                obj.addClass("active")
                _setSKUs(-1,obj.attr("data-spec"))
            }
        }else{
            if(obj.hasClass("active")){
                 obj.removeClass("active")
                 _setSKUs(key,null)
            }else{
                obj.parents(".common-sku-listitem").find("a").removeClass("active");
                obj.addClass("active")
                _setSKUs(key,value)
            }
        }



        _init(tempData)
    })
    //数量
    $filter.on("click", ".common-sku-num-btn a", function(e) {
        e.preventDefault();
        var obj = $(this),
            buttonContainer = obj.parents(".common-sku-num-btn"),
            buttons = buttonContainer.find("a"),
            span=buttonContainer.find("span"),
            quantity = Number(buttonContainer.attr("data-num")),//所选数量
            max = buttonContainer.attr("data-max")?Number(buttonContainer.attr("data-max")):undefined, //最大数
            min = buttonContainer.attr("data-min")?Number(buttonContainer.attr("data-min")):undefined //最大数

        if (obj.hasClass("disabled")){
            if(!targetProduct) return;
            if(obj.hasClass("add") && !buttonContainer.hasClass("store")　){
                Tools.showToast('该商品限购' + buttonContainer.attr("data-max") + '件');
            }else if(obj.hasClass("add") && buttonContainer.hasClass("store")){
                Tools.showToast('该商品库存不足');
            }
            if(obj.hasClass("min")　&& quantity!=1){
                Tools.showToast('该商品起购' + buttonContainer.attr("data-min") + '件');
            }
            return;

        }



        if (obj.hasClass("min")) {
            quantity--;
        } else if (obj.hasClass("add")) {
            quantity++;
        }

        buttons.removeClass("disabled");
        span.text(quantity);
        buttonContainer.attr("data-num",quantity)
        if(quantity<=min || quantity>=max){
            obj.addClass("disabled")
        }
    });
    //点击遮罩
    $filter.on("click",function(e){
        e.preventDefault();
        if(e.target.id=="tj-common-sku"){
            closeFilter();
        }
    });
    $filter.on("click",".common-sku-submit",function(e){
        e.preventDefault();
        if($(this).hasClass("disabled")) return;
        targetProduct.quantity=$filter.find(".common-sku-num-btn").attr("data-num")
        var data={
            quantity:targetProduct.quantity,
            productId:targetProduct.productId || targetProduct.skuId ,
            product:targetProduct,
            title:_getSKUValue()
        };
        submitFunction(data);
        closeFilter();
    })
    //
    commonSKU.openFilter=openFilter;
    commonSKU.closeFilter=closeFilter;
    commonSKU.submitFilterFunction=submitFilterFunction;
    window.commonSKU=commonSKU;

})()