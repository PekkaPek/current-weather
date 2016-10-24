var searchButton = document.getElementById('searchButton');
var cityField = document.getElementById('cityField');
var searchedCity;

searchButton.addEventListener('click', function(e) {
    e.preventDefault();
    searchedCity = cityField.value;
    cityField.value = '';
    console.log(searchedCity);
})

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

ajax('http://api.openweathermap.org/data/2.5/weather?q=vantaa&units=metric&appid=' + apikey, function(weatherData) {
    console.log(weatherData.name);
    console.log(weatherData.main.temp);
});

