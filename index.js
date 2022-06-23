function setURL(url){
    document.getElementById('view').src = url;
    var x = document.getElementsByClassName('row')[0];
    if(x.classList.contains('yt'))
        x.classList.remove('yt');
}
window.onload = function() {
    EvalSound("Music1");
    resize();
}
var currentPlayer;
function EvalSound(soundobj) {
    if(soundobj === "stop") {
        currentPlayer.pause();
        currentPlayer.currentTime = 0;
        return;
    }
    var thissound = document.getElementById(soundobj);
    if(currentPlayer && currentPlayer != thissound)
        currentPlayer.pause();
    if (thissound.paused)
        thissound.play();
    if (currentPlayer != thissound)
        thissound.currentTime = 0;
    currentPlayer = thissound;
}
function compareText() {
    var text = document.getElementById("text").value;
    if (text.toUpperCase() === "5A4NJ" || text.toUpperCase() === "54ANJ") {
        setURL('Assets/Text/');
        EvalSound('Music2');
        stopMusic();
    } else {
        alert("Invalid Code. Access Denied. Try Again.");
    }
}
function checkEnter(event) {
    if (event.keyCode == 13) {
        compareText();
        return false;
    }
}
function check() {
    if(screen.width >= 720)
        setURL('Assets/Blank.html');
    else
        setURL('https://www.youtube.com/embed/jEgAAyIPYPc?list=PLu4obm2oOEJ3sUG3aUsTNEmZXdjlopXT4&autoplay=1&loop=1');
    var x = document.getElementsByClassName('row')[0];
    if(!x.classList.contains('yt'))
        x.classList.add('yt');
}
function resize() {
    console.log(screen.width);
    var mains = document.querySelectorAll("#menu");
    if(screen.width < 720) {
        for(var i = 0; i < mains.length; i++){
            mains[i].classList.remove("btn-lg");
            mains[i].classList.add("btn-sm");
        }
    }
    else {
        for(var i = 0; i < mains.length; i++){
            mains[i].classList.remove("btn-sm");
            mains[i].classList.add("btn-lg");
        }
    }
}