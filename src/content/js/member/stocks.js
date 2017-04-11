(function(){
	var container = $('.container');


	function getInfo(){}

	function getData(){
		Ajax.custom({
			url: '/members/inventories'
		}, function(response){
			var data = response;

			Ajax.render('#tj-info', 'tj-info-tmpl', data);
			Ajax.render('#tj-list', 'tj-list-tmpl', data.inventories);

			container.show();
		});
	}

    common.checkLoginStatus(function() { //入口
        getData();
    });
})()