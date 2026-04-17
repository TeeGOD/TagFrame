var IsGlossaryOpen = false;
var IsMoveDetailOpen = false;

window.onload = () => {
  const glossary_btn = document.querySelector(".glossary_btn");
  const glossary_div = document.querySelector("#glossary_div");
  const glossary_div_container = document.querySelector("#glossary_div_container");

  const move_cards = document.querySelectorAll(".move_card");
  
  const move_detail_div = document.querySelector("#move_detail_div");
  const move_detail_div_container = document.querySelector("#move_detail_div_container");

  const search_bar = document.querySelector("#move_search");
  const search_bar_btn = document.querySelector("#search_button_img")
  var character_name = search_bar.dataset.charactername

  glossary_btn.addEventListener("click", function(){ToggleGlossary();})  
  move_detail_div_container.addEventListener("click", function(){ToggleMoveDetail();})
  search_bar_btn.addEventListener("click", function(){window.location.reload();})

// function for the search bar, the logic for the search is handled in python. at view.py
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

  move_cards.forEach( move_card=>{
    move_card.addEventListener("click", function(){
      ToggleMoveDetail();
      GetMoveDetail(this.dataset.moveid);
      // console.log(this.dataset.moveid);
    })
  })

}

//All functions

// function to open and close the glossary
ToggleGlossary = function(){
    if(IsGlossaryOpen == false){
        IsGlossaryOpen = true;
        glossary_div.style.display='flex';
        glossary_div_container.style.display='flex';
        document.body.style.overflow = 'hidden'
      }else{
        IsGlossaryOpen = false;
        glossary_div.style.display='none';
        glossary_div_container.style.display='none';
        document.body.style.overflow = 'visible'
    }

}

ToggleMoveDetail = function(){
  if(IsMoveDetailOpen == false){
    IsMoveDetailOpen = true;
    move_detail_div.style.display='flex';
    move_detail_div_container.style.display='flex';
    document.body.style.overflow = 'hidden'
  }else{
    IsMoveDetailOpen = false;
    move_detail_div.style.display='none';
    move_detail_div_container.style.display='none';
    document.body.style.overflow = 'visible'
  }
}

search_bar_reload = function(){
  if(event.key === 'Enter') {
  window.location.reload();
  }
}

function GetMoveDetail(moveId){
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open( "GET", "../move/"+moveId, true ); // false for synchronous request
  xmlHttp.send( null );
  return xmlHttp.responseText;
}

// // locking scroll functions
// // left: 37, up: 38, right: 39, down: 40,
// // spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
// var keys = {37: 1, 38: 1, 39: 1, 40: 1};

// function preventDefault(e) {
//   e.preventDefault();
// }
// function preventDefaultForScrollKeys(e) {
//     if (keys[e.keyCode]) {
//         preventDefault(e);
//         return false;
//     }
// }
// var supportsPassive = false;
// try {
//   window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
//     get: function () { supportsPassive = true; } 
//   }));
// } catch(e) {}
// var wheelOpt = supportsPassive ? { passive: false } : false;
// var wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';
// // call this to Disable
// function disableScroll() {
//   window.addEventListener('DOMMouseScroll', preventDefault, false); // older FF
//   window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
//   window.addEventListener('keydown', preventDefaultForScrollKeys, false);
//   // document.body.style.overflow = 'hidden';
// }
// // call this to Enable
// function enableScroll() {
//   window.removeEventListener('DOMMouseScroll', preventDefault, false);
//   window.removeEventListener(wheelEvent, preventDefault, wheelOpt); 
//   window.removeEventListener('keydown', preventDefaultForScrollKeys, false);
//   // document.body.style.overflow = 'visible';

// }