/* Safe standalone soundtrack controller — does not modify the main app logic. */
(function(){
  let audio=null, index=-1, playing=false;

  function tracks(){
    try{
      const d=typeof data==="function"?data():{};
      return Array.isArray(d.playlist)?d.playlist.filter(x=>x&&x.src):[];
    }catch(e){ return []; }
  }

  function ensureBar(){
    let bar=document.getElementById("safeSoundtrackBar");
    if(bar) return bar;
    bar=document.createElement("div");
    bar.id="safeSoundtrackBar";
    bar.innerHTML=
      '<div class="safe-track-info"><span>♫</span><div><b id="safeTrackName">Our Little Soundtrack</b><small id="safeTrackStatus">Ready ♡</small></div></div>'+
      '<div class="safe-track-controls"><button type="button" id="safePrev" aria-label="Previous song">⏮</button><button type="button" id="safePlay" aria-label="Play or pause">▶</button><button type="button" id="safeNext" aria-label="Next song">⏭</button></div>'+
      '<button type="button" id="safeClose" aria-label="Close soundtrack">×</button>';
    document.body.appendChild(bar);
    bar.querySelector("#safePrev").onclick=()=>play(index-1);
    bar.querySelector("#safePlay").onclick=toggle;
    bar.querySelector("#safeNext").onclick=()=>play(index+1);
    bar.querySelector("#safeClose").onclick=stop;
    return bar;
  }

  function update(){
    const list=tracks(), item=list[index], bar=document.getElementById("safeSoundtrackBar");
    if(!bar) return;
    bar.querySelector("#safeTrackName").textContent=item?.name||"Our Little Soundtrack";
    bar.querySelector("#safeTrackStatus").textContent=playing?"Now playing ♡":"Paused";
    bar.querySelector("#safePlay").textContent=playing?"❚❚":"▶";
  }

  function play(i){
    const list=tracks();
    if(!list.length){
      if(typeof showPanel==="function")showPanel("playlist");
      if(typeof showMusicMessage==="function")showMusicMessage("Add an audio file to Our Little Playlist first ♡");
      return;
    }
    if(i<0)i=0;
    if(i>=list.length){stop();return;}
    index=i;
    if(!audio){
      audio=new Audio();
      audio.preload="auto";
      audio.onplay=()=>{playing=true;update()};
      audio.onpause=()=>{playing=false;update()};
      audio.onended=()=>play(index+1);
    }
    audio.src=list[index].src;
    ensureBar();
    audio.play().catch(()=>{playing=false;update()});
    update();
  }

  function toggle(){
    if(!audio||index<0){play(0);return}
    if(audio.paused)audio.play().catch(()=>{});
    else audio.pause();
  }

  function stop(){
    if(audio){audio.pause();audio.currentTime=0}
    playing=false;index=-1;
    document.getElementById("safeSoundtrackBar")?.remove();
  }

  window.toggleMusic=function(){
    const list=tracks();
    if(list.length){
      if(audio&&!audio.paused)audio.pause();
      else if(audio&&index>=0)audio.play().catch(()=>{});
      else play(0);
      return;
    }
    if(typeof showPanel==="function")showPanel("playlist");
    if(typeof showMusicMessage==="function")showMusicMessage("Your current songs are Spotify tracks. Add an audio file if you want the music to continue while you browse ♡");
  };

  const css=document.createElement("style");
  css.textContent=
    "#safeSoundtrackBar{position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:10000;width:min(720px,calc(100% - 28px));display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:18px;background:#fffaf4ee;border:1px solid #ead9d2;box-shadow:0 12px 35px #4b304028;backdrop-filter:blur(12px)}"+
    ".safe-track-info{display:flex;align-items:center;gap:10px;min-width:0;flex:1}.safe-track-info>span{font-size:1.5rem}.safe-track-info b,.safe-track-info small{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.safe-track-info small{opacity:.7;margin-top:2px}.safe-track-controls{display:flex;gap:6px}.safe-track-controls button,#safeClose{border:0;background:transparent;min-width:38px;height:38px;border-radius:10px;cursor:pointer;font-size:1rem}.safe-track-controls button:hover,#safeClose:hover{background:#f1e5df}#safeClose{font-size:1.25rem;flex:0 0 auto}@media(max-width:650px){#safeSoundtrackBar{bottom:10px;width:calc(100% - 18px);padding:10px}.safe-track-controls button,#safeClose{min-width:34px;height:34px}}";
  document.head.appendChild(css);
})();