//CAROUSEL OBJECT - MAIN MENU SLIDER ON REMOTE WEBSITE - FOR MOBILE PHONES
var carousel;
$(document).ready(function () {
    var socket = io.connect('http://' + utilities.localIPAdress + ':3000');    //CONNECT TO THE ADDRESS WHERE NODE IS RUNNING
    carousel = $("#menu");  //ID OF DIV THAT CONTAINS ITEMSLIDE CAROUSEL -  WE ASSIGN IT TO VARIABLE TO USE IT

    carousel.itemslide({    //SET THE STARTING MENU OF REMOTE CONTROL - CURRENTLY SET TO MUSIC
        start: 5,
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
        var command = {};
        command.activeMenu = carousel.getActiveIndex();
        socket.emit('remoteCommand', JSON.stringify(command));
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
                $('#video-controls').removeClass('hidden');
                break;
            case "browser":
                $('.controls').addClass('hidden');
                $('#youtube-controls').removeClass('hidden');
                break;
            case "drives":
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
        command.selectedCategory = remoteLayoutType;
        socket.emit('remoteCommand', JSON.stringify(command));
    });

    $('.button-row').on('click','#close-button', function(){    //CLOSE
        var command = {};
        command.action = "close";
        socket.emit('remoteCommand', JSON.stringify(command));
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

    //VIDEO CONTROLS

    /*$('.button-row').on('click','#play-button', function(){       //OK-PLAY
        var command = {};
        command.select = true;
        socket.emit('playVideo', JSON.stringify(command));
    });*/
    
    $('.button-row').on('click','#pause-button', function(){       //OK-PLAY
        var video = {};
        video.command = "pause";
        socket.emit('playVideo', JSON.stringify(video));
    });

});