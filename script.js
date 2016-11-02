function getElem(id) {
  return document.getElementById(id);
}

function ajax(endPoint, callback, errorCallback) {
  var req = new XMLHttpRequest();
  if (typeof callback !== 'function') {
    throw new Error('Callback provided is not a function');
  }
  req.addEventListener('readystatechange', function () {
    if (req.readyState === XMLHttpRequest.DONE ) {
      if (req.status === 200) {
        callback(JSON.parse(req.responseText));
      } else if (req.status >= 400 && req.status <= 599) {
        if (typeof errorCallback === 'function') {
          errorCallback();
        }
      }
    }
  });
  req.open('GET', endPoint);
  req.send();
}

function printData(searchedCity) {
  getElem('searchedCity').innerHTML = 'Loading';
  getElem('searchedCityTemperature').innerHTML = '';
  getElem('weatherIcon').setAttribute('src', 'resources/placeholder-image.png');
  ajax('http://api.openweathermap.org/data/2.5/weather?q=' + searchedCity + '&units=metric&appid=' + apikey, function (weatherData) {
    getElem('cityField').value = '';
    getElem('searchedCity').innerHTML = weatherData.name;
    getElem('searchedCityTemperature').innerHTML = Math.round(weatherData.main.temp) + ' &deg;C';
    getElem('weatherIcon').setAttribute('src', 'http://openweathermap.org/img/w/' + weatherData.weather[0].icon + '.png');
  }, function () {
    getElem('searchedCity').innerHTML = 'Could not fetch data';
    getElem('dataSection').setAttribute('class', 'error');
  });
}

getElem('searchForm').addEventListener('submit', function (e) {
  var searchedCity = getElem('cityField').value.trim();
  e.preventDefault();
  getElem('dataSection').removeAttribute('class');
  if (searchedCity) {
    getElem('dataSection').style.visibility = 'visible';
    printData(searchedCity);
  }
});
