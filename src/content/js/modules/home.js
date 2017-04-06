(function(){
	var AD_RATIO = 750 / 354;

	$('.home-banner img').css('height', parseInt($('body').width() / AD_RATIO));
})()