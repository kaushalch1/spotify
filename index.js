const searchsong = document.getElementById("search");
const results = document.getElementById("results");


searchsong.addEventListener("keydown", async(event) => {
    if (event.key === "Enter" && searchsong.value.trim()){
        let x=await fetch(`/api/song?q=${searchsong.value}`);
        let data=await x.json();
        console.log(data);
        let i=10;
        data.forEach((item) => {
            if(i>=1){
                const option = document.createElement("options");
                // option.textContent = item.snippet.title;
                // option.appendChild(result);
                option.innerHTML = data.map(p =>
                    `<div class="suggestion-item" data-value="${item.snippet.title}">
                        <p class="song">${item.snippet.title}</p><br>
                    </div>`
                ).join('');
                i--;
            }
        });
    }
});        