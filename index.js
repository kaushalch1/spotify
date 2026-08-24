const searchsong = document.getElementById("search");
const results = document.getElementById("results");


async function searchmusic(songname) {
    songname+=" song";
    const url = "https://www.googleapis.com/youtube/v3/search" +
        `?part=snippet&type=video&maxResults=12&q=${encodeURIComponent(songname)}&key=${process.env.apiKey}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`YouTube API returned ${response.status}`);
        }

        const data = await response.json();
        console.log(data.items);
        results.replaceChildren();

        if (!data.items?.length) {
            results.textContent = "No results found.";
            return;
        }
        return data.items;
        let i=10;
        data.items.forEach((item) => {
            if(i>=1){
                const result = document.createElement("p");
                result.textContent = item.snippet.title;
                results.appendChild(result);
                i--;
            }
        });
    }catch(error){
        console.log("error found fetching songs");
    }
}

searchsong.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && searchsong.value.trim()) {
        searchmusic(searchsong.value.trim());
    }
});
let input=document.getElementById("search");
let list=document.getElementById("options");
input.oninput=async()=>{
    if(input.value.length>3){
        searchmusic(searchsong.value.trim());
        // console.log(x);
    }
}