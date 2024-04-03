//clock js
let time = document.getElementById("clock");

setInterval(() => {
    let t = new Date();
    let timeOptions = { hour: '2-digit', minute: '2-digit' };
    let dateOptions = { day: '2-digit', month: 'short', year: 'numeric' };
    
    let formattedTime = t.toLocaleTimeString([], timeOptions);
    let formattedDate = t.toLocaleDateString([], dateOptions);
    
    time.innerHTML = `${formattedTime} &nbsp; ${formattedDate}`;
}, 1000); // note: Initial display will take 1000 milliseconds to display.

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
    linksContainer.innerHTML = "";
    links.forEach((link, index) => {
        const linkDiv = document.createElement("div");
        linkDiv.classList.add("link");
        linkDiv.innerHTML = `
            <div class="link-content">
                <img class="favicon" src="https://www.google.com/s2/favicons?sz=64&domain=${link.url}" alt="Favicon">
                <div class="link-info">
                    <a href="${link.url}" target="_blank">${link.title}</a>
                    <button id="deletebtn" onclick="removeLink(${index})"><i class="fa-regular fa-circle-xmark"></i></button>
                </div>
            </div>
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
// 
//Displays the existing links and notes when running the website  
window.onload = function() {
    displayLinks();
    getNotes();
    getCurrentPosition();
};

// saving notes to local storage
function getNotes() {
var notes = document.getElementById('notes');

if(localStorage.getItem('noted')){
    notes.value = localStorage.getItem('noted');
}

notes.addEventListener('input', function() {
    localStorage.setItem('noted', notes.value);
});
}


// function to get fetch data from SMHI api
function getWeatherData(lon, lat) {
    var url = 'https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/' + lon + '/lat/' + lat + '/data.json';
    
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            weatherData = data;
            getWeather(lon, lat);
            getTomorrowWeather(lon, lat);
            return data; 
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            throw error;
        });
}

// function to get todays weather and temperature
function getWeather() {

    var temperature = weatherData.timeSeries[0].parameters.find(param => param.name === 't').values[0];
    var weatherCode = weatherData.timeSeries[0].parameters.find(param => param.name === 'Wsymb2').values[0];
    var weatherDescription = getWeatherDescription(weatherCode);
    var weatherEmoji = getWeatherEmoji(weatherCode);

    document.getElementById('temperature').textContent = temperature;
    document.getElementById('weather').textContent = weatherDescription;
    document.getElementById('Emoji').textContent = weatherEmoji;
}

// function to get tomorrows weather and temperature
function getTomorrowWeather() {

    var currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 1); // Get tomorrow's date
    currentDate.setHours(12, 0, 0, 0); // Set time to 12:00:00

    var tomorrowDate = currentDate.toISOString().split('T')[0]; // Format date as YYYY-MM-DD

    var forecast = weatherData.timeSeries.find(entry => entry.validTime.startsWith(tomorrowDate)); // Find the forecast entry for tomorrow
    if (forecast) {
        var temperature = forecast.parameters.find(param => param.name === 't').values[0];
        var weatherCode = forecast.parameters.find(param => param.name === 'Wsymb2').values[0];
        var weatherDescription = getWeatherDescription(weatherCode);
        var weatherEmoji = getWeatherEmoji(weatherCode);

        document.getElementById('temperatureT').textContent = temperature;
        document.getElementById('weatherT').textContent = weatherDescription;
        document.getElementById('EmojiT').textContent = weatherEmoji;
    } else {
        console.error('No forecast available for tomorrow at 12:00.');
    }
}
// Get location
navigator.geolocation.getCurrentPosition(function(position) {
    var lon = position.coords.longitude;
    var lat = position.coords.latitude;
    getWeatherData(lon, lat);
}, function(error) {
    console.error('Error getting geolocation:', error);
});

// Weather Emoji
function getWeatherEmoji(code) {
    switch(code) {
        case 1: return '🌞'; // Clear sky 
        case 2: return '🌤️'; // Nearly clear sky 
        case 3: return '⛅'; //Variable cloudiness
        case 4: return '⛅'; //Halfclear sky 
        case 5: return '☁️'; //Cloudy sky 
        case 6: return '☁️'; // Overcast
        case 7: return '🌫️'; //Fog
        case 8: return '🌦️'; //Light rain showers 
        case 9: return '🌧️'; //Moderate rain showers 
        case 10: return '🌧️'; //Heavy rain showers
        case 21: return '⛈️'; //Thunder 
        case 25: return '❄️'; //Light snowfall
        default: return '🤷'; //Unknown
    }
}

// function to get weather description
function getWeatherDescription(code) {
    switch(code) {
        case 1: return 'Clear sky'; 
        case 2: return 'Nearly clear sky'; 
        case 3: return 'Variable cloudiness';
        case 4: return 'Halfclear sky';
        case 5: return 'Cloudy sky';
        case 6: return 'Overcast';
        case 7: return 'Fog';
        case 8: return 'Light rain showers'; 
        case 9: return 'Moderate rain showers'; 
        case 10: return 'Heavy rain showers';
        case 21: return 'Thunder'; 
        case 25: return 'Light snowfall';
        default: return 'Unknown';
    }
}

//
const headline = document.getElementById('headline');

headline.addEventListener('blur', function() {

    localStorage.setItem('headlineText', headline.innerText);
});

if (localStorage.getItem('headlineText')) {

    headline.innerText = localStorage.getItem('headlineText');
}