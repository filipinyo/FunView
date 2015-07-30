//CAROUSEL OBJECT - MAIN MENU SLIDER ON REMOTE WEBSITE - FOR MOBILE PHONES
var carousel;
$(document).ready(function () {
    var socket = io.connect('http://' + utilities.localIPAdress + ':3000');    //CONNECT TO THE ADDRESS WHERE NODE IS RUNNING
    carousel = $("#menu");  //ID OF DIV THAT CONTAINS ITEMSLIDE CAROUSEL -  WE ASSIGN IT TO VARIABLE TO USE IT
    var mediaChannel;
    var lastTouchTime = 0;   //THE LAST TIME WE TOUCHED THE REMOTE'S SCREEN
    var allowedIdleTime = 20000; //TIME THAT IS ALLOWED TO PASS BEFORE WE KILL THE SOCKET. NECESSARY ON RECONNECTION OF REMOTE TO SERVER.

    $('body').on('click', function(){   //ON BUTTON CLICK, CHECK IF SOCKET IS CONNECTED, IF IT ISN'T RECONNECT IT
        checkConnection();
    });

    setInterval(function() { //CHECK IF USER WAS ACTIVE ON REMOTE IN LAST 20 SECONDS - IF HE WASN'T, KILL EXSISTING SOCKET AND CREATE NEW ONE
        var now = new Date().getTime();
        if ((now + lastTouchTime) > allowedIdleTime + now) {
            socket.disconnect();
        }
        lastTouchTime = lastTouchTime + 3000;
    }, 3000); 


    carousel.itemslide({    //SET THE STARTING MENU OF REMOTE CONTROL - CURRENTLY SET TO MUSIC
        start: 4,
        duration: 500
    });

    $(window).resize(function () {  //WHEN WE RESIZE THE WINDOW, WE ALSO RELOAD THE CAROUSEL
        carousel.reload();
    });

    var cw = $('li').width();           //FOR MAKING CAROUSEL BUTTONS SQUARE SHAPES - WE ASSIGN SAME HEIGHT TO THE BUTTON AS WE HAVE A WIDTH
    $('li').css({'height':cw+'px'});

    var remoteButtonWidth = $('.button').width();               //FOR KEEPING THE WIDTH AND HEIGHT OF THE SELECTION BUTTONS AND ROWS THE SAME SIZE
    $('.button').css({'height':remoteButtonWidth + 'px'});
    $('.button-row').css({'height':remoteButtonWidth + 'px'});

    var remoteButtonMargin = $('.button').css('margin-left');   // FOR MARGIN BETWEEN BUTTON ROWS IN TOUCH AREA - STILL NOT WORKING!
    $('.button-row').css({'margin-bottom': + remoteButtonMargin + 'px'});

    var touchAreaHeight = $('#container').height(); // FOR CALCULATING THE HEIGHT/SIZE OF THE AREA THAT IS TOUCHABLE - SELECTION BUTTONS
    var menuHeight = $('#menu').height();
    $('#touch-area').css({'height':touchAreaHeight - menuHeight + 'px'});

    socket.on('connect', function(){    // SEND SIGNAL THAT WE HAVE CONNECTED TO THE APP - ASSIGN DEFAULT MENU TO MUSIC
        var command = {};
        command.activeMenu = carousel.getActiveIndex();
        socket.emit('remoteCommand', JSON.stringify(command));
    });

    carousel.on('changeActiveIndex',function(){ // WHEN WE TOUCH MENU CAROUSEL WE SEND THE COMMAND TO THE APPLICATION TO CHANGE SELECTED MENU
        checkConnection();
        var command = {};
        command.activeMenu = carousel.getActiveIndex();
        mediaChannel = currentActiveMenu(command.activeMenu); //GLOBAL VARIABLE WHICH SWITCHES CHANNELS OF SENDING THE COMMANDS
        socket.emit('remoteCommand', JSON.stringify(command));
        //CLOSE VIDEO/PHOTO/MUSIC AND SET THE LAYOUT OF CONTROLLER TO NORMAL
        /*socket.emit('playVideo', 'stop');
        socket.emit('playMusic', 'stop');
        $('.controls').addClass('hidden');
        $('#normal-controls').removeClass('hidden');*/
    });

    socket.on('changeRemoteLayout', function(data){
        switch(data){
            case "video":
                $('.controls').addClass('hidden');
                $('#video-controls').removeClass('hidden');
                break;
            case "photo":
                $('.controls').addClass('hidden');
                $('#photo-controls').removeClass('hidden');
                break;
            case "music":
                $('.controls').addClass('hidden');
                $('#music-controls').removeClass('hidden');
                break;
            case "browser":
                $('.controls').addClass('hidden');
                $('#youtube-controls').removeClass('hidden');
                break;
            case "drives":
                $('.controls').addClass('hidden');
                $('#normal-controls').removeClass('hidden');
                break;
            case "normal":
                $('.controls').addClass('hidden');
                $('#normal-controls').removeClass('hidden');
                break;    
        }
    });

    //MOVEMENT ON REMOTE

    $('.button-row').on('click','#ok-button', function(){       //OK-PLAY
        var command = {};
        command.select = true;
        socket.emit('remoteCommand', JSON.stringify(command));
    });

    $('.button-row').on('click','#refresh-button', function(){  //REFRESH
        var command = {};
        command.action = "refresh";
        socket.emit('remoteCommand', JSON.stringify(command));
    });

    $('.button-row').on('click','#close-button', function(){    //CLOSE
        var command = {};
        command.action = "close";
        socket.emit('remoteCommand', JSON.stringify(command));
    });

    $('.button-row').on('click','#shut-down-button', function(){    //CLOSE
        var command = "shutDown";
        if(confirm("Are you sure you want to shutdown?")){
            socket.emit('shutDown', command);
        }
    });

    $('.button-row').on('click','#right-button', function(){    //MOVE RIGHT
        var command = {};
        command.move = "right";
        socket.emit('remoteCommand', JSON.stringify(command));
    });

    $('.button-row').on('click','#left-button', function(){     //MOVE LEFT
        var command = {};
        command.move = "left";
        socket.emit('remoteCommand', JSON.stringify(command));
    });

    $('.button-row').on('click','#up-button', function(){       //MOVE UP
        var command = {};
        command.move = "up";
        socket.emit('remoteCommand', JSON.stringify(command));
    });

    $('.button-row').on('click','#down-button', function(){     //MOVE DOWN
        var command = {};
        command.move = "down";
        socket.emit('remoteCommand', JSON.stringify(command));
    });

    //VIDEO/MUSIC CONTROLS

    $('.button-row').on('click','#play-button', function(){       //OK-PLAY
        var video = {};
        video.command = "play";
        socket.emit(mediaChannel, JSON.stringify(video));
    });
    
    $('.button-row').on('click','#pause-button', function(){      //PAUSE
        var video = {};
        video.command = "pause";
        socket.emit(mediaChannel, JSON.stringify(video));
    });

    $('.button-row').on('click','#stop-button', function(){       //STOP
        var video = {};
        video.command = "stop";
        socket.emit(mediaChannel, JSON.stringify(video));
    });

    $('.button-row').on('click','#fast-left-button', function(){       //FAST BACKWARD
        var video = {};
        video.command = "seekBackward";
        socket.emit(mediaChannel, JSON.stringify(video));
    });

    $('.button-row').on('click','#fast-right-button', function(){       //FAST FORWARD
        var video = {};
        video.command = "seekForward";
        socket.emit(mediaChannel, JSON.stringify(video));
    });

    $('.button-row').on('click','#subtitles-button', function(){       //TOGGLE SUBTITLES
        var video = {};
        video.command = "toggleSubtitles";
        socket.emit(mediaChannel, JSON.stringify(video));
    });

    $('.button-row').on('click','#volume-up-button', function(){       //VOLUME UP
        var video = {};
        video.command = "increaseVolume";
        socket.emit(mediaChannel, JSON.stringify(video));
    });

    $('.button-row').on('click','#volume-down-button', function(){       //VOLUME DOWN
        var video = {};
        video.command = "decreaseVolume";
        socket.emit(mediaChannel, JSON.stringify(video));
    });

    $('.button-row').on('click','#subtitles-reduce-delay-button', function(){       //REDUCE SUBTITLE DELAY
        var video = {};
        video.command = "reduceSubtitleDelay";
        socket.emit(mediaChannel, JSON.stringify(video));
    });

    $('.button-row').on('click','#subtitles-increase-delay-button', function(){       //INCREASE SUBTITLE DELAY
        var video = {};
        video.command = "increaseSubtitleDelay";
        socket.emit(mediaChannel, JSON.stringify(video));
    });

    $('.button-row').on('click','#subtitles-next-button.button', function(){       //LOAD NEXT SUBTITLES
        var video = {};
        video.command = "nextSubtitleStream";
        socket.emit(mediaChannel, JSON.stringify(video));
    });

    $('.button-row').on('click','#subtitles-prev-button.button', function(){       //LOAD PREVIOUS SUBTITLES
        var video = {};
        video.command = "previousSubtitleStream";
        socket.emit(mediaChannel, JSON.stringify(video));
    });

    //ACTIVE INDEX
    
    function currentActiveMenu(activeIndex){
        switch(activeIndex){
            case 0:
                return "playVideo";
                break;

            case 2:
                return "playMusic";
                break; 
        }
    }

    function checkConnection(){
        lastTouchTime = 0;
        if(socket.connected === false){
            socket = io.connect('http://' + utilities.localIPAdress + ':3000', {forceNew: true}); 
            console.log('Reconnecting to server');
        }
    }
});