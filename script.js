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

function createElem(type, attributes, children) {
  var element = document.createElement(type);
  if (attributes && typeof attributes === 'object') {
    Object.keys(attributes).forEach(function (attribute) {
      var attributeValue = attributes[attribute];
      element.setAttribute(attribute, attributeValue);
    });
  }
  if (typeof children === 'string') {
    element.appendChild(document.createTextNode(children));
  } else if (Array.isArray(children)) {
    children.forEach(function (child) {
      element.appendChild(child);
    });
  }
  return element;
}

function printData(searchedCity) {
  getElem('searchedCity').innerHTML = 'Loading';
  getElem('searchedCityTemperature').innerHTML = '';
  getElem('weatherIcon').setAttribute('src', 'resources/placeholder-image.png');
  getElem('nearby-areas-section').style.visibility = 'hidden';
  document.getElementsByClassName('loading-section')[0].style.visibility = 'visible';
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
          var li = createElem('li', {
            class: 'nearbyArea',
          }, [
            createElem('img', {
              class: 'smallIcon',
              src: 'http://openweathermap.org/img/w/' + area.weather[0].icon + '.png',
              alt: 'Weather icon symbolizing ' + area.weather[0].description,
            }),
            createElem('div', {
              class: 'nearbyAreaData',
            }, [
              createElem('div', null, area.name),
              createElem('div', null, Math.round(area.main.temp) + ' °C'),
            ]),
          ]);

          getElem('nearbyAreasData').appendChild(li);
        });
      document.getElementsByClassName('loading-section')[0].style.display = 'none';
      getElem('nearby-areas-section').style.visibility = 'visible';
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
