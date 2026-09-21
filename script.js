const panel=document.getElementById("panel"),content=document.getElementById("panelContent");
const surprises=["Go look at one of our photos and remember exactly what was happening five minutes before it was taken. ♡","Today's reminder: you are loved by a girl who made an entire website about you. 😭❤️","Send Alice a random picture of what you're doing right now. No explanation.","Plan the next thing you want to cook together. 🍳","Ask Alice: 'What is one ordinary thing you can't wait to do with me?'","Emergency instruction: imagine Alice stealing a bite from your plate. 😂"];
let foundClues=JSON.parse(localStorage.getItem("aliceD_clues")||"[]");
const KEY="aliceD_little_world_data_v2";
const LEGACY_KEYS=["aliceD_v6_data","aliceD_v7_data","aliceD_v8_data","aliceD_v9_data","aliceD_v10_data"];
const defaults={story:[{title:"Chapter 1 — Through Mutuals",text:"Somehow, through mutuals and campus life, two people who didn't know what was coming ended up finding each other."},{title:"Chapter 2 — Zikhalo's Room",text:"The first time we actually sat and talked, everything felt natural. Nothing forced. Nothing awkward. Just... easy. ♡"},{title:"Chapter 3 — Seven Months & Counting",text:"And somehow, all those little conversations became an actual us."},{title:"Chapter 4 — Long Distance",text:"Alice ♡ ————— ♡ D\nDifferent places. Same story."}], memories:[{title:"my girl ♡",caption:"my girl ♡",src:"assets/alice-1.jpg",kind:"image"},{title:"my love ♡",caption:"my love ♡",src:"assets/d-1.jpg",kind:"image"},{title:"one of my favourite us moments",caption:"one of my favourite us moments",src:"assets/memory-1.jpg",kind:"image"},{title:"us. just us. ♡",caption:"us. just us. ♡",src:"assets/us-1.jpg",kind:"image"},{title:"a little memory 🎥",caption:"a little memory 🎥",src:"assets/memory-video-1.mp4",kind:"video"},{title:"another little memory 🎥",caption:"another little memory 🎥",src:"assets/memory-video-2.mp4",kind:"video"}],kitchen:[],watchlist:[],futureboard:[],letters:[],coupons:[],plans:[],distance:{lusakaTitle:"Lusaka, Zambia",bakuTitle:"Baku, Azerbaijan",lusakaNote:"Where Alice is",bakuNote:"Where D is",bridgeTitle:"Same love, different skies.",bridgeText:"About 6,600 km apart, but still living inside the same little world. ♡",lusakaMessage:"A little piece of home, waiting for you.",bakuMessage:"A little piece of you, waiting for me.",lusakaPlaces:"Home • Lusaka",bakuPlaces:"Home • Baku"},playlist:[
{name:"Love You I Do — Jennifer Hudson",spotify:"https://open.spotify.com/embed/track/4IjoD5u5E3Nv6ecnCpeWpy",url:"https://open.spotify.com/track/4IjoD5u5E3Nv6ecnCpeWpy"},
{name:"I Miss You — Beyoncé",spotify:"https://open.spotify.com/embed/track/4YmP1iCeBOi8JCP1fkNKVW",url:"https://open.spotify.com/track/4YmP1iCeBOi8JCP1fkNKVW"},
{name:"03’ Bonnie & Clyde — Jay-Z & Beyoncé",spotify:"https://open.spotify.com/embed/track/3TV2Ljb4gL3emOLT5CkbYW",url:"https://open.spotify.com/track/3TV2Ljb4gL3emOLT5CkbYW"},
{name:"Virgo’s Groove — Beyoncé",spotify:"https://open.spotify.com/embed/track/0Fl4eWzVaMUOdXcOrj6F1q",url:"https://open.spotify.com/track/0Fl4eWzVaMUOdXcOrj6F1q"},
{name:"1+1 — Beyoncé",spotify:"https://open.spotify.com/embed/track/1pzJboOZaDNwshBnOlNh3a",url:"https://open.spotify.com/track/1pzJboOZaDNwshBnOlNh3a"}
]};
function data(){
  try{
    let raw=localStorage.getItem(KEY);
    if(!raw){ for(const k of LEGACY_KEYS){ const old=localStorage.getItem(k); if(old){ raw=old; break; } } }
    const parsed=raw?JSON.parse(raw):JSON.parse(JSON.stringify(defaults));
    return {...JSON.parse(JSON.stringify(defaults)), ...parsed};
  }catch(e){return JSON.parse(JSON.stringify(defaults));}
} function saveData(d){localStorage.setItem(KEY,JSON.stringify(d));localStorage.setItem(KEY+"_updated",String(Date.now()));}
function toast(t){let x=document.createElement("div");x.className="toast";x.textContent=t;document.body.appendChild(x);setTimeout(()=>x.remove(),1800)}
function esc(s=""){return s.replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[m]))}
function updateClueProgress(){const el=document.getElementById("clueProgress");if(!el)return;el.textContent=foundClues.length<3?`You found ${foundClues.length}/3 hidden clues... ♡`:"Three clues found. Something has unlocked below... ✨"}
function findClue(n){if(!foundClues.includes(n)){foundClues.push(n);localStorage.setItem("aliceD_clues",JSON.stringify(foundClues))}updateClueProgress();if(foundClues.length>=3){const room=document.getElementById("secretRoom");if(room)room.classList.remove("hidden");setTimeout(()=>room?.scrollIntoView({behavior:"smooth",block:"center"}),150)}}
function setupLock(){const saved=localStorage.getItem("aliceD_pin");if(!saved)document.getElementById("lockIntro").textContent="Make a private code for this little world. It stays on this browser.";else{document.getElementById("lockIntro").textContent="Our little world is private. Enter the code to come in. ♡";document.getElementById("lockHint").textContent="(This code is stored only in this browser.)"}}
function unlock(){const input=document.getElementById("pin").value.trim();if(!input){document.getElementById("lockHint").textContent="Choose a little code first. ♡";return}const saved=localStorage.getItem("aliceD_pin");if(!saved){localStorage.setItem("aliceD_pin",input);enterApp()}else if(input===saved)enterApp();else document.getElementById("lockHint").textContent="Hmm... that's not our code. Try again. 💌"}
function forgotCode(){if(confirm("This will erase the saved code on this browser. Your photos, videos and website files will NOT be deleted. Continue?")){localStorage.removeItem("aliceD_pin");document.getElementById("lockHint").textContent="Code reset. Create a new one below. ♡";document.getElementById("pin").value="";document.getElementById("lockIntro").textContent="Make a new private code for this little world."}}
function enterApp(){document.getElementById("lock").classList.add("hidden");document.getElementById("app").classList.remove("hidden");newSurprise();updateClueProgress();if(foundClues.length>=3)document.getElementById("secretRoom").classList.remove("hidden")}
function openLetter(){
  const welcome=document.getElementById("welcome");
  if(!welcome){ showMusicMessage("The welcome section could not be found. Please reopen this version of the site."); return; }
  welcome.classList.remove("hidden");
  welcome.setAttribute("tabindex","-1");
  setTimeout(()=>welcome.scrollIntoView({behavior:"smooth",block:"center"}),50);
}
function openLetters(){
  const letters=data().letters||[];
  const built=["you miss me","you're sad","you can't sleep","you need reassurance","you need to laugh","basketball has annoyed you","you need your anime fix","you need to remember us"];
  const titles=[...new Set([...built,...letters.map(x => x && x.title ? String(x.title) : "a little reminder")])];
  panel.classList.remove("hidden");
  content.innerHTML=`<p class="eyebrow">THE LETTER BOX</p><h2>Open when... 💌</h2><p>Pick the envelope that feels like you right now.</p><div class="option-grid">${titles.map(x=>`<button class="option" type="button" data-letter="${esc(x)}">💌 Open when ${esc(x)}</button>`).join("")}</div><div id="letterResult"></div>`;
  content.querySelectorAll("[data-letter]").forEach(btn=>btn.addEventListener("click",()=>letter(btn.dataset.letter)));
  requestAnimationFrame(()=>panel.scrollIntoView({behavior:"smooth",block:"start"}));
}
function closePanel(){panel.classList.add("hidden")}
function showPanel(type){panel.classList.remove("hidden");let html="";
if(type==="openwhen"){openLetters();return;}
else if(type==="missme")html=`<p class="eyebrow">THE TEDDY BEAR</p><h2>Miss me? 🧸</h2><p>Press the button. Emergency Alice is standing by.</p><div class="big">🧸</div><button class="primary" onclick="missMe()">I MISS YOU 😭</button><div id="missResult"></div>`;
else if(type==="countdown")html=`<p class="eyebrow">THE WINDOW</p><h2>Until We Meet 🌙</h2><p>June 2027 is our reunion month.</p><div class="count" id="countText">June 2027 ♡<small>Set the exact date to turn this into a live countdown.</small></div><input id="reunionDate" type="date" min="2027-06-01" max="2027-06-30" style="padding:12px;width:100%;border:1px solid #ead9d2;border-radius:12px"><button class="primary" style="margin-top:10px" onclick="saveDate()">Set our date ♡</button>`;
else if(type==="future")html=futureBoardPanel();
else if(type==="story")html=storyPanel();
else if(type==="kitchen")html=kitchenPanel();
else if(type==="thelist")html=theListPanel();
else if(type==="memories")html=memoryPanel();
else if(type==="care")html=carePanel();
else if(type==="playlist")html=playlistPanel();
else if(type==="plans")html=plansPanel();
else if(type==="distance")html=distancePanel();
else if(type==="walk")html=`<p class="eyebrow">WALK WITH ME</p><h2>Questions for our long walks 🚶🏽‍♀️</h2><button class="primary" onclick="walkQuestion()">Give us a question ✦</button><div id="walkResult"></div>`;
else if(type==="dates")html=`<p class="eyebrow">THE DATE MACHINE</p><h2>What are we doing? 🎟️</h2><button class="primary" onclick="dateIdea()">Choose our date ✦</button><div id="dateIdea"></div>`;
else if(type==="edit")html=editorPanel();
content.innerHTML=html;const savedDate=localStorage.getItem("aliceD_reunion");if(type==="countdown"&&savedDate){document.getElementById("reunionDate").value=savedDate;renderCountdown(savedDate)}panel.scrollIntoView({behavior:"smooth"})}
function distancePanel(){
  const d=data(), x=d.distance||{};
  const time=(z)=>{try{return new Intl.DateTimeFormat("en-GB",{timeZone:z,hour:"2-digit",minute:"2-digit",hour12:false}).format(new Date())}catch(e){return "—"}};
  const date=(z)=>{try{return new Intl.DateTimeFormat("en-GB",{timeZone:z,weekday:"short",day:"numeric",month:"short"}).format(new Date())}catch(e){return ""}};
  return `<p class="eyebrow">THE DISTANCE BETWEEN US</p><h2>Two Cities, One Little World 🌍♡</h2>
  <p class="distance-intro">Different streets. Different skies. Same us.</p>
  <div class="distance-map">
    <div class="city-card lusaka-city"><div class="city-orb">🌿</div><span class="city-label">ALICE'S SIDE</span><h3>${esc(x.lusakaTitle||"Lusaka, Zambia")}</h3><p>${esc(x.lusakaNote||"Where Alice is")}</p><div class="city-time"><b>${time("Africa/Lusaka")}</b><small>${date("Africa/Lusaka")}</small></div><div class="city-note">♡ ${esc(x.lusakaMessage||"A little piece of home, waiting for you.")}</div></div>
    <div class="sky-bridge"><span>✈︎</span><i></i><b>♡</b><i></i><span>✦</span><small>~ 6,600 km apart<br>0 km between our little world</small></div>
    <div class="city-card baku-city"><div class="city-orb">🌊</div><span class="city-label">D'S SIDE</span><h3>${esc(x.bakuTitle||"Baku, Azerbaijan")}</h3><p>${esc(x.bakuNote||"Where D is")}</p><div class="city-time"><b>${time("Asia/Baku")}</b><small>${date("Asia/Baku")}</small></div><div class="city-note">♡ ${esc(x.bakuMessage||"A little piece of you, waiting for me.")}</div></div>
  </div>
  <div class="distance-message"><div class="big">🌙 ✈️ 🌙</div><h3>${esc(x.bridgeTitle||"Same love, different skies.")}</h3><p>${esc(x.bridgeText||"About 6,600 km apart, but still living inside the same little world. ♡")}</p></div>
  <div class="two-column-notes"><div class="city-journal"><span>📍 LUSAKA</span><p>${esc(x.lusakaPlaces||"Home • Lusaka")}</p></div><div class="city-journal"><span>📍 BAKU</span><p>${esc(x.bakuPlaces||"Home • Baku")}</p></div></div>
  <div class="option-grid"><button class="option" onclick="showPanel('playlist')">🎵 Our songs can cross the distance</button><button class="option" onclick="showPanel('countdown')">🌙 Count the days until we meet</button><button class="option" onclick="showPanel('memories')">📸 Bring up a memory</button></div>
  <p class="editable-note">Make this yours from <b>Our Little Editor → Edit Lusaka ↔ Baku</b>.</p>`;
}

function storyPanel(){const d=data();return `<p class="eyebrow">THE SCRAPBOOK</p><h2>Our Story 📖</h2><p class="editable-note">Both of you can edit this from <b>Our Little Editor</b>.</p>${d.story.map((x,i)=>`<div class="story"><b>${esc(x.title)}</b><p>${esc(x.text).replace(/\n/g,"<br>")}</p></div>`).join("")}<div class="locked">🔒 <b>Chapter 5 — June 2027</b><br><small>This chapter is still being written. Come back when D is home. ❤️</small></div>`}
function kitchenPanel(){
  const d=data(), recipes=d.kitchen||[];
  return `<p class="eyebrow">D'S KITCHEN</p><h2>Our Little Recipe Book 📖🍳</h2>
  <p>Recipes we already love, recipes we want to try, and recipes we invent together. Add a photo, ingredients, instructions, and a video or recipe link so neither of us has to hunt for it again. ♡</p>
  <div class="recipe-toolbar"><button class="primary" onclick="showPanel('edit');setTimeout(()=>editSection('kitchen'),50)">＋ Add a recipe</button><button class="mini" onclick="showPanel('edit');setTimeout(()=>editSection('kitchen'),50)">✏️ Edit recipe book</button></div>
  ${recipes.length?`<div class="recipe-grid">${recipes.map((r,i)=>recipeCard(r,i)).join('')}</div>`:`<div class="message">📖 Our recipe book is waiting for its first page. Add the first recipe you both want to make. ♡</div>`}`;
}
function recipeCard(r,i){
  const photo=r.photo||'';
  return `<article class="recipe-card">${photo?`<img src="${esc(photo)}" alt="${esc(r.title||'Recipe')}" class="recipe-photo">`:`<div class="recipe-placeholder">🍽️</div>`}<div class="recipe-body"><div class="recipe-meta">${esc(r.category||'Recipe')} ${r.favourite?'♡':''}</div><h3>${esc(r.title||'Untitled recipe')}</h3>${r.note?`<p>${esc(r.note)}</p>`:''}<details><summary>Ingredients</summary><div class="recipe-text">${esc(r.ingredients||'Add ingredients in the editor.').replace(/\n/g,'<br>')}</div></details><details><summary>Method</summary><div class="recipe-text">${esc(r.steps||'Add the steps in the editor.').replace(/\n/g,'<br>')}</div></details><div class="recipe-links">${r.video?`<a class="mini" href="${esc(r.video)}" target="_blank" rel="noopener">▶ Watch recipe video</a>`:''}${r.link?`<a class="mini" href="${esc(r.link)}" target="_blank" rel="noopener">🔗 Open recipe</a>`:''}</div></div></article>`;
}
function theListPanel(){
  const d=data(), items=d.watchlist||[];
  const groups=['Want to watch','Watching','Watched'];
  return `<p class="eyebrow">THE LIST</p><h2>Movies & Series 🎬🍿</h2><p>Our shared list of things we want to watch together. Add anything — movie nights, series, anime, comfort shows, or that one thing one of us keeps insisting is amazing. 😂</p><div class="recipe-toolbar"><button class="primary" onclick="showPanel('edit');setTimeout(()=>editSection('watchlist'),50)">＋ Add to The List</button><button class="mini" onclick="showPanel('edit');setTimeout(()=>editSection('watchlist'),50)">✏️ Edit The List</button></div>${groups.map(g=>{const arr=items.filter(x=>(x.status||'Want to watch')===g);return `<section class="watch-section"><h3>${g} <span>${arr.length}</span></h3>${arr.length?`<div class="watch-grid">${arr.map(x=>watchCard(x)).join('')}</div>`:`<div class="message soft">Nothing here yet. ♡</div>`}</section>`}).join('')}`;
}
function watchCard(x){return `<article class="watch-card"><div class="watch-poster">${x.photo?`<img src="${esc(x.photo)}" alt="${esc(x.title||'Poster')}">`:'🎬'}</div><div><div class="recipe-meta">${esc(x.type||'Movie')} · ${esc(x.status||'Want to watch')}</div><h3>${esc(x.title||'Untitled')}</h3>${x.year?`<small>${esc(x.year)}</small>`:''}${x.note?`<p>${esc(x.note)}</p>`:''}${x.link?`<a class="mini" href="${esc(x.link)}" target="_blank" rel="noopener">🔗 Where to watch / info</a>`:''}</div></article>`}
function memoryPanel(){const d=data();return `<p class="eyebrow">THE SCRAPBOOK WALL</p><h2>Our Memories 📸</h2><p>Old memories are still here — and now you can add and edit your own.</p><div class="memory-grid">${d.memories.map((m,i)=>`<figure class="polaroid">${m.kind==="video"?`<video controls playsinline preload="metadata" src="${m.src}"></video>`:`<img src="${m.src}" alt="${esc(m.title)}">`}<figcaption>${esc(m.caption)}</figcaption></figure>`).join("")}</div>`}
function carePanel(){const d=data();return `<p class="eyebrow">JUST FOR YOU</p><h2>A Little Care Package 🎁</h2><div class="message">🎧 Your shared soundtrack<br>📸 Our memories<br>💌 Love letters<br>🎟️ Love coupons<br>🍳 Future cooking dates</div><div class="option-grid"><button class="option" onclick="coupon('One free cuddle')">🎟️ Cuddle coupon</button><button class="option" onclick="coupon('One forehead kiss')">🎟️ Forehead kiss</button><button class="option" onclick="coupon('One date planned by Alice')">🎟️ Alice plans the date</button></div><div id="couponResult"></div>${d.coupons.length?'<h3>Saved coupons</h3>'+d.coupons.map(x=>`<div class="message">🎟️ ${esc(x)}</div>`).join(""):''}`}
function plansPanel(){const d=data();return `<p class="eyebrow">OUR PLANS</p><h2>Things We Want To Do Together 🌷</h2><p>Every little plan we add lives here.</p>${(d.plans||[]).length?`<div class="option-grid">${d.plans.map(x=>`<div class="message">🌷 ${esc(x)}</div>`).join("")}</div>`:`<div class="message">No plans yet. Add one in Our Little Editor. ♡</div>`}<button class="mini" onclick="showPanel('edit');setTimeout(()=>editSection('plans'),50)">✏️ Edit our plans</button>`}
function playlistPanel(){const d=data(),tracks=d.playlist||[];if(!tracks.length)return `<p class="eyebrow">OUR LITTLE PLAYLIST</p><h2>Our Little Playlist 🎵</h2><p>Our songs live online, so you can listen from Lusaka or Baku. ♡</p><div class="message">🎧 No songs yet — add a Spotify link from <b>Our Little Editor → Edit Soundtrack</b>.</div><button class="primary" onclick="showPanel('edit');setTimeout(()=>editSection('playlist'),50)">🎵 Add our songs ♡</button>`;return `<p class="eyebrow">OUR LITTLE PLAYLIST</p><h2>Our Little Playlist 🎵</h2><p>Our soundtrack is online — no MP3 uploads needed. Press play on any song. ♡</p><div class="playlist-player">${tracks.map((x,i)=>`<div class="playlist-item online-track"><div><b>${esc(x.name||('Song '+(i+1)))}</b></div>${x.spotify?`<iframe src="${esc(x.spotify)}" width="100%" height="152" frameborder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" style="border-radius:12px"></iframe>`:x.src?`<audio controls preload="metadata" src="${x.src}"></audio>`:''}${x.url?`<a class="mini" href="${esc(x.url)}" target="_blank" rel="noopener">Open in Spotify ↗</a>`:''}</div>`).join('')}</div><button class="mini" onclick="showPanel('edit');setTimeout(()=>editSection('playlist'),50)">✏️ Edit playlist</button>`}
function editorPanel(){return `<p class="eyebrow">OUR LITTLE EDITOR</p><h2>Everything can grow with us ✏️</h2><p>Edit the words, add memories, build our recipe book, create The List, write letters and build our playlist. Changes are saved on this browser.</p><div class="editor-bar"><button class="primary" onclick="editSection('story')">📖 Edit Story</button><button class="primary" onclick="editSection('memories')">📸 Edit Memories</button><button class="primary" onclick="editSection('kitchen')">📖 Edit Recipe Book</button><button class="primary" onclick="editSection('futureboard')">🏡 Edit Future Board</button><button class="primary" onclick="editSection('watchlist')">🎬 Edit The List</button><button class="primary" onclick="editSection('letters')">💌 Edit Letters</button><button class="primary" onclick="editSection('playlist')">🎵 Edit Soundtrack</button><button class="primary" onclick="editSection('distance')">🌍 Edit Lusaka ↔ Baku</button><button class="primary" onclick="editSection('plans')">🌷 Shared Plans</button><button class="primary" onclick="showPanel('plans')">🌷 View Plans</button></div><div id="editorArea" class="edit-card"><p class="tiny-label">Tip</p><p>Use the buttons above. Your edits stay on this browser, so D can edit on his device too — but the two devices do not automatically sync yet.</p></div>`}
function editSection(sec){const d=data(),a=d[sec]||[];let h="";if(sec==="playlist")h=`<h3>Our Online Soundtrack 🎵</h3><p>Use Spotify links so both you and D can listen online from anywhere. You can also still add local audio files if you want.</p><div class="edit-card"><input id="onlineSongName" placeholder="Song name — artist"><input id="onlineSongUrl" placeholder="Paste Spotify song link" style="margin-top:8px"><button class="primary" style="margin-top:8px" onclick="addOnlineSong()">＋ Add online song ♡</button></div><div id="songList">${a.map((x,i)=>`<div class="playlist-item"><div><b>${esc(x.name||('Song '+(i+1)))}</b>${x.url?`<br><a href="${esc(x.url)}" target="_blank" rel="noopener">Open online ↗</a>`:''}</div><button class="mini danger" onclick="removeItem('playlist',${i})">Remove</button></div>`).join("")}</div><details class="edit-card"><summary>Add an audio file instead</summary><input id="songFile" type="file" accept="audio/*" multiple style="margin-top:10px"><button class="primary" style="margin-top:8px" onclick="addSongs()">Add selected songs ♡</button></details>`;
else if(sec==="story")h=`<h3>Our Story 📖</h3>${a.map((x,i)=>`<div class="edit-card"><input id="st${i}" value="${esc(x.title)}"><textarea id="sx${i}">${esc(x.text)}</textarea><button class="mini danger" onclick="removeItem('story',${i})">Delete chapter</button></div>`).join("")}<button class="mini" onclick="addItem('story')">＋ Add chapter</button> <button class="primary" onclick="saveStory()">Save story ♡</button>`;
else if(sec==="kitchen")h=`<h3>Our Recipe Book 📖🍳</h3><p class="editable-note">Every field is editable. Add a recipe photo from your device, a YouTube/TikTok/Instagram/website link, ingredients and the method.</p>${a.map((x,i)=>`<div class="edit-card recipe-editor"><label>Recipe title</label><input id="kt${i}" value="${esc(x.title||'')}" placeholder="e.g. Creamy chicken pasta"><label>Category</label><input id="kcat${i}" value="${esc(x.category||'Dinner')}" placeholder="Dinner, dessert, breakfast..."><label>Ingredients</label><textarea id="ki${i}" placeholder="One ingredient per line">${esc(x.ingredients||'')}</textarea><label>Method</label><textarea id="ks${i}" placeholder="Write the steps here">${esc(x.steps||x.text||'')}</textarea><label>Our note</label><textarea id="kn${i}" placeholder="Why we want to try it / what we changed">${esc(x.note||'')}</textarea><label>Recipe/video link</label><input id="kl${i}" value="${esc(x.link||'')}" placeholder="https://..."><label>Video link</label><input id="kv${i}" value="${esc(x.video||'')}" placeholder="YouTube / TikTok / Instagram link"><label>Photo</label><input id="kp${i}" type="file" accept="image/*"><div class="current-photo">${x.photo?`<img src="${esc(x.photo)}" alt="Current recipe photo">`:'No photo added yet.'}</div><button class="mini danger" onclick="removeItem('kitchen',${i})">Delete recipe</button></div>`).join("")}<button class="mini" onclick="addItem('kitchen')">＋ Add recipe</button> <button class="primary" onclick="saveKitchen()">Save recipe book ♡</button>`;
else if(sec==="watchlist")h=`<h3>The List 🎬🍿</h3><p class="editable-note">Add movies and series you both want to watch. Change the status whenever you like and add posters/photos or links.</p>${(a||[]).map((x,i)=>`<div class="edit-card watch-editor"><label>Title</label><input id="wt${i}" value="${esc(x.title||'')}" placeholder="Movie or series"><label>Type</label><select id="wtype${i}"><option ${x.type==='Movie'?'selected':''}>Movie</option><option ${x.type==='Series'?'selected':''}>Series</option><option ${x.type==='Anime'?'selected':''}>Anime</option></select><label>Status</label><select id="wstatus${i}"><option ${x.status==='Want to watch'?'selected':''}>Want to watch</option><option ${x.status==='Watching'?'selected':''}>Watching</option><option ${x.status==='Watched'?'selected':''}>Watched</option></select><label>Year</label><input id="wy${i}" value="${esc(x.year||'')}"><label>Our note</label><textarea id="wn${i}" placeholder="Why we added it">${esc(x.note||'')}</textarea><label>Where to watch / info link</label><input id="wl${i}" value="${esc(x.link||'')}" placeholder="https://..."><label>Poster/photo</label><input id="wp${i}" type="file" accept="image/*"><div class="current-photo">${x.photo?`<img src="${esc(x.photo)}" alt="Current poster">`:'No poster added yet.'}</div><button class="mini danger" onclick="removeItem('watchlist',${i})">Delete</button></div>`).join('')}<button class="mini" onclick="addItem('watchlist')">＋ Add to The List</button> <button class="primary" onclick="saveWatchlist()">Save The List ♡</button>`;
else if(sec==="futureboard")h=`<h3>Our Future Board 🏡📌</h3><p class="editable-note">Add inspiration for the life we want: kitchens, living rooms, bedrooms, houses, gardens, date spaces, travel, cars — anything. Upload pictures/videos or paste an online inspiration link.</p>${(a||[]).map((x,i)=>`<div class="edit-card future-editor"><label>Pin title</label><input id="ft${i}" value="${esc(x.title||'')}" placeholder="e.g. The kitchen we want"><label>Category</label><select id="fcat${i}"><option ${x.category==='Kitchen'?'selected':''}>Kitchen</option><option ${x.category==='Living room'?'selected':''}>Living room</option><option ${x.category==='Bedroom'?'selected':''}>Bedroom</option><option ${x.category==='House'?'selected':''}>House</option><option ${x.category==='Garden'?'selected':''}>Garden</option><option ${x.category==='Bathroom'?'selected':''}>Bathroom</option><option ${x.category==='Dream life'?'selected':''}>Dream life</option><option ${x.category==='Other'?'selected':''}>Other</option></select><label>Our note</label><textarea id="fn${i}" placeholder="What do we love about this?">${esc(x.note||'')}</textarea><label>Online inspiration link</label><input id="fu${i}" value="${esc(x.url||'')}" placeholder="Pinterest / Instagram / YouTube / house listing link"><label>Photo or video from your device</label><input id="ff${i}" type="file" accept="image/*,video/*"><div class="current-photo">${x.media?(x.kind==='video'?`<video src="${esc(x.media)}" controls muted playsinline></video>`:`<img src="${esc(x.media)}" alt="Future inspiration">`):'No uploaded picture/video yet.'}</div><button class="mini danger" onclick="removeItem('futureboard',${i})">Delete pin</button></div>`).join('')}<button class="mini" onclick="addItem('futureboard')">＋ Add inspiration pin</button> <button class="primary" onclick="saveFutureBoard()">Save Future Board ♡</button>`;
else if(sec==="letters")h=`<h3>Open When letters 💌</h3>${a.map((x,i)=>`<div class="edit-card"><input id="lt${i}" value="${esc(x.title)}"><textarea id="lx${i}">${esc(x.text)}</textarea><button class="mini danger" onclick="removeItem('letters',${i})">Delete</button></div>`).join("")}<button class="mini" onclick="addItem('letters')">＋ Add letter</button> <button class="primary" onclick="saveLetters()">Save letters ♡</button>`;
else if(sec==="memories")h=`<h3>Memories 📸</h3><p class="editable-note">The six original memories stay in the site. You can add captions/titles here. New photos/videos can be added below.</p>${a.map((x,i)=>`<div class="edit-card"><input id="mt${i}" value="${esc(x.title)}"><input id="mc${i}" value="${esc(x.caption)}"><button class="mini danger" onclick="removeItem('memories',${i})">Delete</button></div>`).join("")}<input id="mediaFiles" type="file" accept="image/*,video/*" multiple><button class="primary" onclick="addMedia()">Add photos/videos ♡</button><button class="primary" onclick="saveMemories()">Save captions ♡</button>`;
else if(sec==="distance")h=`<h3>Lusaka ↔ Baku 🌍</h3><p>Edit the little details that make the distance feel like ours. Changes save as you type.</p>
<div class="edit-card"><label>Lusaka title</label><input id="dl" value="${esc(a.lusakaTitle||"Lusaka, Zambia")}"><label>Note</label><input id="dln" value="${esc(a.lusakaNote||"Where Alice is")}"><label>Message</label><textarea id="dlm">${esc(a.lusakaMessage||"A little piece of home, waiting for you.")}</textarea><label>Places</label><input id="dlp" value="${esc(a.lusakaPlaces||"Home • Lusaka")}"></div>
<div class="edit-card"><label>Baku title</label><input id="db" value="${esc(a.bakuTitle||"Baku, Azerbaijan")}"><label>Note</label><input id="dbn" value="${esc(a.bakuNote||"Where D is")}"><label>Message</label><textarea id="dbm">${esc(a.bakuMessage||"A little piece of you, waiting for me.")}</textarea><label>Places</label><input id="dbp" value="${esc(a.bakuPlaces||"Home • Baku")}"></div>
<div class="edit-card"><label>Bridge title</label><input id="dtitle" value="${esc(a.bridgeTitle||"Same love, different skies.")}"><label>Bridge message</label><textarea id="dtext">${esc(a.bridgeText||"About 6,600 km apart, but still living inside the same little world. ♡")}</textarea></div>
<button class="primary" onclick="saveDistance()">Save distance page ♡</button>`;
else if(sec==="plans")h=`<h3>Things We Want To Do Together 🌷</h3>${a.map((x,i)=>`<div class="edit-card"><input id="pt${i}" value="${esc(x)}"><button class="mini danger" onclick="removeItem('plans',${i})">Delete</button></div>`).join("")}<button class="mini" onclick="addItem('plans')">＋ Add plan</button> <button class="primary" onclick="savePlans()">Save plans ♡</button>`;
document.getElementById("editorArea").innerHTML=h;
  const area=document.getElementById("editorArea");
  area.querySelectorAll("input:not([type=file]), textarea").forEach(el=>el.addEventListener("input",()=>{autoSaveEditor(sec);}));
}
function autoSaveEditor(sec){
  const d=data();
  if(sec==="story") d.story.forEach((x,i)=>{const a=document.getElementById(`st${i}`),b=document.getElementById(`sx${i}`);if(a&&b){x.title=a.value;x.text=b.value;}});
  if(sec==="futureboard") d.futureboard=(d.futureboard||[]).map((x,i)=>({...x,title:document.getElementById(`ft${i}`)?.value||'',category:document.getElementById(`fcat${i}`)?.value||'Other',note:document.getElementById(`fn${i}`)?.value||'',url:document.getElementById(`fu${i}`)?.value||''}));
  if(sec==="kitchen") d.kitchen.forEach((x,i)=>{const a=document.getElementById(`kt${i}`);if(a){x.title=a.value;x.category=document.getElementById(`kcat${i}`)?.value||'';x.ingredients=document.getElementById(`ki${i}`)?.value||'';x.steps=document.getElementById(`ks${i}`)?.value||'';x.note=document.getElementById(`kn${i}`)?.value||'';x.link=document.getElementById(`kl${i}`)?.value||'';x.video=document.getElementById(`kv${i}`)?.value||'';}});
  if(sec==="watchlist") d.watchlist=(d.watchlist||[]).map((x,i)=>({...x,title:document.getElementById(`wt${i}`)?.value||'',type:document.getElementById(`wtype${i}`)?.value||'Movie',status:document.getElementById(`wstatus${i}`)?.value||'Want to watch',year:document.getElementById(`wy${i}`)?.value||'',note:document.getElementById(`wn${i}`)?.value||'',link:document.getElementById(`wl${i}`)?.value||''}));
  if(sec==="letters") d.letters.forEach((x,i)=>{const a=document.getElementById(`lt${i}`),b=document.getElementById(`lx${i}`);if(a&&b){x.title=a.value;x.text=b.value;}});
  if(sec==="memories") d.memories.forEach((x,i)=>{const a=document.getElementById(`mt${i}`),b=document.getElementById(`mc${i}`);if(a&&b){x.title=a.value;x.caption=b.value;}});
  if(sec==="distance"){d.distance=d.distance||{};const ids=["dl","dln","dlm","dlp","db","dbn","dbm","dbp","dtitle","dtext"];const keys=["lusakaTitle","lusakaNote","lusakaMessage","lusakaPlaces","bakuTitle","bakuNote","bakuMessage","bakuPlaces","bridgeTitle","bridgeText"];ids.forEach((id,i)=>{const el=document.getElementById(id);if(el)d.distance[keys[i]]=el.value;});}
  if(sec==="plans") d.plans=[...document.querySelectorAll('[id^=pt]')].map(x=>x.value);
  saveData(d);
}
function saveDistance(){const d=data();d.distance=d.distance||{};const map={dl:"lusakaTitle",dln:"lusakaNote",dlm:"lusakaMessage",dlp:"lusakaPlaces",db:"bakuTitle",dbn:"bakuNote",dbm:"bakuMessage",dbp:"bakuPlaces",dtitle:"bridgeTitle",dtext:"bridgeText"};Object.entries(map).forEach(([id,key])=>{const el=document.getElementById(id);if(el)d.distance[key]=el.value});saveData(d);toast("Lusaka ↔ Baku saved 🌍♡");showPanel("distance")}
function futureBoardPanel(){
  const d=data(), pins=d.futureboard||[];
  const cats=["Kitchen","Living room","Bedroom","House","Garden","Bathroom","Dream life","Other"];
  return `<p class="eyebrow">OUR FUTURE BOARD</p><h2>Our Future Board 🏡📌</h2><p>Not a simulator anymore — this is our little Pinterest-style scrapbook for the life we want to build. Pin rooms, houses, colours, furniture, gardens, dream spaces and anything else that makes us say <i>“yes, this feels like us.”</i> ♡</p><div class="future-board-tools"><button class="primary" onclick="showPanel('edit');setTimeout(()=>editSection('futureboard'),50)">＋ Add a pin</button><button class="mini" onclick="showPanel('edit');setTimeout(()=>editSection('futureboard'),50)">✏️ Edit board</button></div>${pins.length?cats.map(c=>{const arr=pins.filter(x=>(x.category||'Other')===c);return arr.length?`<section class="future-category"><div class="future-category-head"><span>${({Kitchen:'🍳','Living room':'🛋️',Bedroom:'🛏️',House:'🏡',Garden:'🌿',Bathroom:'🛁','Dream life':'✨',Other:'📌'})[c]}</span><h3>${c}</h3><small>${arr.length} pin${arr.length===1?'':'s'}</small></div><div class="pin-board">${arr.map((x)=>futurePinCard(x)).join('')}</div></section>`:''}).join(''):`<div class="message">📌 Our future is a blank board. Add the first picture of the kitchen, living room, dream house or anything else you want us to build towards. ♡</div>`}`;
}
function futurePinCard(x){const media=x.media?(x.kind==='video'?`<video src="${esc(x.media)}" controls muted playsinline></video>`:`<img src="${esc(x.media)}" alt="${esc(x.title||'Future inspiration')}">`):'';return `<article class="future-pin">${media||'<div class="pin-placeholder">🏡</div>'}<div class="pin-body"><span class="pin-tag">${esc(x.category||'Other')}</span><h4>${esc(x.title||'Untitled inspiration')}</h4>${x.note?`<p>${esc(x.note).replace(/\n/g,'<br>')}</p>`:''}${x.url?`<a class="mini pin-link" href="${esc(x.url)}" target="_blank" rel="noopener">Open inspiration ↗</a>`:''}</div></article>`}
function saveFutureBoard(){const d=data();d.futureboard=d.futureboard||[];const jobs=[];d.futureboard.forEach((x,i)=>{x.title=document.getElementById(`ft${i}`)?.value||'';x.category=document.getElementById(`fcat${i}`)?.value||'Other';x.note=document.getElementById(`fn${i}`)?.value||'';x.url=document.getElementById(`fu${i}`)?.value||'';const file=document.getElementById(`ff${i}`)?.files?.[0];if(file)jobs.push(new Promise(res=>{const r=new FileReader();r.onload=()=>{x.media=r.result;x.kind=file.type.startsWith('video')?'video':'image';res()};r.readAsDataURL(file)}));});Promise.all(jobs).then(()=>{saveData(d);toast('Future Board saved 🏡♡');showPanel('future')})}
function addItem(sec){const d=data();if(sec==="story")d.story.push({title:"New chapter",text:"Write our next little chapter here. ♡"});else if(sec==="kitchen")d.kitchen.push({title:"New recipe",category:"Dinner",ingredients:"",steps:"",note:"",link:"",video:"",photo:""});
else if(sec==="futureboard")(d.futureboard||(d.futureboard=[])).push({title:"New inspiration",category:"Kitchen",note:"Why we love this idea ♡",url:"",media:"",kind:"image"});
else if(sec==="watchlist")(d.watchlist||(d.watchlist=[])).push({title:"New movie or series",type:"Movie",status:"Want to watch",year:"",note:"",link:"",photo:""});else if(sec==="letters")d.letters.push({title:"you need me",text:"Write your own letter here. ♡"});else if(sec==="plans")d.plans.push("Something we want to do together");saveData(d);editSection(sec)}
function removeItem(sec,i){const d=data();d[sec].splice(i,1);saveData(d);editSection(sec);toast("Removed ♡")}
function saveStory(){const d=data();d.story.forEach((x,i)=>{x.title=document.getElementById(`st${i}`).value;x.text=document.getElementById(`sx${i}`).value});saveData(d);toast("Story saved ♡");editSection('story')}
function saveKitchen(){const d=data();const jobs=[];d.kitchen.forEach((x,i)=>{x.title=document.getElementById(`kt${i}`)?.value||'';x.category=document.getElementById(`kcat${i}`)?.value||'';x.ingredients=document.getElementById(`ki${i}`)?.value||'';x.steps=document.getElementById(`ks${i}`)?.value||'';x.note=document.getElementById(`kn${i}`)?.value||'';x.link=document.getElementById(`kl${i}`)?.value||'';x.video=document.getElementById(`kv${i}`)?.value||'';const file=document.getElementById(`kp${i}`)?.files?.[0];if(file)jobs.push(new Promise(res=>{const r=new FileReader();r.onload=()=>{x.photo=r.result;res()};r.readAsDataURL(file)}));});Promise.all(jobs).then(()=>{saveData(d);toast("Recipe book saved 📖♡");editSection('kitchen')})}
function saveWatchlist(){const d=data();d.watchlist=(d.watchlist||[]);const jobs=[];d.watchlist.forEach((x,i)=>{x.title=document.getElementById(`wt${i}`)?.value||'';x.type=document.getElementById(`wtype${i}`)?.value||'Movie';x.status=document.getElementById(`wstatus${i}`)?.value||'Want to watch';x.year=document.getElementById(`wy${i}`)?.value||'';x.note=document.getElementById(`wn${i}`)?.value||'';x.link=document.getElementById(`wl${i}`)?.value||'';const file=document.getElementById(`wp${i}`)?.files?.[0];if(file)jobs.push(new Promise(res=>{const r=new FileReader();r.onload=()=>{x.photo=r.result;res()};r.readAsDataURL(file)}));});Promise.all(jobs).then(()=>{saveData(d);toast("The List saved 🎬♡");editSection('watchlist')})}
function saveLetters(){const d=data();d.letters.forEach((x,i)=>{x.title=document.getElementById(`lt${i}`).value;x.text=document.getElementById(`lx${i}`).value});saveData(d);toast("Letters saved 💌");editSection('letters')}
function saveMemories(){const d=data();d.memories.forEach((x,i)=>{x.title=document.getElementById(`mt${i}`).value;x.caption=document.getElementById(`mc${i}`).value});saveData(d);toast("Memories saved 📸");editSection('memories')}
function savePlans(){const d=data();d.plans=[...document.querySelectorAll('[id^=pt]')].map(x=>x.value);saveData(d);toast("Plans saved 🌷");editSection('plans')}
function addMedia(){const fs=[...document.getElementById('mediaFiles').files];if(!fs.length)return;const d=data();fs.forEach(f=>{const r=new FileReader();r.onload=()=>{d.memories.push({title:f.name,caption:"A new little memory ♡",src:r.result,kind:f.type.startsWith('video')?'video':'image'});saveData(d);editSection('memories')};r.readAsDataURL(f)});toast("Adding your memories… ♡")}
function spotifyEmbed(url){try{const u=new URL(url);if(!u.hostname.includes('spotify.com'))return '';const m=u.pathname.match(/\/(track|album|playlist)\/([^/?]+)/);return m?`https://open.spotify.com/embed/${m[1]}/${m[2]}?utm_source=generator`:''}catch(e){return ''}}
function addOnlineSong(){const name=document.getElementById('onlineSongName')?.value.trim();const url=document.getElementById('onlineSongUrl')?.value.trim();if(!name||!url){toast('Add the song name and Spotify link ♡');return}const embed=spotifyEmbed(url);if(!embed){toast('Please paste a Spotify song, album or playlist link ♡');return}const d=data();d.playlist=d.playlist||[];d.playlist.push({name,url,spotify:embed});saveData(d);toast('Online song added 🎵');editSection('playlist')}
function addSongs(){const fs=[...document.getElementById('songFile').files];if(!fs.length)return;const d=data();fs.forEach(f=>{const r=new FileReader();r.onload=()=>{d.playlist=d.playlist||[];d.playlist.push({name:f.name,src:r.result});saveData(d);editSection('playlist')};r.readAsDataURL(f)});toast("Adding songs… 🎵")}
function missMe(){document.getElementById("missResult").innerHTML=`<div class="message">${["Emergency boyfriend hug dispatched. 🤗","If I could teleport, I'd already be next to you. ♡","Reminder: you are very, very loved. Especially by Alice. 🎀","Digital forehead kiss delivered. 😚","Go drink some water and stop being stubborn. 😂"][Math.floor(Math.random()*5)]}</div>`}
function letter(x){const d=data();const own=d.letters.find(l=>l.title.toLowerCase()===x.toLowerCase());document.getElementById("letterResult").innerHTML=`<div class="message"><b>Open when ${esc(x)}:</b><br><br>${own?esc(own.text):"Hi, Baby. Whatever made you open this, take a breath. Remember that somewhere out there, Alice is thinking about you and choosing you. ♡"}</div>`}
function future(x){const l={cooking:"Our Saturday night: music playing, two people cooking, one person stealing ingredients, and both pretending the kitchen isn't a mess. 🍳",walk:"Our ordinary evening: a long walk, random stories, laughing at things nobody else would understand, and taking the scenic route home. 🌙",anime:"Blankets, anime, something delicious, and D pretending he isn't emotionally invested in the characters. 🍜",basketball:"A little friendly competition, dramatic commentary, and Alice absolutely keeping the score. 🏀"};document.getElementById("futureResult").innerHTML=`<div class="message">${l[x]}</div>`}
function cook(x){document.getElementById("cookResult").innerHTML=`<div class="message"><b>${x}</b><br><br>Challenge accepted. Add the photo, recipe, rating and memory from the editor. ♡</div>`}
function walkQuestion(){const q=["What is something you can't wait to do together?","Where would you take me if we could teleport anywhere?","What's one ordinary thing you want our future to include?","What is a memory with me that you replay in your head?","What should our first proper cooking date be?","If we had a completely free Saturday, what would we do?"];document.getElementById("walkResult").innerHTML=`<div class="message">${q[Math.floor(Math.random()*q.length)]}</div>`}
function dateIdea(){const d=["Cook the same meal together on video call 🍳","Pick an anime and make matching snacks 🍜","20 questions while taking a long walk 🚶","Order each other dinner without telling the other what it is 🍽️","Recreate your favourite photo together 📸","Basketball + a ridiculous winner's prize 🏀","Make a shared playlist and explain every song 🎧"];document.getElementById("dateIdea").innerHTML=`<div class="message"><b>Tonight's date:</b><br><br>${d[Math.floor(Math.random()*d.length)]}</div>`}
function coupon(x){const d=data();if(!d.coupons.includes(x)){d.coupons.push(x);saveData(d)}document.getElementById("couponResult").innerHTML=`<div class="message">🎟️ <b>OFFICIAL ALICE COUPON</b><br><br>${x}<br><br><small>Saved to your care package. No expiry. ♡</small></div>`}
function saveDate(){const d=document.getElementById("reunionDate").value;if(!d)return;localStorage.setItem("aliceD_reunion",d);renderCountdown(d)}function renderCountdown(d){const target=new Date(d+"T12:00:00"),now=new Date(),ms=target-now,el=document.getElementById("countText");if(!el)return;if(ms<=0){el.innerHTML="YOU'RE HOME ❤️<small>No more counting. Just you.</small>";return}el.innerHTML=`${Math.ceil(ms/86400000)} days ♡<small>until our reunion · ${target.toLocaleDateString(undefined,{month:"long",day:"numeric",year:"numeric"})}</small>`}
setInterval(()=>{const d=localStorage.getItem("aliceD_reunion");if(d&&document.getElementById("countText"))renderCountdown(d)},60000);function newSurprise(){document.getElementById("dailySurprise").textContent=surprises[Math.floor(Math.random()*surprises.length)]}function secretHeart(){document.getElementById("secretMessage").textContent="You found my secret. I love you, David. ❤️ — Alice"}
let audioCtx=null,playing=false,timer=null,activeAudio=null;
function toggleMusic(){
  const btn=document.getElementById("musicBtn");
  if(!btn) return;
  const d=data();
  if(Array.isArray(d.playlist) && d.playlist.length){ showPanel("playlist"); return; }
  try{
    const Ctx=window.AudioContext||window.webkitAudioContext;
    if(!Ctx) throw new Error("AudioContext unavailable");
    if(!audioCtx || audioCtx.state==="closed") audioCtx=new Ctx();
    if(audioCtx.state==="suspended") audioCtx.resume();
    if(playing){
      clearInterval(timer); timer=null; playing=false;
      btn.textContent="♫ Play our little soundtrack";
      return;
    }
    const notes=[261.63,329.63,392,329.63,293.66,349.23,440,392]; let i=0;
    const play=()=>{
      if(!audioCtx || audioCtx.state==="closed") return;
      const o=audioCtx.createOscillator(), g=audioCtx.createGain();
      o.type="sine"; o.frequency.value=notes[i++%notes.length];
      g.gain.setValueAtTime(.0001,audioCtx.currentTime);
      g.gain.exponentialRampToValueAtTime(.04,audioCtx.currentTime+.03);
      g.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+.62);
      o.connect(g); g.connect(audioCtx.destination); o.start(); o.stop(audioCtx.currentTime+.65);
    };
    play(); timer=setInterval(play,700); playing=true;
    btn.textContent="♫ Our little soundtrack is playing ♡";
  }catch(e){
    showMusicMessage("Tap here once more to start our little soundtrack ♡");
  }
}
function showPlaylistPlayer(){
  const d=data();
  let old=document.getElementById("musicPlayer"); if(old)old.remove();
  const box=document.createElement("div"); box.id="musicPlayer"; box.className="toast";
  box.style.maxWidth="520px"; box.style.zIndex="9999";
  box.innerHTML='<button class="x" style="float:right" onclick="this.parentElement.remove()">×</button><b>Our soundtrack 🎵</b><div id="playlistTracks"></div>';
  document.body.appendChild(box);
  const tracks=box.querySelector("#playlistTracks");
  d.playlist.forEach((x,i)=>{
    const row=document.createElement("div"); row.style.marginTop="12px";
    const label=document.createElement("div"); label.innerHTML='<b>'+esc(x.name||("Song "+(i+1)))+'</b>';
    const audio=document.createElement("audio"); audio.controls=true; audio.preload="metadata"; audio.src=x.src; audio.style.width="100%";
    row.append(label,audio); tracks.appendChild(row);
  });
}
function showMusicMessage(message){
  let old=document.getElementById("musicPlayer"); if(old)old.remove();
  const box=document.createElement("div"); box.id="musicPlayer"; box.className="toast"; box.style.maxWidth="520px"; box.style.zIndex="9999";
  box.innerHTML='<button class="x" style="float:right" onclick="this.parentElement.remove()">×</button>'+esc(message);
  document.body.appendChild(box);
}

/* V8 motion layer */
(function(){
  const symbols=['♡','♥','✦','✧','•'];
  const colors=['#ff8fa3','#b88cff','#6fc7e8','#f4c95d','#7fd6bd','#ffb38a'];
  function heart(){
    if(document.getElementById('lock')&&!document.getElementById('lock').classList.contains('hidden')) return;
    const el=document.createElement('div');el.className='floating-heart';el.textContent=symbols[Math.floor(Math.random()*symbols.length)];
    el.style.left=(8+Math.random()*84)+'vw';el.style.bottom=(Math.random()*8)+'vh';el.style.color=colors[Math.floor(Math.random()*colors.length)];el.style.fontSize=(.8+Math.random()*1.1)+'rem';
    document.body.appendChild(el);setTimeout(()=>el.remove(),5000);
  }
  function sparkle(x,y){const el=document.createElement('div');el.className='sparkle';el.textContent='✦';el.style.left=x+'px';el.style.top=y+'px';el.style.color=colors[Math.floor(Math.random()*colors.length)];document.body.appendChild(el);setTimeout(()=>el.remove(),1100)}
  function confetti(x,y){for(let i=0;i<18;i++){const el=document.createElement('i');el.className='confetti-piece';el.style.left=x+'px';el.style.top=y+'px';el.style.background=colors[i%colors.length];el.style.setProperty('--dx',(Math.random()*260-130)+'px');el.style.setProperty('--dy',(80+Math.random()*220)+'px');document.body.appendChild(el);setTimeout(()=>el.remove(),1900)}}
  document.addEventListener('click',e=>{if(e.target.closest('button')){sparkle(e.clientX,e.clientY);if(e.target.classList.contains('primary'))confetti(e.clientX,e.clientY)}});
  setInterval(heart,1500);
  window.addEventListener('scroll',()=>{document.querySelectorAll('.room,.surprise-strip,.secret,.paper,.panel').forEach(el=>{if(!el.classList.contains('reveal-on-scroll'))el.classList.add('reveal-on-scroll');const r=el.getBoundingClientRect();if(r.top<innerHeight*.92&&r.bottom>0)el.classList.add('visible')})},{passive:true});
  setTimeout(()=>window.dispatchEvent(new Event('scroll')),100);
  document.querySelectorAll('.room').forEach(card=>card.addEventListener('mousemove',e=>{const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform=`translateY(-8px) rotateX(${-y*5}deg) rotateY(${x*7}deg) scale(1.02)`}));
  document.querySelectorAll('.room').forEach(card=>card.addEventListener('mouseleave',()=>card.style.transform=''));
})();


// App installation support (PWA)
let deferredInstallPrompt = null;
window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  const btn = document.getElementById('installAppBtn');
  if (btn) btn.classList.remove('hidden');
});
window.addEventListener('appinstalled', () => {
  deferredInstallPrompt = null;
  const btn = document.getElementById('installAppBtn');
  if (btn) { btn.classList.add('hidden'); toast('Our little world is now an app ♡'); }
});
document.addEventListener('click', async (event) => {
  if (event.target && event.target.id === 'installAppBtn' && deferredInstallPrompt) {
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    event.target.classList.add('hidden');
  }
});

