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

function timestampToTime(timestamp) {
  var date = new Date(timestamp * 1000);
  return date.getHours() + ':' + date.getMinutes();
}

function addClickListeners() {
  var nearbyAreas = getElems('.nearbyArea');
  Array.prototype.forEach.call(nearbyAreas, function (areaElement) {
    areaElement.addEventListener('click', function () {
      this.children[2].classList.toggle('verbose');
    });
  });
}

function printData(searchedCity) {
  getElems('.searched-city')[0].innerHTML = 'Loading';
  getElems('.searched-city-temperature')[0].innerHTML = '';
  getElems('.weather-icon')[0].setAttribute('src', 'resources/placeholder-image.png');
  getElems('.nearby-areas-section')[0].style.visibility = 'hidden';
  getElems('.loading-section')[0].style.visibility = 'visible';
  ajax('http://api.openweathermap.org/data/2.5/weather?q=' + searchedCity + '&units=metric&appid=' + apikey, function (weatherData) {
    getElems('.city-field')[0].value = '';
    getElems('.searched-city')[0].innerHTML = weatherData.name;
    getElems('.searched-city-temperature')[0].innerHTML = Math.round(weatherData.main.temp) + ' &deg;C';
    getElems('.weather-icon')[0].setAttribute('src', 'http://openweathermap.org/img/w/' + weatherData.weather[0].icon + '.png');
    getElems('.wind-data')[0].innerHTML = 'Wind ' + weatherData.wind.speed + ' m/s';
    getElems('.humidity-data')[0].innerHTML = 'Humidity ' + weatherData.main.humidity + ' %';
    getElems('.sunrise-data')[0].innerHTML = 'Sunrise ' + timestampToTime(weatherData.sys.sunrise);
    getElems('.sunset-data')[0].innerHTML = 'Sunset ' + timestampToTime(weatherData.sys.sunset);
    ajax('http://api.openweathermap.org/data/2.5/find?lat=' + weatherData.coord.lat + '&lon=' + weatherData.coord.lon + '&cnt=10&units=metric&appid=' + apikey, function (areaData) {
      getElems('.nearby-areas-data')[0].innerHTML = '';
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
            createElem('div', {
              class: 'nearby-area-extra',
            }, [
              createElem('div', null, 'Wind ' + area.wind.speed + ' m/s'),
              createElem('div', null, 'Humidity ' + area.main.humidity + ' %'),
            ]),
          ]);

          getElems('.nearby-areas-data')[0].appendChild(li);
        });
      getElems('.loading-section')[0].style.display = 'none';
      getElems('.nearby-areas-section')[0].style.visibility = 'visible';
      addClickListeners();
    }, function (error) {
      getElems('.searched-city')[0].innerHTML += 'Error loading ares.json (' + error + ')';
    });
  }, function (error) {
    getElems('.searched-city')[0].innerHTML = 'Could not fetch data (' + error.message + ')';
    getElems('.data-section')[0].classList.add('error');
  });
}

getElems('.search-form')[0].addEventListener('submit', function (e) {
  var searchedCity = getElems('.city-field')[0].value.trim();
  e.preventDefault();
  getElems('.data-section')[0].classList.remove('error');
  if (searchedCity) {
    getElems('.data-section')[0].style.visibility = 'visible';
    printData(searchedCity);
  }
});

getElems('.data-section')[0].addEventListener('click', function () {
  getElems('.extra-data')[0].classList.toggle('verbose');
});
