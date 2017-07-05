(function() {
    var container = $('.container'),
        pickupMoneyPage = new SecondPage('#pickup-money-page'),
        btnPickUpMoneyOpenDom = $('#btn-pickup-money-open'),
        tempData;


    // 模版帮助方法，获取收益的正负符号
    template.helper('$getIncomesFlag', function(data) {
        return 'WITHDRAWAL' === data.type ? '-' + data.aftertaxAmount : '+' + data.amount;
    });

    // 模版帮助方法，获取收益的类型的标签
    template.helper('$getIncomesTypeFlag', function(content) {
        switch (content) {
            case 'PROFIT1':
            case 'PROFIT2':
                return '<em class="a1">分利</em>';
            case 'SALES':
            case 'REWARD':
                return '<em class="a1">收益</em>';
            case 'WITHDRAWAL':
                return '<em class="a2">提现</em>';
            case 'WITHDRAWAL_RETURN':
                return '<em class="a3">退还</em>';
            default:
                return '<em>--</em>';
        }
    });

    // 点击提现按钮
    btnPickUpMoneyOpenDom.click(function(e) {
        e.preventDefault();

        if ($(this).hasClass('disabled')) {
            return;
        }

        // TODO 确认用户是否已输入卡号
        if (tempData.bankNumber) {
            $('#bank-name').val(tempData.bankName).attr('readonly', true);
            $('#bank-no').val(tempData.bankNumber).attr('readonly', true);
            $('#bank-user').val(tempData.fullName).attr('readonly', true);
            $('#bank-card').val(tempData.idNumber).attr('readonly', true);
        }

        $('#bank-money').attr('placeholder', '提现金额，最多¥' + Tools.formatCurrency(tempData.total)).val('');
        $('#pickup-money-total').text(Tools.formatCurrency(tempData.total));

        pickupMoneyPage.openSidebar();
    });

    // 确认提货按钮
    $('.btn-pickup-money-sure').click(function(e) {
        e.preventDefault();

        if ($(this).hasClass('disabled')) {
            return;
        }

        var bankName = $('#bank-name').val(),
            bankNumber = $('#bank-no').val(),
            bankFullName = $('#bank-user').val(),
            amount = $('#bank-money').val(),
            idNumber = $('#bank-card').val(),
            that = $(this);

        if (!bankName) {
            Tools.showToast('开户行必填');
            return;
        }

        if (!bankNumber) {
            Tools.showToast('卡号必填');
            return;
        }

        if (!bankFullName) {
            Tools.showToast('用户名必填');
            return;
        }

        if (!idNumber) {
            Tools.showToast('身份证号必填');
            return;
        }

        if (!amount) {
            Tools.showToast('提现金额必选大于1');
            return;
        }

        if (amount > tempData.total) {
            Tools.showToast('提现金额不能大于提现总金额');
            return;
        }

        $(this).addClass('disabled').text('提现中...');

        Ajax.custom({
            url: '/members/withdrawals/profit',
            data: {
                bankName: bankName,
                bankNumber: bankNumber,
                bankFullName: bankFullName,
                amount: amount,
                idNumber: idNumber
            },
            type: 'POST',
            contentType: 'application/json'
        }, function(response) {
            Tools.showToast('提现成功');
            pickupMoneyPage.closeSidebar();
            getData();
            resetBtn(that);
        }, function(textStatus, data) {
            Tools.showToast(data.message);
            resetBtn(that);
        })
    });


    // 获取数据
    function getData() {
        Ajax.custom({
            url: '/members/profits/logs',
            showLoading: true
        }, function(response) {
            var data = response;

            tempData = data;

            Ajax.render('#tj-info', 'tj-info-tmpl', data);
            Ajax.render('#tj-list', 'tj-list-tmpl', data.logs);

            container.show();

            setTimeout(function() {
                if (data.total > 0) {
                    btnPickUpMoneyOpenDom.removeClass('disabled')
                }
            }, 500)
        })
    }

    // 还原提现按钮
    function resetBtn(btnDom) {
        setTimeout(function() {
            btnDom.text('提现').removeClass('disabled');
        }, 800)
    }

    // 获取状态信息，获取用户等级提升和用户解绑的提示
    function getStatus() {
        Ajax.custom({
            url: '/members/notifications',
            showLoading: true
        }, function(response) {
            var data = response;

            for (var i = 0; i < data.length; i++) {
                if (data[i].type == Config.NOTIFICATION_TYPE.REFUSE) {
                    $('#tj-refuse-dialog').show();
                    $('#tj-refuse-dialog .up3').text(data[i].extendedValue);
                }
            }
        })
    }

    Common.checkLoginStatus(function() { //入口
        getData();
        getStatus();
        //添加默认分享功能
        WechatCommon.Share.commonShare();
    });
})()
