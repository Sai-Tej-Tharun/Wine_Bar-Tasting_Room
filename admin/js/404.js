// subtle page animation

document.addEventListener("DOMContentLoaded",()=>{

const title = document.querySelector(".error-title")

title.style.opacity = 0
title.style.transform = "translateY(20px)"

setTimeout(()=>{

title.style.transition = "all .6s ease"
title.style.opacity = 1
title.style.transform = "translateY(0)"

},200)

})