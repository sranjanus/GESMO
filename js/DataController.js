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
			if(searchQuery.filterName == null){
				var list = result[searchQuery.type];
				list.sort(function(a, b){
					var aname = a.name.toUpperCase();
					var bname = b.name.toUpperCase();
					if(aname < bname) return -1;
				    if(aname > bname) return 1;
				    return 0;
				});
			    onSuccess(searchQuery.type, list);
			} else{
				var filteredList = [];
				result[searchQuery.type].forEach(function(item){
					if(item[searchQuery.filterName] == searchQuery.filterValue){
						filteredList.push(item);
					}
				}.bind(this));

				filteredList.sort(function(a, b){
					var aname = a.name.toUpperCase();
					var bname = b.name.toUpperCase();
					if(aname < bname) return -1;
				    if(aname > bname) return 1;
				    return 0;
				});

				onSuccess(searchQuery.type, filteredList);
			}
		}, error: function(xhr, status, error){
			console.log(xhr);
			console.log(status);
			console.log(error);
		}, dataType: "json"});
	}
};

