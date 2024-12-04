console.log("surur krte h js")
let currentsong = new Audio();
let songUl;
let songs;
let currfolder;
function formatTime(seconds) {
  if(isNaN(seconds) || seconds<0){
    return "00:00";
  }
  // Ensure the input is a positive integer
  seconds = Math.max(0, Math.floor(seconds));
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  // Pad seconds with leading zero if less than 10
  const paddedSeconds = remainingSeconds.toString().padStart(2, '0');
  
  return `${minutes}:${paddedSeconds}`;
}




 async function getsongs(folder) {
  currfolder = folder;
    let a = await fetch(`http://127.0.0.1:3000/${folder}/`);
let response = await a.text();
console.log(response)

let div = document.createElement("div")
div.innerHTML = response;
let as = div.getElementsByTagName("a")
let songs = []
for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if(element.href.endsWith(".mp3")){
        songs.push(element.href.split(`/${folder}/`)[1])
    }
    
}
return songs
}

const playmusic = (track,pause = false) => {
  // let audio = new Audio("/songs/" + track)
  currentsong.src = `/${currfolder}/` + track
  if(!pause){
    currentsong.play()
    play.src = "pause.svg"
  }
 
 
 document.querySelector(".songinfo").innerHTML = decodeURI(track)
 document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}

async function main() {
  
    songs = await getsongs("songs/ncs");
    playmusic(songs[0] , true)
 console.log(songs)
 songUl = document.querySelector(".songslist").getElementsByTagName("ul")[0];
for (const song of songs) {
songUl.innerHTML = songUl.innerHTML + `<li> <img class="invert" src="music.svg" alt="">
                  <div class="info">
                    <div>${song.replaceAll("%20"," ")}</div>
                    <div>Harsh Nagar</div>
                  </div>
                  <div class="playnow">
                    <span>Play Now</span>
                    <img class="invert" src="play.svg" alt="">
                  </div>
                 
                </li>` ;   
}

//attach an event listener to each song
Array.from(document.querySelector(".songslist").getElementsByTagName("li")).forEach(e=>{
  e.addEventListener("click" , element=>{
    console.log(e.querySelector(".info").firstElementChild.innerHTML)
    playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
  })
 
})
//attach an event listener to play.previous , next song
play.addEventListener("click", ()=>{
  if(currentsong.paused){
    currentsong.play()
    play.src = "pause.svg"
  }
  else{
    currentsong.pause()
    play.src = "play.svg"
  }
})
//fot time update
currentsong.addEventListener("timeupdate" , () => {
  console.log(currentsong.currentTime, currentsong.duration);
  document.querySelector(".songtime").innerHTML = `${formatTime(currentsong.currentTime)} / ${formatTime(currentsong.duration)}`
  document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 +"%"
})
//seekbar ko chlana
document.querySelector(".seekbar").addEventListener("click",e =>{
  let percent = (e.offsetX/e.target.getBoundingClientRect().width) * 100;
document.querySelector(".circle").style.left =  percent + "%"
currentsong.currentTime = ((currentsong.duration)* percent) / 100
})
//hamburger ke liye event 
document.querySelector(".hamburger").addEventListener("click" , () => {
  document.querySelector(".left").style.left = "0"
})
//close ke liye
document.querySelector(".close").addEventListener("click" , () => {
  document.querySelector(".left").style.left = "-120%"
})
//previous k liye
previous.addEventListener("click", ()=>{
  console.log("previous")
  let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
  if(((index-1)>=0)){
    playmusic(songs[index -1])
  }
 
})
next.addEventListener("click", ()=>{
  console.log("next")
  let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
  if((index+1)< songs.length){
    playmusic(songs[index + 1])
  }
  
})
//volume ko kam YA Jyada k liye
document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change" , (e)=>{
  currentsong.volume = parseInt(e.target.value)/100
})
//card pe click krne pe library load
Array.from(document.getElementsByClassName("card")).forEach(e =>{
  e.addEventListener("click" , async item =>{
    songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`);
    
  })
})


}
 main()