$(document).ready(function() {
	var socket = io.connect('http://' + config.localIPAdress + ':3000')
	var settings = {};
	$('.confirm-button').on('click',function(){
		$('form').submit();
	});

	$('form').submit(function(event) {
		event.preventDefault();
		settings = $('#youtubeAPI').val();
		socket.emit('changeSettings', settings);
	});

});

