/*
                       THIS IS THE CORE BACKEND FILE
    FILE FOR EMITTING EVENTS TO FUN-VIEW WEBSITE AND HANDLING USB DEVICES
 */

/*
* "usbDevices" = Currently connected usb devices
* "usbSelected" = Path name of the device that has been clicked on the "front page"
* */
var sockets = {};
//FOR CHECKING USB DEVICES
var chokidar = require('chokidar');
var recursive = require('recursive-readdir');
var path = require('path');
var fs = require('fs');
var exec = require('child_process').exec; /*EXECUTE SHELL COMMANDS*/
var omx = require('omx-manager'); //MODULE FOR CONTROLLING OMX PLAYER
var localIPAdress = require('address').ip(); //MODULE USED FOR UTILITIES - WE USE IT FOR GETTING OUR LOCAL IP ADDRESS
var currentUser = "" /*process.env.USER;*/ //CHECK WHICH USER IS RUNNING NODE - WE'RE USING HIS MEDIA FOLDER TO LOOK FOR USB DEVICES :)
var usbDevices = [];
var usbSelected = "";
var utilities = {}; //OBJECT USED FOR SAVING STUFF TO READ ON WEB - EXAMPLE WE SAVE OUR LOCAL ADDRESS SO SOCKETS CAN CONNECT TO SERVER
var ytdl = require('ytdl-core'); //YOUTUBE DOWNLOADER


console.log(localIPAdress);
utilities.localIPAdress = localIPAdress;

fs.writeFileSync("./public/javascripts/funview_scripts/config.js", "var utilities = " + JSON.stringify(utilities) + ";");

//ALLOWED EXTENSIONS
/*
* Extensions that we are looking for on usb devices
* */

var usbVideoExtensions = ['.mpeg','.avi','.mp4','.ogm','.ogv'];
var usbPhotosExtensions = ['.png','.jpeg','.jpg'];
var usbMusicExtensions = ['.mp3'];
var usbGameExtensions = ['.nes','.smc','.gen','.gb','.gbc','.gba'];

//SAVE PATHS OF VIDEOS,PHOTOS,SONGS.. TO THESE ARRAYS
/*
* Arrays with stored path names and filenames located on usb device.
* "usbNumberOfFiles" = total number of files on the usb device
* */

var usbVideos = [];
var usbPhotos = [];
var usbMusic = [];
var usbGames = [];

var usbNumberOfFiles;

/*
* Function that adds socket.io to the server
*
* on('connection') we check if we already have a usb plugged in to our device,
* if we have it, we emit it to the front page - which will display it under the usb devices tab.
*
* on('usbSelected') we receive data about the device that has been selected on front page (data contains path of our USB),
*
* recursive scans the selected device and saves the file which match our predefined "extensions" to the arrays. Files
* are saved based on the extension
* */

sockets.init = function (server) {
    // socket.io setup
    io = require('socket.io').listen(server);

    io.sockets.on('connection', function (socket) {
        for(var i = 0; i < usbDevices.length; i++) {
            io.sockets.connected[socket.id].emit('usbAdd', usbDevices[i]);
        }

        /*WHEN USER SELECTS USB ON FRONT PAGE - load data into table on the front page*/
        socket.on('usbSelected', function(dat){
            /*IF OTHER USB HAS BEEN SELECTED, EMPTY THE ARRAY AND CONTENT LISTS BEFORE FILLING IT WITH NEW DATA*/

            usbVideos = [];
            usbPhotos = [];
            usbMusic = [];
            usbGames = [];

            io.sockets.emit('resetVars', 'reset');

            usbSelected = data;

            console.log("USB " + usbSelected + " has been selected");

            /*SCAN USB FILES/DIRECTORIES RECURSIVELY*/
            recursive(usbSelected, function (err, files) {
                if(err){
                    throw err;
                } else {
                    usbNumberOfFiles = files.length; //TOTAL NUMBER OF FILES ON USB DEVICE

                    var fileName; //VARIABLE CONTAINS SPLIT STRING AT "/"
                    var fileExtension; //
                    var filePath; //FULL PATH
                    var filePathFirstPart = "/media/" + currentUser;
                    var fileId = 0;

                    for (var i = 0; i < usbNumberOfFiles; i++) {

                        if (usbVideoExtensions.indexOf(path.extname(files[i])) >= 0) { //CHECK IF ANY FILE MATCHES TO ALLOWED EXTENSION

                            fileId = fileId + 1;
                            filePath = files[i];                                                                        //SAVE WHOLE FILE PATH
                            fileExtension = files[i].split(".").pop();                                                  //GET FILE EXTENSION FROM FILE NAME
                            fileName = files[i].split("/").pop().split(".")[0];                                         //GET FILE NAME FROM WHOLE PATH

                            usbVideos.push({id: fileId, name: fileName, path: filePath, extension: fileExtension});     //SAVE IT TO "usbVideos" ARRAY

                        } else if (usbPhotosExtensions.indexOf(path.extname(files[i])) >= 0) {

                            fileId = fileId + 1;
                            //SAVE WHOLE FILE PATH
                            filePath = files[i];
                            //CREATE SHORT PATH
                            filePath = filePath.split(filePathFirstPart)[1]; //WE  INCLUDE SAVE SECOND PART AS A filePath - so we can use paths in photos.jade
                            fileExtension = files[i].split(".").pop();                                                  //GET FILE EXTENSION FROM FILE NAME
                            fileName = files[i].split("/").pop().split(".")[0];                                         //GET FILE NAME FROM WHOLE PATH
                            usbPhotos.push({id: fileId, name: fileName, path: filePath, extension: fileExtension});     //SAVE IT TO "usbVideos" ARRAY

                        } else if (usbMusicExtensions.indexOf(path.extname(files[i])) >= 0) {

                            fileId = fileId + 1;
                            filePath = files[i];                                                                        //SAVE WHOLE FILE PATH
                            fileExtension = files[i].split(".").pop();                                                  //GET FILE EXTENSION FROM FILE NAME
                            fileName = files[i].split("/").pop().split(".")[0];                                         //GET FILE NAME FROM WHOLE PATH
                            usbMusic.push({id: fileId, name: fileName, path: filePath, extension: fileExtension});      //SAVE IT TO "usbVideos" ARRAY

                        } else if (usbGameExtensions.indexOf(path.extname(files[i])) >= 0) {

                            fileId = fileId + 1;
                            filePath = files[i];                                                                        //SAVE WHOLE FILE PATH
                            fileExtension = files[i].split(".").pop();                                                  //GET FILE EXTENSION FROM FILE NAME
                            fileName = files[i].split("/").pop().split(".")[0];                                         //GET FILE NAME FROM WHOLE PATH
                            usbGames.push({id: fileId, name: fileName, path: filePath, extension: fileExtension});      //SAVE IT TO "usbVideos" ARRAY
                        }
                    }

                    /*SEND INFORMATION TO CLIENT ABOUT FILES AND THEIR TYPES*/
                    if(usbVideos != null){socket.emit('loadVideoData', JSON.stringify(usbVideos));}
                    if(usbPhotos != null){socket.emit('loadPhotoData', JSON.stringify(usbPhotos));}
                    if(usbMusic != null){socket.emit('loadMusicData', JSON.stringify(usbMusic));}
                    if(usbGames != null){socket.emit('loadGamesData', JSON.stringify(usbGames));}
                    
                }
            });
        });
        
        //IF VIDEO IS SELECTED, START PLAYING VIDEO
        socket.on("playVideo", function(video){
            video = JSON.parse(video);
            
            if(video.name !== null){
                try{
                    omx.play(video.name);
                    if(omx.isPlaying()){
                        var command = {};
                        console.log("Playing " + video.name);
                        command.lights = "lightsOut";
                        io.sockets.emit('mediaCommand', JSON.stringify(command));
                        io.sockets.emit('changeRemoteLayout', 'video');
                    }
                } catch (err){
                    console.log("There has been an error: " + err);
                }  
            }

            executeCommand(video);
        });

        //IF MUSIC IS SELECTED, START PLAYING MUSIC
        socket.on("playMusic", function(music){
            music = JSON.parse(music);
            
            if(music.name !== null){
                try {
                    omx.play(music.name);
                    if(omx.isPlaying()){
                        var command = {};
                        console.log("Playing " + music.name);
                        io.sockets.emit('changeRemoteLayout', 'music');
                    }
                } catch (err) {
                    console.log("There has been an error: " + err);
                }
            }

            executeCommand(music);
            /*exec("killall vlc", function(){
                exec("vlc --fullscreen " + '"' + data + '"');
            });*/
        });

        socket.on("showPhoto", function(photo){
            io.sockets.emit('changeRemoteLayout', 'photo');
        });

        socket.on("closePhoto", function(photo){
            io.sockets.emit('changeRemoteLayout', 'normal')
        });

        //RECIVE COMMAND FROM REMOTE
        socket.on("remoteCommand", function(command){
            command = JSON.parse(command);
            console.log(command + " command has been executed");
            io.sockets.emit("mediaCommand", JSON.stringify(command));
        });

        socket.on("youtubeDownloadVideo", function(videoInfo){
            if(usbSelected === ""){
                videoInfo = JSON.parse(videoInfo);
                console.log("User tried to download video, but usb was not loaded/selected!");
                videoInfo.warning = "Please mount and select usb device first!"
                socket.emit('warning', JSON.stringify(videoInfo));
            } else {
                videoInfo = JSON.parse(videoInfo);
                videoInfo.name = videoInfo.name.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
                console.log("Trying to download video " + videoInfo.name);
                try{
                    ytdl(videoInfo.url, {filter: function(format) { return format.container === 'mp4';}})
                    .pipe(fs.createWriteStream(usbSelected + "/" + videoInfo.name + ".mp4").addListener('finish', function(){
                        console.log("Finished downloading video!");
                        io.sockets.emit('youtubeDownloadFinish', JSON.stringify(videoInfo));
                    })
                    );
                } catch(err){
                    console.log('There has been an error when downloading video');
                }
            }
        });

        socket.on("youtubeDownloadSong", function(videoInfo){
            if(usbSelected === ""){
                videoInfo = JSON.parse(videoInfo);
                console.log("User tried to download video, but usb was not loaded/selected!");
                videoInfo.warning = "Please mount and select usb device first!"
                socket.emit('warning', JSON.stringify(videoInfo));
            } else {
                videoInfo = JSON.parse(videoInfo);
                videoInfo.name = videoInfo.name.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
                console.log("Trying to download song " + videoInfo.name);
                try{
                    ytdl(videoInfo.url, {filter: 'audioonly'})
                    .pipe(fs.createWriteStream(usbSelected + "/" + videoInfo.name + ".mp3").addListener('finish', function(){
                        console.log("Finished downloading song!");
                        io.sockets.emit('youtubeDownloadFinish', JSON.stringify(videoInfo));
                    })
                    );
                } catch(err){
                    console.log('There has been an error when downloading video' + err);
                }
            }
        });

        //socket.on("updateRemoteLayoutOnServer", function(remoteLayout){
        //    io.sockets.emit("updateRemoteLayoutOnMask", remoteLayout);
            /*switch(remoteLayout.type){
                case 'video':
                    omx.play(remoteLayout.file);
                    break;
            }*/
        //});
    });
};

/* CHECK FOR USB DEVICES IN /media/filip
* Scan the /media/<username> folder for newly added directories - usually added in usb "stick in"
* "currentUser" is the process variable - we save the username of the user who is running the server into the variable
* We give command "watch" to chokidar on folder of the user who is running the server
* ignored - not sure about the regex thing :D
* persistent - constantly watch the path!
* depth - detect only the directory - 0 - prevents recursive scan!
* */

var watcher = chokidar.watch('/media/' + currentUser, {
    ignored: /[\/\\]\./,
    persistent: true,
    depth: 0
});

var log = console.log.bind(console);

/*WHEN NEW DIRECTORY/USB IS DETECTED/PLUGGED IN THE DEVICE
* 'addDir' event scans recursively... we stop recursiveness when we find the first folder(usb) added to /media/<username>
* add path name of the device that has been added to "usbDevices" array,
* send what happened to the front page of app on channel "usbAdd"
* */

watcher.on('addDir', function(path) {
    if(path == '/media/' + currentUser){
        return true;
    } else {
        log('Directory', path, 'has been added');
        usbDevices.push(path.toString());
        io.sockets.emit('usbAdd', path);
    }
});

/*WHEN DIRECTORY/USB IS REMOVED FROM THE DEVICE
* indexOfRemovedUsb = index number of the usb that has been removed
* if usb device exsists - remove it from the usbDevices array
* send the event on front page on channel "usbRemove"
* */

watcher.on('unlinkDir', function(path) {
    /*if(path == '/media/' + currentUser){
        return true;
    } else {*/
        log('Directory', path, 'has been removed');
        var indexOfRemovedUsb = usbDevices.indexOf(path);
        if(indexOfRemovedUsb >= 0){
            usbDevices.splice(indexOfRemovedUsb,1);
        }
        io.sockets.emit('usbRemove', path);
   // }
});

function executeCommand(command){
    switch(command.command){
        case "play":
            if(!omx.isPlaying()){
                try{
                    omx.play();
                } catch (err) {
                    console.log("There has been an error: " + err);
                }
            }
            break;

        case "pause":
            omx.pause();
            break;

        case "stop":
            exec("kill $(ps aux | grep omxplayer | awk 'NR==1 {print $2}')");
            var command = {};
            command.lights = "lightsOn";
            io.sockets.emit('mediaCommand', JSON.stringify(command));
            io.sockets.emit('changeRemoteLayout', 'normal');
            omx.stop();
            break;

        case "seekForward":
            omx.seekForward();   
            break;

        case "seekBackward":
            omx.seekBackward();   
            break;

        case "toggleSubtitles":
            omx.toggleSubtitles();
            break;

        case "increaseVolume":
            omx.increaseVolume();
            break;

        case "decreaseVolume":
            omx.decreaseVolume();
            break;

        case "nextSubtitleStream":
            omx.nextSubtitleStream();
            break;    

        case "previousSubtitleStream":
            omx.previousSubtitleStream();
            break;   

        case "increaseSubtitleDelay":
            omx.increaseSubtitleDelay();
            break;   
                
        case "reduceSubtitleDelay":
            omx.decreaseSubtitleDelay();   
            break; 
                        
        default:
            break;

    }
}

module.exports = sockets;