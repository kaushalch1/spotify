const searchsong = document.getElementById("search");

searchsong.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") {
        return;
    }
    const songname = searchsong.value.trim();
    if (songname) {
        console.log(songName);
    }
});