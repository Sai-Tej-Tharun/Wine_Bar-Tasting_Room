function loadComponent(id,file){

fetch(file)
.then(res=>res.text())
.then(data=>{

document.getElementById(id).innerHTML = data

if(id === "navbar"){
initNavbar()
}

})

}

loadComponent("navbar","../components/navbar.html")