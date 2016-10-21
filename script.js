function getWeather() {
    if(req.readyState === XMLHttpRequest.DONE && req.status === 200) {
        var weatherData = JSON.parse(req.responseText);
        city = weatherData.name;
        temperature = weatherData.main.temp;
    }
}

var req = new XMLHttpRequest();
req.addEventListener('readystatechange', getWeather);
req.open('GET', 'http://api.openweathermap.org/data/2.5/weather?q=vantaa&units=metric&appid=' + apikey);
req.send();

