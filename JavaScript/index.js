//clock js
let time = document.getElementById("clock");

setInterval(() =>{
    let t = new Date();
    let options = { hour: '2-digit', minute: '2-digit' };
    time.innerHTML = t.toLocaleTimeString([], options);
},1000) // note: Initial display will take 1000 milliseconds to display.

//refresh background image
function refresh(){
    window.location.reload();
}

// function open Add Link Modal

function openAddLink () {
    document.getElementById("addLinkModal").style.display ="flex";
}

// function close Add Link Modal

function closeAddLink () {
    document.getElementById("addLinkModal").style.display ="none";
}

// Retrive links from local storage / initilalise array links
let links = JSON.parse(localStorage.getItem('links')) || [];

//function to display links
function displayLinks(){
    const linksContainer = document.getElementById("linksContainer");
    linksContainer.innerHTML ="";
    links.forEach((link, index) => {
        const linkDiv = document.createElement("div");
        linkDiv.classList.add("link");
        linkDiv.innerHTML = `
        <a href="${link.url}" target="_blank"><img src="https://www.google.com/s2/favicons?sz=64&domain=${link.url}" alt="Favicon"><br>${link.title}</a>
        <button onclick="removeLink(${index})">Remove</button>
        `;
        linksContainer.appendChild(linkDiv);
    });
}

// Takes the values given and creates an object with a url and tilte and then adds them to the array "links"
function addLink() {
    const url = document.getElementById("linkUrl").value;
    const title = document.getElementById("linkTitle").value;
    if(url && title) {
        links.push({url, title});
        displayLinks();
        saveLinks();
    } else {
        alert("Please enter URL and title for the link.");
    }
}
// stores the link as a string in local storage
function saveLinks() {
    localStorage.setItem('links', JSON.stringify(links));
}
//function to remove a link
function removeLink(index) {
    links.splice(index, 1);
    displayLinks();
    saveLinks();
}
//Displays the existing links when running the website  
window.onload = function() {
    displayLinks();
};
