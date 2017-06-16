(function() {
    var container = $('.container'),
        pickupMoneyPage = new SecondPage('#pickup-money-page'),
        btnPickUpMoneyOpenDom = $('#btn-pickup-money-open'),
        tempData;


    // 模版帮助方法，获取充值的正负符号
    template.helper('$getChargeFlag', function(content) {
        return 'TOPUP' === content ? '+' : '';
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
            $('#bank-user').val(tempData.bankFullName).attr('readonly', true);
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
            url: '/members/withdrawals/balance',
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

    var payBtnDom;

    //点击购买按钮
    container.on('click', '.charge-header-form-button button', function(e) {
        e.preventDefault();

        if ($(this).hasClass('disabled')) {
            return;
        }

        var money = $('.charge-header-form-input input').val();

        if (!money) {
            Tools.showToast('请填写正确的金额');
            return
        }

        $(this).addClass('disabled').text('购买中...');
        payBtnDom = $(this);

        // 定时就还原按钮
        setTimeout(function() {
            payBtnDom.text('购买').removeClass('disabled');
        }, 800)

        Ajax.custom({
            url: '/members/topups',
            data: {
                amount: money
            },
            type: 'POST',
            contentType: 'application/json'
        }, function(response) {
            pay(response.topupNumber);
        }, function(textStatus, data) {
            Tools.showToast(data.message);
        });
    });

    // 获取数据
    function getData() {
        Ajax.custom({
            url: '/members/balance/logs',
            showLoading: true
        }, function(response) {
            var data = response;

            tempData = data;

            Ajax.render('#tj-info', 'tj-info-tmpl', data);
            Ajax.render('#tj-list', 'tj-list-tmpl', data.logs);

            container.show();

            setTimeout(function() {
                if (data.balance > 0) {
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

    // 发起支付
    function pay(orderId) {
        WechatCommon.Pay.weixinPayOrder(orderId,
            //支付成功回调
            function payCallback(data) {
                getData();
            },
            //取消支付回调
            function errorCallback() {
            });
    }

    Common.checkLoginStatus(function() { //入口
        getData();
        //添加默认分享功能
        WechatCommon.Share.commonShare();
    });
})()
