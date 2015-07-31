var socket = io('http://' + config.localIPAdress + ':3000', {reconnectionDelayMax: 3000, reconnection: true});

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
		console.log(response);
		$.each(results.items, function(index, item){
			$('#videos').append(
				"<li class='video'><iframe src=https://www.youtube.com/embed/" + item.id.videoId + " frameborder='0' data-video-name='" + item.snippet.title + "' data-video-url='https://www.youtube.com/watch?v=" + item.id.videoId + "' allowfullscreen></iframe><div class='download-bar'><p>Downloads and status</p><ul class='download-buttons'><li class='download-video button'></li><li class='download-song button'></li><li class='status-button button'></li></ul></div></li>");
		});
	});

});

function init(){

	gapi.client.setApiKey(config.youtubeAPI);
	gapi.client.load("youtube", "v3", function(){
		//Youtube api is ready!
	});
}

$('#videos').on('click','.download-video', function(){
	$(this).siblings('.status-button').addClass('rotate');
	var videoInfo = {};
	videoInfo.url = $(this).parent().parent().parent('.video').children('iframe').attr('data-video-url');
	videoInfo.name = $(this).parent().parent().parent('.video').children('iframe').attr('data-video-name');
	//var urlVideo = $('iframe').attr('src');
	socket.emit("youtubeDownloadVideo", JSON.stringify(videoInfo));
});

$('#videos').on('click','.download-song', function(){
	$(this).siblings('.status-button').addClass('rotate');
	var videoInfo = {};
	videoInfo.url = $(this).parent().parent().parent('.video').children('iframe').attr('data-video-url');
	videoInfo.name = $(this).parent().parent().parent('.video').children('iframe').attr('data-video-name');
	//var urlVideo = $('iframe').attr('src');
	socket.emit("youtubeDownloadSong", JSON.stringify(videoInfo));
});

socket.on("youtubeDownloadFinish", function(videoInfo){
	videoInfo = JSON.parse(videoInfo);
	$('.video').has("iframe[data-video-url='" + videoInfo.url +  "']").find('.status-button').removeClass('rotate').addClass('finishedDownloading');
});

socket.on("warning", function(data){
	data = JSON.parse(data);
	$('.video').has("iframe[data-video-url='" + data.url +  "']").find('.status-button').removeClass('rotate')
	alert(data.warning);
});

if(config.youtubeAPI === null || config.youtubeAPI === undefined || config.youtubeAPI === ""){
	$('#videos').append("<p class='alert alert-info'>If you want to download youtube videos/music, you have to insert your youtube api key in the settings! If you want to, but don't know how to obtain your youtube API, <a href='https://www.youtube.com/watch?v=Im69kzhpR3I'>you can watch this guide</a>!</p>")
}
