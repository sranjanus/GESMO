chrome.app.runtime.onLaunched.addListener(function(){
	chrome.app.window.create('window_mini.html', {
		id: 'miniWindowID',
		'bounds': {
			'width': 400,
			'height': 100
		}
	});
	// chrome.app.window.create('window.html', {
	// 	id: 'mainWindowID',
	// 	'bounds': {
	// 		'width': 500,
	// 		'height': 400
	// 	}
	// });
});