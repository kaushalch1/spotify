const searchsong = document.getElementById("search");
const results = document.getElementById("results");

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
                    document.getElementById("player").innerHTML = `
                        <iframe
                            width="10"
                            height="20"
                            src="https://www.youtube.com/embed/${item.id.videoId}?autoplay=1"
                            allow="autoplay; encrypted-media"
                            allowfullscreen>
                        </iframe>
                    `;
                });
                document.getElementById("options").appendChild(option);
                i--;
            }
        });
    }
});
