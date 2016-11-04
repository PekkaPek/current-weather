function getElem(id) {
  return document.getElementById(id);
}

function ajax(endPoint, callback, errorCallback) {
  var req = new XMLHttpRequest();
  if (typeof callback !== 'function') {
    throw new Error('Callback provided is not a function');
  }
  req.addEventListener('readystatechange', function () {
    if (req.readyState === XMLHttpRequest.DONE) {
      if (req.status === 200) {
        callback(JSON.parse(req.responseText));
      } else if (req.status >= 400 && req.status <= 599) {
        if (typeof errorCallback === 'function') {
          errorCallback(JSON.parse(req.responseText));
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
    ajax('http://api.openweathermap.org/data/2.5/find?lat=' + weatherData.coord.lat + '&lon=' + weatherData.coord.lon + '&cnt=10&units=metric&appid=' + apikey, function (areaData) {
      getElem('nearbyAreasData').innerHTML = '';
      areaData.list
        .filter(function (area) {
          return area.name !== weatherData.name;
        })
        .forEach(function (area) {
          var li = document.createElement('li');
          var img = document.createElement('img');
          var parentDiv = document.createElement('div');
          var areaDiv = document.createElement('div');
          var temperatureDiv = document.createElement('div');
          areaDiv.appendChild(document.createTextNode(area.name));
          temperatureDiv.appendChild(document.createTextNode(Math.round(area.main.temp)));
          parentDiv.appendChild(areaDiv);
          parentDiv.appendChild(temperatureDiv);
          li.appendChild(img);
          li.appendChild(parentDiv);
          li.className = 'nearbyArea';
          img.className = 'smallIcon';
          img.setAttribute('src', 'http://openweathermap.org/img/w/' + area.weather[0].icon + '.png');
          img.setAttribute('alt', 'Weather icon symbolizing ' + area.weather[0].description);
          parentDiv.className = 'nearbyAreaData';
          getElem('nearbyAreasData').appendChild(li);
        });
    }, function (error) {
      getElem('searchedCity').innerHTML += 'Error loading ares.json (' + error + ')';
    });
  }, function (error) {
    getElem('searchedCity').innerHTML = 'Could not fetch data (' + error.message + ')';
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
