function getElems(target) {
  switch (target.charAt(0)) {
    case '#':
      return document.getElementById(target.substr(1));
    case '.':
      return document.getElementsByClassName(target.substr(1));
    default:
      return document.getElementsByTagName(target);
  }
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
  getElems('#searched-city').innerHTML = 'Loading';
  getElems('#searched-city-temperature').innerHTML = '';
  getElems('#weather-icon').setAttribute('src', 'resources/placeholder-image.png');
  getElems('#nearby-areas-section').style.visibility = 'hidden';
  getElems('.loading-section')[0].style.visibility = 'visible';
  ajax('http://api.openweathermap.org/data/2.5/weather?q=' + searchedCity + '&units=metric&appid=' + apikey, function (weatherData) {
    getElems('#city-field').value = '';
    getElems('#searched-city').innerHTML = weatherData.name;
    getElems('#searched-city-temperature').innerHTML = Math.round(weatherData.main.temp) + ' &deg;C';
    getElems('#weather-icon').setAttribute('src', 'http://openweathermap.org/img/w/' + weatherData.weather[0].icon + '.png');
    getElems('.wind-data')[0].innerHTML = 'Wind ' + weatherData.wind.speed + ' m/s';
    getElems('.humidity-data')[0].innerHTML = 'Humidity ' + weatherData.main.humidity + ' %';
    getElems('.sunrise-data')[0].innerHTML = 'Sunrise ' + weatherData.sys.sunrise;
    getElems('.sunset-data')[0].innerHTML = 'Sunset ' + weatherData.sys.sunset;
    ajax('http://api.openweathermap.org/data/2.5/find?lat=' + weatherData.coord.lat + '&lon=' + weatherData.coord.lon + '&cnt=10&units=metric&appid=' + apikey, function (areaData) {
      getElems('#nearby-areas-data').innerHTML = '';
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

          getElems('#nearby-areas-data').appendChild(li);
        });
      getElems('.loading-section')[0].style.display = 'none';
      getElems('#nearby-areas-section').style.visibility = 'visible';
    }, function (error) {
      getElems('#searched-city').innerHTML += 'Error loading ares.json (' + error + ')';
    });
  }, function (error) {
    getElems('#searched-city').innerHTML = 'Could not fetch data (' + error.message + ')';
    getElems('#data-section').setAttribute('class', 'error');
  });
}

getElems('#search-form').addEventListener('submit', function (e) {
  var searchedCity = getElems('#city-field').value.trim();
  e.preventDefault();
  getElems('#data-section').removeAttribute('class');
  if (searchedCity) {
    getElems('#data-section').style.visibility = 'visible';
    printData(searchedCity);
  }
});

getElems('#data-section').addEventListener('click', function () {
  if (document.defaultView.getComputedStyle(getElems('.extra-data')[0], null).getPropertyValue('display') === 'block') {
    getElems('.extra-data')[0].style.display = 'none';
  } else {
    getElems('.extra-data')[0].style.display = 'block';
  }
});
