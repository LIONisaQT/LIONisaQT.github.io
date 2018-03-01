let lightMode;
if (localStorage.getItem('isLight') === null) {
    console.log('isLight does not exist');
    localStorage.setItem('isLight', 0)
} else {
    console.log('isLight exists');
}
lightMode = localStorage.getItem('isLight');
console.log('lightMode set to ' + lightMode);

window.onload = function() {
    if (lightMode == 1) {
        console.log('because lightMode is ' + lightMode + ', setting up page with light theme');
        document.body.style.backgroundColor="#eee";
        document.getElementById('nameTitle').style.color="#333";
        document.getElementById('header').style.backgroundColor="#333";
        document.getElementById('header').classList.add('dark-header');
        document.getElementById('wrapper').style.color="#333";
        document.getElementById('wrapper').style.backgroundColor="#eee";
        let notes = document.getElementsByClassName('projectNote');
        for (let i = 0; i < notes.length; i++) {
          notes[i].style.color="#535353";
        }
    } else if (lightMode == 0) {
        console.log('because lightMode is ' + lightMode + ', setting up page with dark theme');
        document.body.style.backgroundColor="#333";
        document.getElementById('nameTitle').style.color="#eee";
        document.getElementById('header').style.backgroundColor="#222";
        document.getElementById('header').classList.add('darker-header');
        document.getElementById('wrapper').style.color="#eee";
        document.getElementById('wrapper').style.backgroundColor="#333";
        let notes = document.getElementsByClassName('projectNote');
        for (let i = 0; i < notes.length; i++) {
          notes[i].style.color="#bbb";
        }
    } else {
        console.log('lightMode is ' + lightMode + ', you shouldn\'t be here wtf');
    }
}

function toggleMode() {
    if (lightMode == 1) {
        console.log('switching to dark theme');
        document.body.style.backgroundColor="#333";
        document.getElementById('nameTitle').style.color="#eee";
        // document.getElementById('header').style.backgroundColor="#222";
        document.getElementById('header').classList.remove('dark-header');
        document.getElementById('header').classList.add('darker-header');
        document.getElementById('wrapper').style.color="#eee";
        document.getElementById('wrapper').style.backgroundColor="#333";
        let notes = document.getElementsByClassName('projectNote');
        for (let i = 0; i < notes.length; i++) {
          notes[i].style.color="#bbb";
        }
        lightMode = 0;
        localStorage.setItem('isLight', lightMode);
    } else if (lightMode == 0) {
        console.log('switching to light theme');
        document.body.style.backgroundColor="#eee";
        document.getElementById('nameTitle').style.color="#333";
        document.getElementById('header').style.backgroundColor="#333";
        document.getElementById('header').classList.remove('darker-header');
        document.getElementById('header').classList.add('dark-header');
        document.getElementById('wrapper').style.color="#333";
        document.getElementById('wrapper').style.backgroundColor="#eee";
        let notes = document.getElementsByClassName('projectNote');
        for (let i = 0; i < notes.length; i++) {
          notes[i].style.color="#535353";
        }
        lightMode = 1;
        localStorage.setItem('isLight', lightMode);
    }
}
