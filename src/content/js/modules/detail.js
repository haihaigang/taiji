(function(){

	$('.btn-addcart').click(function(e){
		e.preventDefault();

		location.href = 'cart.html'
	});

	Tools.showAlert({
		showTitle: true,
		titleText: '温馨提示',
		message: '您来晚了一步，优惠券被抢完了购买商品，自己成为会员吧'
	});
})()