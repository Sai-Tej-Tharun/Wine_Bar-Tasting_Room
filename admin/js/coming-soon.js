// SET LAUNCH DATE

const launchDate = new Date("Dec 31, 2026 00:00:00").getTime()

const timer = setInterval(function(){

const now = new Date().getTime()

const distance = launchDate - now

const days = Math.floor(distance / (1000 * 60 * 60 * 24))
const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
const seconds = Math.floor((distance % (1000 * 60)) / 1000)

document.getElementById("days").innerText = days
document.getElementById("hours").innerText = hours
document.getElementById("minutes").innerText = minutes
document.getElementById("seconds").innerText = seconds

if(distance < 0){

clearInterval(timer)

document.querySelector(".grid").innerHTML = "We are Live!"

}

},1000)


// EMAIL VALIDATION

const form = document.getElementById("subscribeForm")
const emailInput = document.getElementById("emailInput")
const message = document.getElementById("formMessage")

form.addEventListener("submit",function(e){

e.preventDefault()

const email = emailInput.value.trim()

const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/

if(!emailPattern.test(email)){

message.textContent = "Please enter a valid email address."
message.classList.remove("hidden")
message.style.color = "#ef4444"

return

}

message.textContent = "Thanks! We'll notify you when we launch."
message.classList.remove("hidden")
message.style.color = "#22c55e"

emailInput.value = ""

})