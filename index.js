//const socket = io("http://localhost:3000");
const searchsong = document.getElementById("search");
//const results = document.getElementById("results");
const joinbtn = document.getElementById("join");
const roomspan = document.getElementById("room-id");
joinbtn.addEventListener("click",()=>{
    const roomname = document.getElementById("room_id").value.trim();
    if(roomname){
        roomspan.innerText = "Room Id: " + roomname;
        // socket.emit("join room", roomname);
        chrome.storage.local.set({roomName:roomname});
        chrome.runtime.sendMessage({target:"offscreen",type:"JOIN_ROOM",room: roomname});
        popup.style.display='none';
        ispop=false;
    }else{
        roomspan.innerText = "Room Id:";
    }
});

let roombtn=document.getElementById('roombtn');
let ispop=false,popup=document.getElementById('mypopup');
chrome.storage.local.get("roomName",(data)=>{
    if(data.roomName){
        roomspan.innerText="Room Id: "+data.roomName;
    }
});
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
let quickpick=document.querySelectorAll(".pick");
quickpick.forEach((button) => {
    button.addEventListener("click", () => {
        searchsong.value = button.dataset.query;
        searchsong.dispatchEvent(new KeyboardEvent("keydown", {key: "Enter"}));
    });
});

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
                    //isplay=false;
                    //audio(videoid);
                     chrome.runtime.sendMessage({target:"offscreen", type:"PLAY_SONG", videoId: videoid});
                    document.getElementById("options").replaceChildren();
                });
                document.getElementById("options").appendChild(option);
                i--;
            }
        });
    }
})
function renderPlayer(videoId,paused,time=0,dur=0){
    let playerdiv=document.getElementById("player");
    let player=playerdiv.querySelector("#now-playing");
    if(!videoId){
        player?.remove();
        return;
    }
    let pct=dur?(time/dur)*100:0;
    if(player?.dataset.videoId==videoId){
        const times=player.querySelectorAll(".audio-time");
        player.querySelector("#toggle-play").textContent=paused?"Play":"Pause";
        times[0].textContent=ftime(time);
        times[1].textContent=ftime(dur);
        player.querySelector("#seek-bar").value=pct;
        return;
    }

    player?.remove();
    playerdiv.insertAdjacentHTML("afterbegin",`
        <div id="now-playing" class="audio" data-video-id="${videoId}">
            <button id="toggle-play" class="audio-play-button">${paused?"Play":"Pause"}</button>
            <span class="audio-time">${ftime(time)}</span>
            <input type="range" id="seek-bar" class="audio-timeline" min="0" max="100" value="${pct}">
            <span class="audio-time">${ftime(dur)}</span>
        </div>
    `);
    // playerdiv.insertAdjacentHTML("afterbegin", `
    //     <div id="now-playing">
    //         <span>Now playing: ${videoId}</span>
    //         <button id="toggle-play">${paused?"Play":"Pause"}</button>
    //     </div>
    // `);
    document.getElementById("toggle-play").addEventListener("click",()=>{
        chrome.runtime.sendMessage({target:"offscreen", type:"TOGGLE_PLAY"});
    });
    document.getElementById("seek-bar").addEventListener("change",(e)=>{
        chrome.runtime.sendMessage({target:"offscreen", type:"SEEK", time:(e.target.value/100)*dur});
    });
}
function ftime(t){
    if(!t||isNaN(t)){
        return "0:00";
    }
    return `${Math.floor(t/60)}:${Math.floor(t%60).toString().padStart(2,"0")}`;
}
chrome.runtime.sendMessage({target:"offscreen",type:"GET_STATE"},(res)=>{
    if(res){
        renderPlayer(res.videoId,res.paused,res.currentTime,res.duration);
    }
});
chrome.runtime.onMessage.addListener((msg)=>{
    if(msg.type=="STATE_UPDATE"){
        renderPlayer(msg.videoId,msg.paused,msg.currentTime,msg.duration);
    }
})