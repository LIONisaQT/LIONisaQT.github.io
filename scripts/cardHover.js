function tiltCard(t,e){var n,r,i=t.clientX,o=t.clientY,a=e.getBoundingClientRect(),l=a.left+a.width/2,c=a.top+a.height/2;r=i>l?-3:i<l?3:0,n=o>c?3:o<c?-3:0,e.style.transform="perspective(300px) rotateX("+n+"deg) rotateY("+r+"deg)"}function resetCard(t){t.style.transform=""}