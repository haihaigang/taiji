(function() {
    var addressId = Tools._GET().addressId, //地址编号
        targetId = Tools._GET().targetId, //目标编号
        type = Tools._GET().type, //目标类型
        tempAddress = undefined,
        wheelsData = {}, //mobiscroll的数据wheels
        cityData = [],
        districtData = [],
        container = $('#tj-list'),
        consigneeIdDom = $('input[name="consigneeId"]'),
        consigneeNameDom = $('input[name="consigneeName"]'),
        consigneeTelDom = $('input[name="consigneeTel"]'),
        consigneeCardDom = $('input[name="consigneeCard"]'),
        provinceDom = $('input[name="province"]'),
        cityDom = $('input[name="city"]'),
        districtDom = $('input[name="district"]'),
        addressDom = $('input[name="address"]'),
        addrTypeDom = $('input[name="addrType"]'),
        isDefaultDom = $('input[name="isDefault"]');
    var keyToDom = { //类型对应dom
        'province': '#loc_province',
        'city': '#loc_city',
        'district': '#loc_town'
    }
    common.checkLoginStatus(function() { //入口
        if (addressId) {
            //获取地址列表
            Ajax.custom({
                url: config.HOST_API_APP + '/member/address/get',
                data: {
                    consigneeId: addressId
                },
                showLoading: true
            }, function(response) {
                setData(response.body);
                initAreaFixed(response.body);
            }, function(textStatus, data) {
                container.html('<div class="nodata">' + ((data && data.message) || '服务器异常。' + textStatus) + '</div>')
            });
        }

    });

    //显示值
    function setData(data) {
        if (!data) return;

        tempAddress = data;

        consigneeIdDom.val(data.consigneeId);
        consigneeNameDom.val(data.consigneeName);
        consigneeTelDom.val(data.consigneeTel);
        consigneeCardDom.val(data.consigneeCard);
        addressDom.val(data.address);
        isDefaultDom.val(data.isDefault);

        provinceDom.val(data.province.regionId);
        cityDom.val(data.city.regionId);
        districtDom.val(data.district.regionId);

        if (data.isDefault == '1') {
            $('#set-default').addClass('active');
        } else {
            $('#set-default').removeClass('active');
        }
        // 地址类型
        if (data.addrType == "1" ){
            $('#addrType_dummy').val('家庭');

        }else if(data.addrType == "2" ){
            $('#addrType_dummy').val('公司');
        }
        addrTypeDom.val(data.addrType);
        $('#addrType').mobiscroll('setVal', data.addrType, true);

        if (data.consigneeCard) {
            consigneeCardDom.parent().parent().removeClass('userId-hide')
        }

        $('#loc_area_dummy').val(data.province.regionName + ' ' + data.city.regionName + ' ' + data.district.regionName);
    }

    //设置默认地址
    $('#set-default').click(function(e) {
        e.preventDefault();
        if (isDefaultDom.val() == '0') {
            isDefaultDom.val(1)
            $(this).addClass('active');
        } else {
            isDefaultDom.val(0)
            $(this).removeClass('active');
        }
    });


    //保存收货地址
    $('.btn-save').click(function(e) {
        e.preventDefault();

        if (consigneeNameDom.val().isEmpty()) {
            Tools.showAlert('请填写姓名');
            return;
        }
        if (consigneeTelDom.val().isEmpty()) {
            Tools.showAlert('请填写手机号');
            return;
        }
        if (!consigneeTelDom.val().isPhone()) {
            Tools.showAlert('请填写正确的手机号');
            return;
        }
        if (provinceDom.val().isEmpty()) {
            Tools.showAlert('请选择省市区');
            return;
        }
        if (cityDom.val().isEmpty()) {
            Tools.showAlert('请选择省市区');
            return;
        }
        if (districtDom.val().isEmpty()) {
            Tools.showAlert('请选择省市区');
            return;
        }
        if (addrTypeDom.val().isEmpty() || addrTypeDom.val() == "0" ||  addrTypeDom.val() == "null" ||  addrTypeDom.val() == "") {
            Tools.showAlert('请选择地址类型');
            return;
        }
        if (addressDom.val().isEmpty()) {
            Tools.showAlert('请填写详细地址');
            return;
        }
        
        if ($(this).hasClass('disabled')) return;
        $(this).text('保存中...').addClass('disabled');
        var btnDom = $(this);

        Ajax.custom({
            url: config.HOST_API_APP + '/member/address/save',
            data: Tools.formJson('#tj-form'),
            showLoading: true,
            type: 'POST'
        }, function(response) {
            if (Tools._GET().from) {
                var url = decodeURIComponent(Tools._GET().from);
                url = Tools.changeURLArg(url, 'addressId', response.body.consigneeId || '');
                location.href = url;
                return;
            }
            if (targetId) {
                Go.toCheckout(response.body.consigneeId);
                // location.href = 'checkout.html?targetId=' + targetId + '&type=' + type + '&addressId=' + response.body.consigneeId;
            } else {
                location.href = 'addresses.html';
            }
        }, function(textStatus, data) {
            btnDom.text('保存').removeClass('disabled');
            Tools.showToast(data.message || '服务器异常');
        })
    });


    //遍历地址数组
    window.areaData = convertToObj(region_Data[0]);

    $.each(areaData, function(k, v) {
        v.citys = convertToObj(region_Data[1][v.next]);
        for (var i in v.citys) {
            v.citys[i].districts = convertToObj(region_Data[2][v.citys[i].next]);
        }
    })

    function convertToObj(arr) {
        var data = [];
        for (var i in arr) {
            var a = arr[i].split(':')[0];
            var c = arr[i].split(':')[1];
            var b = arr[i].split(':')[2];
            data.push({
                'name': a,
                'areaNum': c,
                'next': b
            });
        }
        return data;
    }
    //渲染模版    
    Ajax.render('#loc_area', 'tj-area-list-tmpl', areaData);
    
    $('#loc_area').mobiscroll().treelist({
        theme: "android-holo-light", // 主题风格
        mode: 'scroller', // 模式 
        display: 'bottom', // 显示位置，底部 
        lang: 'zh', // 语言
        labels: ['Region', 'Country', 'City'],
        buttons: [
            'cancel',
            'set'
        ],
        onInit: function() {
            $('#loc_area_dummy').attr('placeholder', '请选择省市区');
        },
        // 设置区域值
        onSelect: function(valueText, inst) {
            if (areaData) {
                var d = [];
                d = valueText.split(' ');
                var selectedDate = areaData[d[0]].name + ' ' + areaData[d[0]].citys[d[1]].name + ' ' + areaData[d[0]].citys[d[1]].districts[d[2]].name;
                var provinceDate = areaData[d[0]].areaNum;
                var cityData = areaData[d[0]].citys[d[1]].areaNum;
                var districtData = areaData[d[0]].citys[d[1]].districts[d[2]].areaNum;
                provinceDom.val(provinceDate);
                cityDom.val(cityData);
                districtDom.val(districtData);
                $('#loc_area_dummy').val(selectedDate);
            }
        }

    });
    // 初始化地区定位开始
    function initAreaFixed(data) {
        if (!data) return;
        var i, j, k;
        for (i in areaData) {
            if (data.province.regionId == areaData[i].areaNum) {
                for (j in areaData[i].citys) {
                    if (areaData[i].citys[j].areaNum == data.city.regionId) {
                        for (k in areaData[i].citys[j].districts) {
                            if (areaData[i].citys[j].districts[k].areaNum == data.district.regionId) {
                                i = parseInt(i);
                                j = parseInt(j);
                                k = parseInt(k);
                                var inst = $('#loc_area').mobiscroll('getInst');
                                inst.settings.defaultValue = [i, j, k];
                                break;
                            }
                        }
                    }
                }
            }
        }
    }
    // 初始化地区定位结束

    initAddrType();
    //初始化地址类型
    function initAddrType(){
        $("#addrType").mobiscroll().select({ 
            theme: "android-holo-light", // 主题风格
            mode: 'scroller', // 模式 
            // headerText:'请选择地址类型',
            placeholder:'请选择地址类型',
            display: 'bottom', // 显示位置，底部 
            lang: 'zh', // 语言
            minWidth: 320,
            buttons: [
                'cancel',
                'set'
            ],
            data: [
                {
                    text: '家庭',
                    value: '1',
                },
                {
                    text: '公司',
                    value: '2',
                }
            ],
            onChange: function (valueText, inst) {
                if(addrTypeDom.val() == ""){
                    $('#addrType_dummy').val('');
                }else if(addrTypeDom.val() == "1"){
                    $('#addrType_dummy').val('家庭');
                }else{
                    $('#addrType_dummy').val('公司');
                }
                             
            },
            onSelect: function(valueText, inst) {
                $('#addrType_dummy').val(valueText);
                if(valueText == "家庭"){
                    addrTypeDom.val("1")
                }else if(valueText == "公司"){
                    addrTypeDom.val("2")
                }else{
                    addrTypeDom.val("0")
                }
            }

        }); 
    }
    
})()
