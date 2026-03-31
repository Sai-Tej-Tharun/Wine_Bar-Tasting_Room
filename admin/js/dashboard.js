
// sidebar toggle

const menuToggle = document.getElementById("menuToggle")
const sidebar = document.getElementById("sidebar")

menuToggle.addEventListener("click",()=>{

sidebar.classList.toggle("w-16")

})


// profile dropdown

const profileBtn = document.getElementById("profileBtn")
const profileMenu = document.getElementById("profileMenu")

profileBtn.addEventListener("click",()=>{

profileMenu.classList.toggle("hidden")

})


// MEMBERSHIP CHART

const membersChart = new Chart(

document.getElementById('membersChart'),

{
type:'line',

data:{
labels:['Jan','Feb','Mar','Apr','May','Jun'],
datasets:[{
label:'Members',
data:[120,190,300,350,420,520],
borderColor:'#D4A373',
backgroundColor:'rgba(212,163,115,0.2)',
tension:.4
}]
},

options:{
responsive:true,
plugins:{legend:{display:false}}
}

}
)


// BOOKINGS CHART

const bookingChart = new Chart(

document.getElementById('bookingChart'),

{
type:'bar',

data:{
labels:['Jan','Feb','Mar','Apr','May','Jun'],
datasets:[{
label:'Bookings',
data:[30,50,40,60,80,70],
backgroundColor:'#8A5A1F'
}]
},

options:{
responsive:true,
plugins:{legend:{display:false}}
}

}
)


// TABLE SORT

document.querySelectorAll("th[data-sort]").forEach(header=>{

header.addEventListener("click",()=>{

const table = header.closest("table")
const tbody = table.querySelector("tbody")
const index = Array.from(header.parentNode.children).indexOf(header)

const rows = Array.from(tbody.querySelectorAll("tr"))

rows.sort((a,b)=>{

return a.children[index].innerText.localeCompare(b.children[index].innerText)

})

rows.forEach(tr=>tbody.appendChild(tr))

})

})