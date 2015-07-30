$(document).ready(function() {
	//var socket = io.connect('http://' + config.localIPAdress + ':3000')
	var settings = {};
	$('.unconfirmed-button').on('click',function(){
		$('form').submit();
	});

	$('#youtubeAPI').on('focus',function(){
		$('.confirmed-button').removeClass('confirmed-button').addClass('unconfirmed-button');
	});

	$('form').submit(function(event) {
		event.preventDefault();
		settings = $('#youtubeAPI').val();
		socket.emit('changeSettings', settings);
		$('.unconfirmed-button').addClass('confirmed-button').removeClass('unconfirmed-button');
		window.location = '/youtube';
	});

});

