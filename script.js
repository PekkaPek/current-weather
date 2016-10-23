function ajax(endPoint, callback) {
    var req = new XMLHttpRequest();
    req.addEventListener('readystatechange', function() {    
        if (req.readyState === XMLHttpRequest.DONE && req.status === 200) {
            if (typeof callback === 'function') {
                callback(JSON.parse(req.responseText));
            }
        }
    });
    req.open('GET', endPoint);
    req.send();
}

ajax('http://api.openweathermap.org/data/2.5/weather?q=vantaa&units=metric&appid=' + apikey, function(weatherData) {
    console.log(weatherData.name);
    console.log(weatherData.main.temp);
});

