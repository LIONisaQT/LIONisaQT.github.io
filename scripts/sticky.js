window.onscroll = function() {stickyToggle()};

var header = document.getElementById("myTopnav");
var sticky = header.offsetTop;

function stickyToggle() {
  if (window.pageYOffset >= sticky) {
    header.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
  }
}