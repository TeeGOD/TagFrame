var IsGlossaryOpen = false;
var IsMoveDetailOpen = false;

window.onload = () => {
  const glossary_btn = document.querySelector(".glossary_btn");
  const glossary_div = document.querySelector("#glossary_div");
  const glossary_div_container = document.querySelector("#glossary_div_container");

  const move_cards = document.querySelectorAll(".move_card");
  
  const move_detail_div = document.querySelector("#move_detail_div");
  const move_detail_div_container = document.querySelector("#move_detail_div_container");
  const move_detail_div_right = document.querySelector(".move_detail_div_right")

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
      var moveDetails = getMoveDetail(this.dataset.moveid).then(moveDetails => {
        Object.entries(moveDetails).forEach(moveDetail => {
          // move_detail_div_right.append(document.CreateElement("p"))
          console.log(moveDetail)
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