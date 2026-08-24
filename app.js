require("dotenv").config();
const express = require("express");
const http = require("http");
const fs=require("fs");
const path= require("path");
const {Server} =require("socket.io");

let app=express();
let server=http.createServer(app);
const io=new Server(server);
const rootDir=__dirname;
const distDir=path.join(rootDir,"dist");
if (fs.existsSync(distDir)) {
    app.use(express.static(distDir));
}

app.use(express.static(rootDir));


app.get('/api/song',async(req,res)=>{
   const query = String(req.query.q || "").trim();
    const apiKey = process.env.apiKey;
    if (!query) {
        return res.status(400).json({error: "A search query is required"});
    }
    if (!apiKey) {
        return res.status(500).json({error: "The YouTube API key is not configured"});
    }
    const url = "https://www.googleapis.com/youtube/v3/search" +
       `?part=snippet&type=video&maxResults=12&q=${encodeURIComponent(query)}&key=${encodeURIComponent(apiKey)}`;
    try{
        const response = await fetch(url);
        if (!response.ok) {
            const details = await response.text();
            console.error("YouTube API error:", details);
            return res.status(response.status).json({
                error: "YouTube API request failed",
                details
            });
        }

        const data = await response.json();
        res.json(data.items || []);

    }catch(error){
        console.error("Failed to fetch songs:", error);
        res.status(500).json({error:'Failed to fetch details'});
    }
});
app.use((req, res) => {
    const indexFile = fs.existsSync(distDir) 
        ? path.join(distDir, "index.html") 
        : path.join(rootDir, "index.html");
    res.sendFile(indexFile);
});
const PORT = process.env.PORT || 3000;
server.listen(PORT, ()=> console.log(`Server is running on PORT:${PORT}`));
