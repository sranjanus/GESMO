GESMO.DataController = function(){
	this.urlPath = "http://localhost:8000/testData/";
};

GESMO.DataController.prototype = {
	fetchData: function(searchQuery, onSuccess, onFailure) {
		var completePath = this.urlPath;
		switch(searchQuery.type){
			case "artists" : {
				completePath += "artists.json";
				break;
			}
			case "albums" : {
				completePath += "albums.json";
				break;
			}
			case "songs" : {
				completePath += "songs.json";
				break;
			}
		}

		$.ajax({url: completePath, async: false, success: function(result, status, xhr){
			console.log(result);
			console.log(status);
			console.log(xhr);
			if(searchQuery.filterName == null){
			    onSuccess(searchQuery.type, result[searchQuery.type]);
			} else{
				var filteredList = [];
				result[searchQuery.type].forEach(function(item){
					if(item[searchQuery.filterName] == searchQuery.filterValue){
						filteredList.push(item);
					}
				}.bind(this));
				console.log(filteredList);
				onSuccess(searchQuery.type, filteredList);
			}
		}, error: function(xhr, status, error){
			console.log(xhr);
			console.log(status);
			console.log(error);
		}, dataType: "json"});
	}
};

