/* Safe standalone entrance screen controller. */
(function(){
  function forceEntrance(){
    const app=document.getElementById("app");
    const tools=document.querySelector(".app-tools");
    const hero=document.querySelector(".hero");
    if(!app) return;
    app.classList.add("entrance-active");
    if(tools) tools.style.visibility="hidden";
    if(hero) hero.style.display="flex";
  }

  function revealWorld(){
    const app=document.getElementById("app");
    const hero=document.querySelector(".hero");
    const tools=document.querySelector(".app-tools");
    const welcome=document.getElementById("welcome");
    if(app) app.classList.remove("entrance-active");
    if(tools) tools.style.visibility="";
    if(hero) hero.style.display="none";
    if(welcome){
      welcome.classList.remove("hidden");
      welcome.setAttribute("tabindex","-1");
      setTimeout(()=>welcome.scrollIntoView({behavior:"smooth",block:"start"}),50);
    }
  }

  window.openLetter=revealWorld;

  const style=document.createElement("style");
  style.id="entranceRuntimeStyle";
  style.textContent=
    ".app.entrance-active main>*:not(#welcome),.app.entrance-active footer{display:none!important}"+
    ".app.entrance-active #welcome{display:none!important}"+
    ".app.entrance-active .hero{min-height:calc(100vh - 30px);box-sizing:border-box;display:flex!important;flex-direction:column;justify-content:center}"+
    ".app.entrance-active .app-tools{visibility:hidden!important;pointer-events:none!important}";
  document.head.appendChild(style);

  function start(){
    forceEntrance();
    const btn=document.getElementById("openWorldBtn");
    if(btn) btn.onclick=revealWorld;
  }

  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",start,{once:true});
  else start();
})();