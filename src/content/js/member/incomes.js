(function() {
    var container = $('.container'),
        pickupMoneyPage = new SecondPage('#pickup-money-page'),
        btnPickUpMoneyOpenDom = $('#btn-pickup-money-open'),
        tempData;


    // 模版帮助方法，获取收益的正负符号
    template.helper('$getIncomesFlag', function(content) {
        return 'WITHDRAWAL' === content ? '' : '+';
    });

    // 点击提现按钮
    btnPickUpMoneyOpenDom.click(function(e) {
        e.preventDefault();

        if ($(this).hasClass('disabled')) {
            return;
        }

        // TODO 确认用户是否已输入卡号
        if(tempData.bankNumber){
            $('#bank-name').val(tempData.bankName).attr('readonly', true);
            $('#bank-no').val(tempData.bankNumber).attr('readonly', true);
            $('#bank-user').val(tempData.bankFullName).attr('readonly', true);
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
            that = $(this);

        if(!amount){
            Tools.showToast('提现金额必选大于1');
            return;
        }

        $(this).addClass('disabled').text('提现中...');

        Ajax.custom({
            url: '/members/withdrawals',
            data: {
                bankName: bankName,
                bankNumber: bankNumber,
                bankFullName: bankFullName,
                amount: amount
            },
            type: 'POST',
            contentType: 'application/json'
        }, function(response) {
            Tools.showToast('提现成功');
            pickupMoneyPage.closeSidebar();
            getData();
            resetBtn(that);
        }, function(textStatus, data){
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
                if(data.total > 0){
                    btnPickUpMoneyOpenDom.removeClass('disabled')
                }
            }, 500)
        })
    }

    // 还原提现按钮
    function resetBtn(btnDom){
        setTimeout(function(){
            btnDom.text('提现').removeClass('disabled');
        },800)
    }

    Common.checkLoginStatus(function() { //入口
        getData();
        //添加默认分享功能
        WechatCommon.Share.commonShare();
    });
})()
