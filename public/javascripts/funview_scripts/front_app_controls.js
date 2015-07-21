/*=================================================
=            REMOTE CONTROL'S COMMANDS            =
=================================================*/

// ACTIONST THAT ARE EXECUTED ON FRONT-APP WHEN WE PRESS BUTTONS ON REMOTE/PHONE

var socket = io.connect('http://127.0.0.1:3000');

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

            //IF ONE OF THE LAST FILES IS HIGHLIGHTED, LOAD MORE FILES    
            var indexOfCurrentyHighlightedItem = $(currentlyDisplayedFiles +'.highlight').index();    
            if(indexOfCurrentyHighlightedItem >= videoMaxAllowedFiles - 60 && videoFilesLoaded === true){
                loadFiles(parsedVideos, videoLastAddedFile, videoMaxAllowedFiles, videoHtmlPage, videoHtmlFileType, videoHtmlClass);
            }
            break;
        case "photo-item":
            currentlyDisplayedFiles = ".file-photo";

            var indexOfCurrentyHighlightedItem = $(currentlyDisplayedFiles +'.highlight').index();    
            if(indexOfCurrentyHighlightedItem >= photoMaxAllowedFiles - 60 && photoFilesLoaded === true){
                loadFiles(parsedPhotos, photoLastAddedFile, photoMaxAllowedFiles, photoHtmlPage, photoHtmlFileType, photoHtmlClass);
            }
            break;
        case "music-item":
            currentlyDisplayedFiles = ".file-music";

            var indexOfCurrentyHighlightedItem = $(currentlyDisplayedFiles +'.highlight').index();    
            if(indexOfCurrentyHighlightedItem >= musicMaxAllowedFiles - 60 && photoFilesLoaded === true){
                loadFiles(parsedMusic, musicLastAddedFile, musicMaxAllowedFiles, musicHtmlPage, musicHtmlFileType, musicHtmlClass);
            }
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


    /*FOR HOVERING*/
    /*
    * When you hover over main menu, highlight it, If you click it, assign a border to it.
    * */
    
    $('.menu-item').hover(
        function(){
            $(this).addClass("highlight");
        },
        function(){
            $(this).removeClass("highlight");
    });

    /*HOVERING ITEMS ON CONTENT PAGE*/

    $('.content-data').on("mouseenter",".file-wrapper", function(){
       $(this).addClass("highlight").mouseleave(function(){
           $(this).removeClass("highlight");
       });
    });

    /*SELECTING ITEMS ON CONTENT PAGE*/
    /*$('.photo-page').on("click",".file-wrapper", function(){
        $(this).attr("data-lightbox","pictures");
    });*/

    $('.video-page').on("click",".file-wrapper", function(){
        var video = {}; 
        video.name = $(this).attr("data-file-path");
        socket.emit("playVideo", JSON.stringify(video));
    });

    $('.music-page').on("click",".file-wrapper", function(){
        var music = {};
        music.name = $(this).attr("data-file-path");
        socket.emit("playMusic", JSON.stringify(music));
    });

    $('.photo-page').on("click",".file-wrapper", function(){
        socket.emit("showPhoto", "do-it");
    });


    /*ON CLICK*/
    /*
    * On click reveal the content of the page
    * */

    $('.menu-item').click(function(){
        $('.menu-item').removeClass('selected');
        $(this).addClass('selected');

        var name = $(this).attr('id');

        switch(name){
            case 'video-item':
                $('.content-item').addClass('hidden');
                $('#video-content').removeClass('hidden');
                break;
            case 'photo-item':
                $('.content-item').addClass('hidden');
                $('#photo-content').removeClass('hidden');
                break;
            case 'music-item':
                $('.content-item').addClass('hidden');
                $('#music-content').removeClass('hidden');
                break;
            case 'games-item':
                $('.content-item').addClass('hidden');
                $('#games-content').removeClass('hidden');
                break;
            case 'browser-item':
                $('.content-item').addClass('hidden');
                $('#browser-content').removeClass('hidden');
                break;
            case 'settings-item':
                $('.content-item').addClass('hidden');
                $('#settings-content').removeClass('hidden');
                break;
        }
    });

    /*TABLE SCROLL*/
    /*
    * Add styled scroll bar to the selected content
    * */

    $('.enable-scroll').slimScroll({
        height: '100%',
        width: '100%'
    });

    /*USB SELECTION*/
    /*
    * "usbName" saves the name of selected USB device
    * highlight the usb that is selected and send
    * name of the usb via "usbSelected" channel to the server
    * */

    $('.usb-devices').on('click','li', function(){
        if(!$('this').hasClass('btn-selected')){
           var usbName = $(this).text();
            $('.file-wrapper').remove(); /*remove previous content*/
            $('.btn-block').removeClass('btn-selected');
            $(this).addClass('btn-selected');
            socket.emit('usbSelected', usbName); 
        }
    });




