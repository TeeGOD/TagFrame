var IsGlossaryOpen = false;
var IsMoveDetailOpen = false;

window.onload = () => {
  const glossary_btn = document.querySelector(".glossary_btn");
  const glossary_div = document.querySelector("#glossary_div");
  const glossary_div_container = document.querySelector("#glossary_div_container");

  const move_cards = document.querySelectorAll(".move_card");
  
  const move_detail_div = document.querySelector("#move_detail_div");
  const move_detail_div_container = document.querySelector("#move_detail_div_container");
  const paragraphs_container = document.querySelector("#paragraphs_container")

  const search_bar = document.querySelector("#move_search");
  const search_bar_btn = document.querySelector("#search_button_img")
  var character_name = search_bar.dataset.charactername

  glossary_btn.addEventListener("click", function(){ToggleGlossary();}) 
  search_bar_btn.addEventListener("click", function(){window.location.reload();})

  glossary_div_container.addEventListener("click", function(){ToggleGlossary();})
  glossary_div.addEventListener("click", function(){event.stopPropagation();})

  move_detail_div_container.addEventListener("click", function(){ToggleMoveDetail();})
  move_detail_div.addEventListener("click", function(){event.stopPropagation();})


// function for the search bar, the logic for the search is handled in python. at view.py
    search_bar.addEventListener("keyup", function(){
      if(search_bar.value != ""){
        window.history.pushState(null, document.title, "?character=" + character_name + "&search=" + search_bar.value);
      }else{
        window.history.pushState(null, document.title, "?character=" + character_name);
        window.location.reload();
      }
  })

// function for 
  move_cards.forEach( move_card=>{
    move_card.addEventListener("click", function(){
      ToggleMoveDetail();
      var moveKeysDiv = move_card.children[0]
      console.log(moveKeysDiv)
      var moveDetails = getMoveDetail(this.dataset.moveid).then(moveDetails => {
        var InputKeys = moveKeysDiv.cloneNode(true)
        InputKeys.classList.add("move_infos_var")
        InputKeys.style.color = "white"
        paragraphs_container.append(InputKeys)

        Object.entries(moveDetails).forEach(moveDetail => {
          var paragraph = document.createElement("p")
            paragraph.classList.add("move_infos_var")
            paragraph.style.color = "white"
            paragraph.style.fontSize = "25px"
            paragraph.innerText = moveDetail[0].replace("_", " ")+": "+moveDetail[1].replace("NULL", "").replace("KND", "Knockdown")
            paragraphs_container.append(paragraph)
        });

      })
       
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
    var ElementsToDelete = document.querySelectorAll(".move_infos_var")
    console.log(ElementsToDelete)
    ElementsToDelete.forEach(element => {
      element.remove()
    });
    
    
  }
}

search_bar_reload = function(){
  if(event.key === 'Enter') {
  window.location.reload();
  }
}

async function getMoveDetail(moveId){
  var moveDetails = await fetch("/move/"+moveId)
  var data = await moveDetails.json()
      // then(response => response.json())
    
  return data
}

// a key map of allowed keys
var allowedKeys = {
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down',
  65: 'a',
  66: 'b'
};

// the 'official' Konami Code sequence
var konamiCode = ['up', 'up', 'down', 'down', 'left', 'right', 'left', 'right', 'b', 'a'];

// a variable to remember the 'position' the user has reached so far.
var konamiCodePosition = 0;

// add keydown event listener
document.addEventListener('keydown', function(e) {
  // get the value of the key code from the key map
  var key = allowedKeys[e.keyCode];
  // get the value of the required key from the konami code
  var requiredKey = konamiCode[konamiCodePosition];

  // compare the key with the required key
  if (key == requiredKey) {

    // move to the next key in the konami code sequence
    konamiCodePosition++;

    // if the last key is reached, activate cheats
    if (konamiCodePosition == konamiCode.length) {
      activateCheats();
      konamiCodePosition = 0;
    }
  } else {
    konamiCodePosition = 0;
  }
});

function activateCheats() {
  doryaSound.volume = 0.30
  doryaSound.play();
}