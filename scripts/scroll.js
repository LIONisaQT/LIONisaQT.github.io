window.onscroll = function() {
  addTopButton();
};

// Check whether to top button is necessary
function addTopButton() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    document.getElementById("to-top").style.display = "block";
  } else {
    document.getElementById("to-top").style.display = "none";
  }
}

function toTop() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

// Show menu when hamburger icon pressed
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
