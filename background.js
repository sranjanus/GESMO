chrome.app.runtime.onLaunched.addListener(function(){
	chrome.app.window.create('window.html', {
		id: 'miniWindowID',
		'bounds': {
			'width': 400,
			'height': 500
		}
	});
});