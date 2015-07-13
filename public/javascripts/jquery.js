/*THIS FILE INCLUDES SOCKET.IO COMBINED WITH INTERACTIONS/jQuery EVENTS*/
$(document).ready(function(){
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
        var videoName = $(this).attr("data-file-path");
        socket.emit("playVideo", videoName);
    });

    $('.music-page').on("click",".file-wrapper", function(){
        var musicName = $(this).attr("data-file-path");
        socket.emit("playMusic", musicName);
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
        var usbName = $(this).text();
        $('.file-wrapper').remove(); /*remove previous content*/
        $('.btn-block').removeClass('btn-selected');
        $(this).addClass('btn-selected');
        socket.emit('usbSelected', usbName);
    });
});




