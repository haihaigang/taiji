(function() {
    var noPayNums = Tools._GET().noPayNums,
        groupOrderId = Tools._GET().groupOrderId,
        count = 3;

    if (!isNaN(noPayNums) && parseInt(noPayNums) > 1) {
        $('#btn-view').attr('href', 'checkout.html?groupId=' + groupOrderId).text('支付其他订单');
    }

    //自动跳回首页
    setInterval(function() {
        if (count <= 1) {
            location.href = '../index.html';
        }
        count--;
    }, 2000);
})()
