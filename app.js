require("dotenv").config();
const express = require("express");
const http = require("http");
const fs=require("fs");
const path= require("path");
const {Server} =require("socket.io");
const cors=require('cors');
const youtubedl = require('youtube-dl-exec');

let app=express();
app.use(cors());
let server=http.createServer(app);
const io=new Server(server);
const rootDir=__dirname;
const distDir=path.join(rootDir,"dist");
if (fs.existsSync(distDir)) {
    app.use(express.static(distDir));
}

const roomshistory={},rooms={};
io.on("connection",(socket)=>{
    let currom=null;
    console.log("conected",socket.id);
    socket.on("song play",(x1,y1)=>{
        //
    });
    socket.on("join room",(room_name)=>{
        console.log("Join room:",room_name);
        if(currom){
            socket.leave(currom);
        }
        socket.join(room_name);
        currom=room_name;
        if(!roomshistory[room_name]){
            roomshistory[room_name]=[];
            rooms[room_name] =[];
        }
        rooms[room_name].push(socket.id);
        socket.emit("room history",roomshistory[room_name]);
        io.to(room_name).emit("active users",rooms[room_name]);
        console.log(`User ${socket.id} joined room: ${room_name}`)
    });
});
app.use(express.static(rootDir));

app.get('/api/song',async(req,res)=>{
    const query = String((req.query.q||"")+" song").trim();
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
app.get('/api/playsong',async(req,res)=>{
    const videoId = String(req.query.v || "").trim();
    if (!videoId) {
        return res.status(400).json({ error: 'A video id is required' });
    }
    try{
        const videourl= `https://www.youtube.com/watch?v=${videoId}`;
        const info = await youtubedl(videourl, {
            dumpSingleJson: true,
            noWarnings: true,
            format: 'bestaudio'
        });
        const audiourl=info.url;
        if(!audiourl){
            return res.status(404).json({ error: 'No audio stream found for this video'});
        }
        const audioResponse = await fetch(audiourl);
        res.setHeader('Content-Type',audioResponse.headers.get('content-type') || 'audio/webm');
        audioResponse.body.pipe ?audioResponse.body.pipe(res):require('stream').Readable.fromWeb(audioResponse.body).pipe(res);
    }catch(error){
        console.error('Failed to stream audio:',error);
        res.status(500).json({error:'Failed to play the audio'});
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
