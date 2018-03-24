window.onscroll = function() {stickyToggle()};

var header = document.getElementById("myTopnav");
var sticky = header.offsetTop;

// Handle whether or not header is sticky
function stickyToggle() {
  if (window.pageYOffset >= sticky) {
    header.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
  }
}

// Show menu when hamburge icon pressed
function toggleMenu() {
  if (header.className.includes("responsive") == false) {
    openMenu();
  } else {
    closeMenu();
  }
}

// Helper functions
// I mainly needed this to close the header once something was pressed in there
function openMenu() {
  header.classList.add("responsive");
}

function closeMenu() {
  header.classList.remove("responsive");
}
