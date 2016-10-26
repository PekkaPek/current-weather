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
    });
}

searchForm.addEventListener('submit', function(e) {
    var searchForm = document.getElementById('searchForm');
    var cityField = document.getElementById('cityField');
    var searchedCity;
    e.preventDefault();
    searchedCity = cityField.value;
    cityField.value = '';
    printData(searchedCity);
})