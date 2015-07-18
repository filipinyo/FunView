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

    for(var i = 0; i < parsedVideos.length; i++){
        var shortName = fileNameShortener(parsedVideos[i].name);
        $('.video-page').append("<li class='file-wrapper file-video' data-file-path='" + parsedVideos[i].path.replace(/'/g, "&#39;") + "' ><div class='video-file'></div><ul class='file-info'><li class='file-name'>" + shortName
        + "</li><li class='file-extension'>" + parsedVideos[i].extension + "</li><li class='file-id'>" + parsedVideos[i].id + "</li></ul></li>");
    }
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

/*=================================================
=            REMOTE CONTROL'S COMMANDS            =
=================================================*/

// ACTIONST THAT ARE EXECUTED ON FRONT-APP WHEN WE PRESS BUTTONS ON REMOTE/PHONE


socket.on('mediaCommand', function (command) {
    command = JSON.parse(command);
    var currentIndex;
    var currentSelectedMenu = $('.selected').attr('id');
    var currentlyDisplayedFiles = "";

    //IF VIDEO IS BEING PLAYED, DARKEN THE BACKGROUND
    if(command.lights === "lightsOut"){
        $('.lights').addClass('lights-out');
    }

    if(command.lights === "lightsOn"){
        $('.lights').removeClass('lights-out');
    }

    //CHECK WHICH CONTENT IS BEING DISPLAYED
    switch(currentSelectedMenu){
        case "video-item":
            currentlyDisplayedFiles = ".file-video";
            break;
        case "photo-item":
            currentlyDisplayedFiles = ".file-photo";
            break;
        case "music-item":
            currentlyDisplayedFiles = ".file-music";
            break;
        case "browser-item":
            currentlyDisplayedFiles = ".file-video";
            break;
        case "settings-item":
            currentlyDisplayedFiles = ".usb-device";
            break;
    }

    /*==========  WHEN WE CHANGE MENU  ==========*/

    if(command.activeMenu != null) {

        //IF LIGHTBOX FOR PHOTOS IS OPENED CLOSE IT!
        if($('#lightboxOverlay').css('display') === "block")
        $('a[class="lb-close"]').click();

        $('li.usb-device.btn-selected').removeClass('highlight');   //WHEN YOU SELECT OTHER MENU, BE SURE THAT USB DEVICE IS NOT HIGHLIGHTED OR CLICK WON'T WORK - SIMPLY -> YOU CAN'T LOAD ONE USB TWICE
        $('.menu-item:eq(' + command.activeMenu + ')').trigger("click");
        $(currentlyDisplayedFiles).removeClass('highlight');    //DEFAULT HIGHLIGHTED ITEM WHEN YOU CHANGE MENU IS ALWAYS GONNA BE FIRST ONE AT THE TOP
        $(currentlyDisplayedFiles).eq(0).addClass('highlight');
        $('.content-wrapper').scrollTop(0);
        //$(currentlyDisplayedFiles).eq(0).addClass('highlight');
    } if (command.select == true) {

        if(!($('li.usb-device.highlight').hasClass('btn-selected'))){  //IF HIGHLIGHTED ITEM IS NOT USB DEVICE OR ALREADY SELECTED = TRIGGER CLICK                                                                                     /*IF WE CLICK ON ITEM CHANGE THE LAYOUT OF REMOTE (MOBILE PHONE)*/
            $(currentlyDisplayedFiles +'.highlight').trigger("click");
        }    

        //THIS WAS HARDEST THING FOR ME SO BE GENTLE! :D
        //GET URL PATH OF THE PHOTO AND TRIGGER CLICK ONLY ON THE <a> ELEMENT WITH THAT URL
        if(currentlyDisplayedFiles === ".file-photo"){
            var pictureURL = $(currentlyDisplayedFiles +'.highlight').attr('data-file-path');
            $("a[href='" + pictureURL + "']").click(); 
        }

        if(currentlyDisplayedFiles === ".file-music"){
            var musicURL = $(currentlyDisplayedFiles +'.highlight').attr('data-file-path');
            $("li[data-file-path='" + musicURL + "']").click(); 
        }

        if(currentlyDisplayedFiles === ".file-video"){
            var videoURL = $(currentlyDisplayedFiles +'.highlight').attr('data-file-path');
            $("li[data-file-path='" + videoURL + "']").click(); 
        }

    } if (command.move != null){

        /*==========  REMOTE CONTROL'S MOVEMENT  ==========*/
        /**
        * If directional button was pressed from the controller (mobile phone), select the
        * appropriate item on the app.
        *
        * Here we define how our front-app behaves dependently on the pressed direction it recieves
        * from the controler. If we have selected ".usb-device" menu, only up and down button on thePlaying
        * controler will work, otherwise left and right buttons will work when we will browse
        * throught the content
        *
        **/
        
        switch (command.move){            
            case "right":
                if(currentlyDisplayedFiles !== ".usb-device"){
                    currentIndex = $(currentlyDisplayedFiles +'.highlight').index();
                    $(currentlyDisplayedFiles).removeClass('highlight');
                    $(currentlyDisplayedFiles).eq(currentIndex).addClass('highlight');
                }

                if($('#lightboxOverlay').css('display') === "block"){
                    $('a[class="lb-next"]').click();
                }

                break;

            case "left":
                if(currentlyDisplayedFiles !== ".usb-device"){
                    currentIndex = $(currentlyDisplayedFiles +'.highlight').index();
                    $(currentlyDisplayedFiles).removeClass('highlight');
                    $(currentlyDisplayedFiles).eq(currentIndex - 2).addClass('highlight');
                }

                if($('#lightboxOverlay').css('display') === "block"){
                    $('a[class="lb-prev"]').click();
                }
 
                break;

            case "up":
                if(currentlyDisplayedFiles !== ".usb-device"){
                    currentIndex = $(currentlyDisplayedFiles +'.highlight').index();
                    $(currentlyDisplayedFiles).removeClass('highlight');
                    $(currentlyDisplayedFiles).eq(currentIndex - 4).addClass('highlight');
                } else {
                    currentIndex = $(currentlyDisplayedFiles +'.highlight').index();
                    $(currentlyDisplayedFiles).removeClass('highlight');
                    $(currentlyDisplayedFiles).eq(currentIndex - 1).addClass('highlight');
                }
                break;

            case "down":
                if(currentlyDisplayedFiles !== ".usb-device"){
                    currentIndex = $(currentlyDisplayedFiles +'.highlight').index();
                    $(currentlyDisplayedFiles).removeClass('highlight');
                    $(currentlyDisplayedFiles).eq(currentIndex + 2).addClass('highlight');
                } else {
                    currentIndex = $(currentlyDisplayedFiles +'.highlight').index();
                    $(currentlyDisplayedFiles).removeClass('highlight');
                    $(currentlyDisplayedFiles).eq(currentIndex + 1).addClass('highlight');
                }    
                break;
        }

        /*==========  SCROLL TO HIGHLIGHTED FILE  ==========*/

        if(!($('li' + currentlyDisplayedFiles + '.highlight').visible())){  //IF FILE IS NOT VISIBLE, SCROLL TO IT
            var highlightedItemIndex = $('li' + currentlyDisplayedFiles + '.highlight').index();
            $('.content-wrapper').scrollTo($(currentlyDisplayedFiles).eq(highlightedItemIndex-1)/*, {duration: 350}*/);
        }
    } if(command.action !== null) {
        switch(command.action){

            case "refresh":
                location.reload(true);
                break;

            case "close":
                switch(currentSelectedMenu){

                    case "video-item":

                        break;

                    case "photo-item":
                        $('a[class="lb-close"]').click();
                        socket.emit('closePhoto','close-it');
                        break;

                    case "music-item":

                        break;

                }
                break;    
        }

    }
});

function fileNameShortener(name){   /*SHORTEN FILE'S NAMES ON APPS FRONTEND*/
    if(name.length > 18){
        name = name.slice(0,18) + "...";
    }
    return name
}