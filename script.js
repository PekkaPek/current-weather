function ajax(endPoint, callback) {
    if (typeof callback !== 'function') {
        throw new Error('Callback provided is not a function');
    }
    var req = new XMLHttpRequest();
    req.addEventListener('readystatechange', function() {    
        if (req.readyState === XMLHttpRequest.DONE && req.status === 200) {
           callback(JSON.parse(req.responseText));
        }
    });
    req.open('GET', endPoint);
    req.send();
}

function printData(searchedCity) {
    ajax('http://api.openweathermap.org/data/2.5/weather?q=' + searchedCity + '&units=metric&appid=' + apikey, function(weatherData) {
        document.getElementById('searchedCity').innerHTML = weatherData.name;
        document.getElementById('searchedCityTemperature').innerHTML = weatherData.main.temp;
        document.getElementById('weatherIcon').setAttribute('src', 'http://openweathermap.org/img/w/' + weatherData.weather[0].icon + '.png');
    });
}

searchForm.addEventListener('submit', function(e) {
    e.preventDefault();
    var searchForm = document.getElementById('searchForm');
    var cityField = document.getElementById('cityField');
    var searchedCity = cityField.value;
    cityField.value = '';
    printData(searchedCity);
});