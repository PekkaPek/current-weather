function getWeather() {
    if(req.readyState === XMLHttpRequest.DONE && req.status === 200) {
        console.log(req.responseText);
    }
}

var req = new XMLHttpRequest();
req.addEventListener('readystatechange', getWeather);
req.open('GET', 'http://api.openweathermap.org/data/2.5/weather?q=vantaa&units=metric&appid=' + apikey);
req.send();

