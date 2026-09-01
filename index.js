const socket = io();
const searchsong = document.getElementById("search");
const results = document.getElementById("results");
const joinbtn = document.getElementById("join");
const roomspan = document.getElementById("room-id");
joinbtn.addEventListener("click",()=>{
    const roomname = document.getElementById("room_id").value.trim();
    if(roomname){
        roomspan.innerText = "Room Id: " + roomname;
        socket.emit("join room", roomname);
    }else{
        roomspan.innerText = "Room Id:";
    }
});

let roombtn=document.getElementById('roombtn');
let ispop=false,popup=document.getElementById('mypopup');
roombtn.addEventListener('click',()=>{
    if(!ispop){
        popup.style.display='block';
        ispop=true;
        //socket.emit("active users");
    }else{
        popup.style.display='none';
        ispop=false;
    }
});
let currsong;

let isplay =false;
socket.on("play song",(data)=>{
    isplay =true;
    console.log(data.x1,data.y1,data);
    audio(data.x1,data.y1);
    isplay= false;
});

async function audio(videoid,time){
    if(videoid!==currsong){
        document.getElementById("player").innerHTML = `
            <audio id="audio-player" controls autoplay style="width: 100%;">
            <source src="http://localhost:3000/api/playsong?v=${videoid}">
            Your browser does not support the audio element.
            </audio>
        `;
        currsong=videoid;
        const audioPlayer = document.getElementById("audio-player");
        if(!isplay){
            socket.emit("play song",videoid,audioPlayer.currentTime);
        }
        audioPlayer.addEventListener("seeked", () => {
            if(isplay) return;
            console.log("User skipped to:", audioPlayer.currentTime);
            socket.emit("play song", videoid, audioPlayer.currentTime);
        });
    }else{
        const audioPlayer =document.getElementById("audio-player");
        audioPlayer.currentTime=time;
    }
}
searchsong.addEventListener("keydown", async(event) => {
    if (event.key === "Enter" && searchsong.value.trim()){
        let x=await fetch(`http://localhost:3000/api/song?q=${encodeURIComponent(searchsong.value)}`);
        let data=await x.json();
        console.log(data);
        let i=10;
        document.getElementById("options").replaceChildren();
        data.forEach((item) => {
            if(i>=1){
                const option = document.createElement("div");
                option.innerHTML = `<div class="suggestion-item" data-value="${item.id.videoId}">
                    <p class="song">${item.snippet.title}</p><br>
                </div>`;
                option.addEventListener("click",()=>{
                    const videoid = item.id.videoId;
                    audio(videoid);
                });
                document.getElementById("options").appendChild(option);
                i--;
            }
        });
    }
});