var socket = io.connect('http://127.0.0.1:3000');

/*PARSED DATA THAT YOU RECIEVE ON LOAD FROM USB EVENTS*/
var parsedVideos;
var parsedPhotos;
var parsedMusic;
var parsedGames;

//loadFiles function global variables

//VIDEOS
var videoFilesLoaded = false;
var videoLastAddedFile = 0;
var videoMaxAllowedFiles = 50;
var videoHtmlPage = ".video-page";
var videoHtmlFileType = "file-video";
var videoHtmlClass = "video-file";

//PHOTOS
var photoFilesLoaded = false;
var photoLastAddedFile = 0;
var photoMaxAllowedFiles = 50;
var photoHtmlPage = ".photo-page";
var photoHtmlFileType = "file-photo";
var photoHtmlClass = "photo-file";

//MUSIC
var musicFilesLoaded = false
var musicLastAddedFile = 0;
var musicMaxAllowedFiles = 50;
var musicHtmlPage = ".music-page";
var musicHtmlFileType = "file-music";
var musicHtmlClass = "music-file";

socket.on('connect', function(){

});            

socket.on('resetVars', function(data){
    if(data === "reset"){
        videoFilesLoaded = false;
        photoFilesLoaded = false;
        musicFilesLoaded = false;

        videoLastAddedFile = 0;
        videoMaxAllowedFiles = 50;
        photoLastAddedFile = 0;
        photoMaxAllowedFiles = 50;
        musicLastAddedFile = 0;
        musicMaxAllowedFiles = 50;
    }
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
    var videoFilesLoaded = false;
    var photoFilesLoaded = false;
    var musicFilesLoaded = false
});

socket.on('loadVideoData', function(videos){
    parsedVideos = JSON.parse(videos);
    videoFilesLoaded = true;
    loadFiles(parsedVideos, videoLastAddedFile, videoMaxAllowedFiles, videoHtmlPage, videoHtmlFileType, videoHtmlClass);
    $('.file-video').eq(0).addClass("highlight");
});

socket.on('loadPhotoData', function(photos){
    parsedPhotos = JSON.parse(photos);
    photoFilesLoaded = true;
    loadFiles(parsedPhotos, photoLastAddedFile, photoMaxAllowedFiles, photoHtmlPage, photoHtmlFileType, photoHtmlClass);
    $('.file-photo').eq(0).addClass("highlight");
});

socket.on('loadMusicData', function(music){
    parsedMusic = JSON.parse(music);
    musicFilesLoaded = true;
    loadFiles(parsedMusic, musicLastAddedFile, musicMaxAllowedFiles, musicHtmlPage, musicHtmlFileType, musicHtmlClass);
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

//parsedFiles -> "parsedVideos" -> objects
//numberOfAllFiles -> "parsedVideos.length" -> integer
//lastAddedFileNUM -> var i -> integer
//maxAllowedFiles
//htmlPage = ".video-page";
//htmlFileType = "file-video";
//htmlClass = "video-file"

function loadFiles(parsedFiles, lastAddedFile, maxAllowedFiles, htmlPage, htmlFileType, htmlClass){

    var numberOfAllFiles = parsedFiles.length;

    if(maxAllowedFiles > numberOfAllFiles){
        maxAllowedFiles = numberOfAllFiles;
    }

    if(htmlPage === ".photo-page"){
        for(lastAddedFile; lastAddedFile < maxAllowedFiles; lastAddedFile++){
            var shortName = fileNameShortener(parsedFiles[lastAddedFile].name);
            $('.photo-page').append("<li class='file-wrapper file-photo' data-file-path='" + parsedFiles[lastAddedFile].path.replace(/'/g, "&#39;") + "' ><a href='"+parsedFiles[lastAddedFile].path+"' data-lightbox='image-1'><div class='photo-file'></div><ul class='file-info'><li class='file-name'>" + shortName
            + "</li><li class='file-extension'>" + parsedFiles[lastAddedFile].extension + "</li><li class='file-id'>" + parsedFiles[lastAddedFile].id + "</li></ul></a></li>");
        }
    } else {
        for(lastAddedFile; lastAddedFile < maxAllowedFiles; lastAddedFile++){
            var shortName = fileNameShortener(parsedFiles[lastAddedFile].name);
            $(htmlPage).append("<li class='file-wrapper " + htmlFileType + "'" + "data-file-path='" + parsedFiles[lastAddedFile].path.replace(/'/g, "&#39;") + "' ><div class='" + htmlClass + "'></div><ul class='file-info'><li class='file-name'>" + shortName
            + "</li><li class='file-extension'>" + parsedFiles[lastAddedFile].extension + "</li><li class='file-id'>" + parsedFiles[lastAddedFile].id + "</li></ul></li>");
        }
    }

    switch(htmlPage){
        case ".video-page":
            videoMaxAllowedFiles = videoMaxAllowedFiles + 50;
            videoLastAddedFile = lastAddedFile;
            break;
        
        case ".photo-page":
            photoMaxAllowedFiles = photoMaxAllowedFiles + 50;
            photoLastAddedFile = lastAddedFile;
            break;

        case ".music-page":
            musicMaxAllowedFiles = musicMaxAllowedFiles + 50;
            musicLastAddedFile = lastAddedFile;
            break;    
    }
}