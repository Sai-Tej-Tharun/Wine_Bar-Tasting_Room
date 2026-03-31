function initNavbar(){

const burger = document.getElementById("navBurger")
const mobileMenu = document.getElementById("mobileMenu")

if(burger){
burger.addEventListener("click",()=>{
mobileMenu.classList.toggle("open")
})
}

document.querySelectorAll(".mob-toggle").forEach(btn=>{

btn.addEventListener("click",()=>{

const sub = btn.nextElementSibling
sub.classList.toggle("open")

})

})

}