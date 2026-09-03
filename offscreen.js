const socket=io("http://localhost:3000");
let currsong,isplay=false;
let audioplayer;

socket.on("play song",(data)=>{
    isplay=true;
    audio(data.x1,data.y1);
})
socket.on("pause song",(data)=>{
    isplay= true;
    if(audioplayer){
        audioplayer.pause();
    }
});
async function audio(videoid,time){
    if(videoid!=currsong){
        document.body.innerHTML=`<audio id="audio-player" autoplay><source src="http://localhost:3000/api/playsong?v=${videoid}"></audio>`;
        currsong=videoid;
        audioplayer=document.getElementById("audio-player");
        if(time>0){
            audioplayer.currentTime=time;
        }
        audioplayer.addEventListener("play",()=>{
            if(isplay){
                isplay=false;
                return;
            }
            socket.emit("play song",videoid,audioplayer.currentTime);
        });
        audioplayer.addEventListener("pause",()=>{
            if(isplay){
                isplay=false;
                return;
            }
            socket.emit("pause song",videoid,audioplayer.currentTime);
        });
        audioplayer.addEventListener("seeking",()=>{
            if(isplay){
                isplay=false;
                return;
            }
            socket.emit("play song",videoid,audioplayer.currentTime);
        });
    }else{
        isplay=true;
        audioplayer.currentTime=time;
        if(audioplayer.paused){
            audioplayer.play();
        }
    }
}
chrome.runtime.onMessage.addListener((msg)=>{
    if(msg.target!=="offscreen"){
        return;
    }
    if(msg.type==="JOIN_ROOM"){
        socket.emit("join room",msg.room);
    }
    if(msg.type==="PLAY_SONG"){ 
        isplay=false;
        audio(msg.videoId,0);
    }
});