var windowMode =  GESMO.MaxMode;
var ui, leapController, dataController;

window.onload = function(){
	ui = new GESMO.GesmoUI(document.getElementById('container'));
	dataController = new DataController();

	window.addEventListener('gesmo.ui.fetchlibrary', function(query){
		dataController.fetchData(query, dataFetched, dataFetchedFailed);
	}.bind(this));
};

function dataFetched(type, data){
	ui.showLibrary(type, data);
}

function dataFetchedFailed(error){

}