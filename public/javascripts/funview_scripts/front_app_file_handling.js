var socket = io.connect('http://127.0.0.1:3000');

/*PARSED DATA THAT YOU RECIEVE ON LOAD FROM USB EVENTS*/
var parsedVideos;
var parsedPhotos;
var parsedMusic;
var parsedGames;

var max = 50;

socket.on('connect', function(){

});

socket.on('usbAdd', function(data){ //ADD USB BUTTON WHEN USB HAS BEEN SUCCESSFULLY DETECTED ON SERVER
    //alert(data);
    var usb = data.toString();
    $('.usb-devices').append("<li class='btn btn-block btn-lg btn-default usb-device'><span class='button-text'>"+usb+"</span></li>");
});

socket.on('usbRemove', function(data){ //REMOVE USB BUTTON WHEN USB HAS BEEN SUCCESSFULLY REMOVED AND EMPTIES FILES
    var usb = data.toString();
    $('li:contains("' + usb + '")').remove();   //REMOVES USB FROM LIST
    $('li.file-wrapper').remove();  //REMOVE ALL FILES
});

socket.on('loadVideoData', function(videos){

    parsedVideos = JSON.parse(videos);

    var maxAllowed = 50;
    var currentlyLoaded = 0;
    var allFiles = parsedVideos.length;

    function dude(parsedVideos, currentlyLoaded, maxAllowed){
        if(maxAllowed >= allFiles){
            maxAllowed = allFiles;
        }

        for(currentlyLoaded; currentlyLoaded < maxAllowed; currentlyLoaded++){
            var shortName = fileNameShortener(parsedVideos[currentlyLoaded].name);
            $('.video-page').append("<li class='file-wrapper file-video' data-file-path='" + parsedVideos[currentlyLoaded].path.replace(/'/g, "&#39;") + "' ><div class='video-file'></div><ul class='file-info'><li class='file-name'>" + shortName
            + "</li><li class='file-extension'>" + parsedVideos[currentlyLoaded].extension + "</li><li class='file-id'>" + parsedVideos[currentlyLoaded].id + "</li></ul></li>");
        }

        currentlyLoaded = maxAllowed;        
    }

    dude(parsedVideos, currentlyLoaded, maxAllowed);

    $('.file-video').eq(0).addClass("highlight");
});

socket.on('loadPhotoData', function(photos){
    parsedPhotos = JSON.parse(photos);

    for(var i = 0; i < parsedPhotos.length; i++){
        var shortName = fileNameShortener(parsedPhotos[i].name);
        $('.photo-page').append("<li class='file-wrapper file-photo' data-file-path='" + parsedPhotos[i].path.replace(/'/g, "&#39;") + "' ><a href='"+parsedPhotos[i].path+"' data-lightbox='image-1'><div class='photo-file'></div><ul class='file-info'><li class='file-name'>" + shortName
        + "</li><li class='file-extension'>" + parsedPhotos[i].extension + "</li><li class='file-id'>" + parsedPhotos[i].id + "</li></ul></a></li>");
    }
    $('.file-photo').eq(0).addClass("highlight");
});

socket.on('loadMusicData', function(music){
    parsedMusic = JSON.parse(music);

    for(var i = 0; i < parsedMusic.length; i++){
        var shortName = fileNameShortener(parsedMusic[i].name);
        $('.music-page').append("<li class='file-wrapper file-music' data-file-path='" + parsedMusic[i].path.replace(/'/g, "&#39;") + "' ><div class='music-file'></div><ul class='file-info'><li class='file-name'>" + shortName
        + "</li><li class='file-extension'>" + parsedMusic[i].extension + "</li><li class='file-id'>" + parsedMusic[i].id + "</li></ul></li>");
    }
    $('.file-music').eq(0).addClass("highlight");
});

socket.on('loadGamesData', function(games){
    $('.file-wrapper').eq(0).addClass("highlight");
});


function fileNameShortener(name){   /*SHORTEN FILE'S NAMES ON APPS FRONTEND*/
    if(name.length > 18){
        name = name.slice(0,18) + "...";
    }
    return name
}

function loadContentToList (object) {
    
}