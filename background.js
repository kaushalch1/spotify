async function offscreen() {
    const exists=await chrome.runtime.getContexts({contextTypes:['OFFSCREEN_DOCUMENT']});
    if(exists.length>0){
        return;
    }
    await chrome.offscreen.createDocument({
        url:'offscreen.html',
        reasons:['AUDIO_PLAYBACK'],
        justification:'background music playback'
    });
}
offscreen();