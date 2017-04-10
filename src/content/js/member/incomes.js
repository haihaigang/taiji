(function(){

	function getInfo(){}

	function getData(){
		Ajax.custom({
			url: '/members'
		}, function(response){
			
		})
	}

    common.checkLoginStatus(function() { //入口
        getData();
    });
})()