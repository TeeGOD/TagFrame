 var IsGlossaryOpen = false;

window.onload = () => {
  const glossary_btn = document.querySelector(".glossary_btn");
  const glossary_div = document.querySelector("#glossary_div");
  const glossary_div_container = document.querySelector("#glossary_div_container");
  const search_bar = document.querySelector("#move_search");
  const search_bar_btn = document.querySelector("#search_button_img")
  var character_name = search_bar.dataset.charactername

  glossary_btn.addEventListener("click", function(){ToggleGlossary();})  
  search_bar_btn.addEventListener("click", function(){window.location.reload();})

    search_bar.addEventListener("keyup", function(){
      if(search_bar.value != ""){
      window.history.pushState(null, document.title, "?character=" + character_name + "&search=" + search_bar.value);
      }else{
      window.history.pushState(null, document.title, "?character=" + character_name);
      window.location.reload();
      }
  })

  glossary_div_container.addEventListener("click", function(){
    ToggleGlossary()
  })
}

ToggleGlossary = function(){
    if(IsGlossaryOpen == false){
        IsGlossaryOpen = true;
        glossary_div.style.display='flex';
        glossary_div_container.style.display='flex';
        disableScroll();
      }else{
        IsGlossaryOpen = false;
        glossary_div.style.display='none';
        glossary_div_container.style.display='none';
        enableScroll();
    }

}

search_bar_reload = function(){
  if(event.key === 'Enter') {
  window.location.reload();
  }
}

// locking scroll functions
// left: 37, up: 38, right: 39, down: 40,
// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
var keys = {37: 1, 38: 1, 39: 1, 40: 1};

function preventDefault(e) {
  e.preventDefault();
}
function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}
var supportsPassive = false;
try {
  window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
    get: function () { supportsPassive = true; } 
  }));
} catch(e) {}
var wheelOpt = supportsPassive ? { passive: false } : false;
var wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';
// call this to Disable
function disableScroll() {
  window.addEventListener('DOMMouseScroll', preventDefault, false); // older FF
  window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
  window.addEventListener('keydown', preventDefaultForScrollKeys, false);
  // document.body.style.overflow = 'hidden';
}
// call this to Enable
function enableScroll() {
  window.removeEventListener('DOMMouseScroll', preventDefault, false);
  window.removeEventListener(wheelEvent, preventDefault, wheelOpt); 
  window.removeEventListener('keydown', preventDefaultForScrollKeys, false);
  // document.body.style.overflow = 'visible';

}