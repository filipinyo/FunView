$('form').on('submit', function(e){
	e.preventDefault();
	$('.video').remove();
	//PREPARE THE REQUEST
	var request = gapi.client.youtube.search.list({
			part: 'snippet',
			type: 'video',
			q: encodeURIComponent($('#search-bar').val()).replace(/%20/g, "+"),
			maxResults: 10,
			order: 'viewCount'
	});

	//EXECUTE REQUEST
	request.execute(function(response){
		var results = response.result;
		$.each(results.items, function(index, item){
			$('#videos').append("<li class='video' data-video-id=" + item.id.videoId + "><h1>" + item.snippet.title + "</h1></li>")
		});
	});

});

function init(){

	gapi.client.setApiKey("AIzaSyBiuwKPz9V3Ee9hwXl7LROVZ4rEllDMc9E");
	gapi.client.load("youtube", "v3", function(){
		//Youtube api is ready!
	});
}
