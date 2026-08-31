const searchsong = document.getElementById("search");
//import {io} from 'socket.io-client';
const results = document.getElementById("results");

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
                    //socket emit code here
                    document.getElementById("player").innerHTML = `
                        <audio id="audio-player" controls autoplay style="width: 100%;">
                            <source src="http://localhost:3000/api/playsong?v=${videoid}">
                            Your browser does not support the audio element.
                        </audio>
                    `;
                });
                document.getElementById("options").appendChild(option);
                i--;
            }
        });
    }
});
