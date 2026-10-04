/* Safe standalone entrance screen controller — keeps the main app logic untouched. */
(function(){
  function revealWorld(){
    const hero=document.querySelector(".hero");
    const welcome=document.getElementById("welcome");
    const tools=document.querySelector(".app-tools");
    if(hero) hero.classList.add("entrance-complete");
    if(tools) tools.classList.remove("entrance-hidden");
    if(welcome){
      welcome.classList.remove("hidden");
      welcome.setAttribute("tabindex","-1");
      setTimeout(()=>welcome.scrollIntoView({behavior:"smooth",block:"start"}),50);
    }
  }

  window.openLetter=revealWorld;

  const style=document.createElement("style");
  style.textContent=
    ".entrance-hidden{visibility:hidden;pointer-events:none}"+
    ".hero.entrance-complete{display:none}"+
    ".hero:not(.entrance-complete){min-height:calc(100vh - 30px);box-sizing:border-box;display:flex;flex-direction:column;justify-content:center}"+
    ".hero:not(.entrance-complete) .scroll-note{margin-top:30px}";
  document.head.appendChild(style);

  document.addEventListener("DOMContentLoaded",()=>{
    document.querySelector(".app-tools")?.classList.add("entrance-hidden");
  });
})();