var lightMode = true;

function toggleMode() {
  if (lightMode) {
    document.body.style.backgroundColor="#333";
    document.getElementById('nameTitle').style.color="#eee";
    document.getElementById('header').style.backgroundColor="#222";
    document.getElementById('wrapper').style.color="#eee";
    document.getElementById('wrapper').style.backgroundColor="#333";
    let notes = document.getElementsByClassName('projectNote');
    for (let i = 0; i < notes.length; i++) {
      notes[i].style.color="#bbb";
    }
    lightMode = false;
  } else {
    document.body.style.backgroundColor="#eee";
    document.getElementById('nameTitle').style.color="#333";
    document.getElementById('header').style.backgroundColor="#333";
    document.getElementById('wrapper').style.color="#333";
    document.getElementById('wrapper').style.backgroundColor="#eee";
    let notes = document.getElementsByClassName('projectNote');
    for (let i = 0; i < notes.length; i++) {
      notes[i].style.color="#535353";
    }
    lightMode = true;
  }
}
