(function() {
    var addressId = Tools._GET().addressId, //地址编号
        tempAddress = undefined,
        areaData = [],//省市区数据
        container = $('#tj-list'),
        consigneeIdDom = $('input[name="id"]'),
        consigneeNameDom = $('input[name="name"]'),
        consigneeTelDom = $('input[name="phone"]'),
        consigneeCardDom = $('input[name="consigneeCard"]'),
        provinceDom = $('input[name="provinceId"]'),
        cityDom = $('input[name="cityId"]'),
        districtDom = $('input[name="districtId"]'),
        addressDom = $('input[name="address"]'),
        isDefaultDom = $('input[name="prior"]');

    common.checkLoginStatus(function() { //入口
        if (addressId) {
            //获取地址列表
            Ajax.custom({
                url: '/members/addresses/' + addressId,
                showLoading: true
            }, function(response) {
                setData(response);
                initAreaFixed(response);
            }, function(textStatus, data) {
                container.html('<div class="nodata">' + ((data && data.message) || '服务器异常。' + textStatus) + '</div>')
            });
        }
    });

    //设置默认地址
    $('#set-default').click(function(e) {
        e.preventDefault();
        if (isDefaultDom.val() == 'false') {
            isDefaultDom.val('true')
            $(this).addClass('active');
        } else {
            isDefaultDom.val('false')
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
        if (addressDom.val().isEmpty()) {
            Tools.showAlert('请填写详细地址');
            return;
        }

        if ($(this).hasClass('disabled')) return;
        $(this).text('保存中...').addClass('disabled');
        var btnDom = $(this);

        Ajax.custom({
            url: '/members/addresses',
            data: Tools.formJson('#tj-form'),
            showLoading: true,
            type: 'POST',
            contentType: 'application/json'
        }, function(response) {
            if (Tools._GET().from) {
                var url = decodeURIComponent(Tools._GET().from);
                url = Tools.changeURLArg(url, 'addressId', response.body.consigneeId || '');
                location.href = url;
                return;
            }
            location.href = 'addresses.html';
        }, function(textStatus, data) {
            btnDom.text('保存').removeClass('disabled');
            Tools.showToast(data.message || '服务器异常');
        })
    });

    Ajax.custom({
        url: '/regions',
        data:{
            parentId: 0
        }
    }, function(response){

    })

    setAreaData();

    //渲染模版    
    Ajax.render('#loc_area', 'tj-area-list-tmpl', areaData);

    // 初始化级联选择框
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

    //显示值
    function setData(data) {
        if (!data) return;

        tempAddress = data;

        consigneeIdDom.val(data.id);
        consigneeNameDom.val(data.name);
        consigneeTelDom.val(data.phone);
        addressDom.val(data.address);
        isDefaultDom.val(data.prior);

        provinceDom.val(data.provinceId);
        cityDom.val(data.cityId);
        districtDom.val(data.districtId);

        if (data.prior) {
            $('#set-default').addClass('active');
        } else {
            $('#set-default').removeClass('active');
        }

        $('#loc_area_dummy').val(data.provinceName + ' ' + data.cityName + ' ' + data.districtName);
    }

    // 获取省市区数据
    function setAreaData() {
        areaData = convertToObj(region_Data[0]);

        $.each(areaData, function(k, v) {
            v.citys = convertToObj(region_Data[1][v.next]);
            for (var i in v.citys) {
                v.citys[i].districts = convertToObj(region_Data[2][v.citys[i].next]);
            }
        })
    }

    // 转换省市区字符串成对象
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

    // 初始化地区定位开始
    function initAreaFixed(data) {
        if (!data) return;
        var i, j, k;
        for (i in areaData) {
            if (data.provinceId == areaData[i].areaNum) {
                for (j in areaData[i].citys) {
                    if (areaData[i].citys[j].areaNum == data.cityId) {
                        for (k in areaData[i].citys[j].districts) {
                            if (areaData[i].citys[j].districts[k].areaNum == data.districtId) {
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

})()
