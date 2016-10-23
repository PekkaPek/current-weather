function getWeather(callback) {
    if(req.readyState === XMLHttpRequest.DONE && req.status === 200) {
        var weatherData = JSON.parse(req.responseText);
        callback(weatherData);
    }
}

function showWeather(weatherData) {
    console.log(weatherData.name);
    console.log(weatherData.main.temp);
}

var req = new XMLHttpRequest();
req.addEventListener('readystatechange', function() {getWeather(showWeather)});
req.open('GET', 'http://api.openweathermap.org/data/2.5/weather?q=vantaa&units=metric&appid=' + apikey);
req.send();

