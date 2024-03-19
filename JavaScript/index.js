//clock js
let time = document.getElementById("clock");

setInterval(() =>{
    let t = new Date();
    let options = { hour: '2-digit', minute: '2-digit' };
    time.innerHTML = t.toLocaleTimeString([], options);
},1000) // note: Initial display will take 1000 milliseconds to display.
//clock js

//refresh background image
function refresh(){
    window.location.reload();
}