function getCoords(event, target) {
  let mouseX = event.clientX;
  let mouseY = event.clientY;
  let centerX = target.offsetLeft + target.offsetWidth / 2;
  let centerY = target.offsetTop + target.offsetHeight / 2;
  console.log(target.style.transform = "perspective(300px) rotateX(3deg) rotateY(3deg)");
  // if (mouseX > centerX) {
  //   target.
  // }
  // console.log(centerX + ', ' + centerY);
  // console.log(ele.id + ': ' +x + ', ' + y);
}
