var socket = io.connect('http://' + config.localIPAdress + ':3000');    //CONNECT TO THE ADDRESS WHERE NODE IS RUNNING

var lastTouchTime = 0;   //THE LAST TIME WE TOUCHED THE REMOTE'S SCREEN
var allowedIdleTime = 20000; //TIME THAT IS ALLOWED TO PASS BEFORE WE KILL THE SOCKET. NECESSARY ON RECONNECTION OF REMOTE TO SERVER.

function checkConnection(){
    lastTouchTime = 0;
    if(socket.connected === false){
        socket = io.connect('http://' + config.localIPAdress + ':3000', {forceNew: true}); 
        console.log('Reconnecting to server');
    }
}

$(document).ready(function() {	

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
});