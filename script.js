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
  req.responseType = 'json';
  if (typeof callback !== 'function') {
    throw new Error('Callback provided is not a function');
  }
  req.addEventListener('readystatechange', function () {
    if (req.readyState === XMLHttpRequest.DONE) {
      if (req.status === 200) {
        callback(req.response);
      } else if (req.status >= 400 && req.status <= 599) {
        if (typeof errorCallback === 'function') {
          errorCallback(req.response);
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
  var minutes = ('0' + date.getMinutes()).substr(-2);
  var hours = ('0' + date.getHours()).substr(-2);
  return hours + ':' + minutes;
}

function addClickListeners() {
  var nearbyAreas = getElems('.nearby-areas-section__nearby-area');
  Array.from(nearbyAreas).forEach(function (areaElement) {
    areaElement.addEventListener('click', function () {
      this.children[2].classList.toggle('nearby-areas-section__additionals-wrapper--show');
    });
  });
}

function printData(searchedCity) {
  getElems('.data-section__searched-city')[0].innerHTML = 'Loading';
  getElems('.data-section__searched-city-temperature')[0].innerHTML = '';
  getElems('.data-section__weather-icon')[0].setAttribute('src', 'resources/placeholder-image.png');
  getElems('.nearby-areas-section')[0].style.display = 'none';
  getElems('.nearby-areas-section__loading-text')[0].style.visibility = 'visible';
  ajax('http://api.openweathermap.org/data/2.5/weather?q=' + searchedCity + '&units=metric&appid=' + apikey, function (weatherData) {
    if (!weatherData) {
      getElems('.error-section')[0].innerHTML = 'Error fetching data';
      getElems('.error-section')[0].style.display = 'block';
      getElems('.data-section')[0].style.display = 'none';
    } else {
      getElems('.form-section__city-field')[0].value = '';
      getElems('.data-section__searched-city')[0].innerHTML = weatherData.name;
      getElems('.data-section__searched-city-temperature')[0].innerHTML = Math.round(weatherData.main.temp) + ' &deg;C';
      getElems('.data-section__weather-icon')[0].setAttribute('src', 'http://openweathermap.org/img/w/' + weatherData.weather[0].icon + '.png');
      getElems('.data-section__wind')[0].innerHTML = 'Wind ' + weatherData.wind.speed + ' m/s';
      getElems('.data-section__humidity')[0].innerHTML = 'Humidity ' + weatherData.main.humidity + ' %';
      getElems('.data-section__sunrise')[0].innerHTML = 'Sunrise ' + timestampToTime(weatherData.sys.sunrise);
      getElems('.data-section__sunset')[0].innerHTML = 'Sunset ' + timestampToTime(weatherData.sys.sunset);
      getElems('.data-section')[0].style.display = 'flex';
      getElems('.error-section')[0].style.display = 'none';
      ajax('http://api.openweathermap.org/data/2.5/find?lat=' + weatherData.coord.lat + '&lon=' + weatherData.coord.lon + '&cnt=10&units=metric&appid=' + apikey, function (areaData) {
        if (!areaData) {
          getElems('.error-section')[0].innerHTML = 'Error fetching nearby areas data';
          getElems('.error-section')[0].style.display = 'block';
          getElems('.nearby-areas-section')[0].style.display = 'none';
        } else {
          getElems('.nearby-areas-section__list')[0].innerHTML = '';
          areaData.list
            .filter(function (area) {
              return area.name !== weatherData.name;
            })
            .forEach(function (area) {
              var li = createElem('li', {
                class: 'nearby-areas-section__nearby-area',
              }, [
                createElem('img', {
                  class: 'nearby-areas-section__weather-icon',
                  src: 'http://openweathermap.org/img/w/' + area.weather[0].icon + '.png',
                  alt: 'Weather icon symbolizing ' + area.weather[0].description,
                }),
                createElem('div', {
                  class: 'nearby-areas-section__area',
                }, [
                  createElem('div', null, area.name),
                  createElem('div', null, Math.round(area.main.temp) + ' °C'),
                ]),
                createElem('div', {
                  class: 'nearby-areas-section__additionals-wrapper',
                }, [
                  createElem('div', null, 'Wind ' + area.wind.speed + ' m/s'),
                  createElem('div', null, 'Humidity ' + area.main.humidity + ' %'),
                ]),
              ]);

              getElems('.nearby-areas-section__list')[0].appendChild(li);
            });
          getElems('.nearby-areas-section__loading-text')[0].style.display = 'none';
          getElems('.nearby-areas-section')[0].style.display = 'block';
          getElems('.error-section')[0].style.display = 'none';
          addClickListeners();
        }
      }, function (error) {
        getElems('.error-section')[0].innerHTML = 'API Error in Nearby Areas (' + error.message + ')';
        getElems('.error-section')[0].style.display = 'block';
        getElems('.nearby-areas-section')[0].style.display = 'none';
      });
    }
  }, function (error) {
    getElems('.error-section')[0].innerHTML = 'API Error (' + error.message + ')';
    getElems('.error-section')[0].style.display = 'block';
    getElems('.data-section')[0].style.display = 'none';
  });
}

getElems('.search-form')[0].addEventListener('submit', function (e) {
  var searchedCity = getElems('.form-section__city-field')[0].value.trim();
  e.preventDefault();
  if (searchedCity) {
    getElems('.data-section')[0].style.visibility = 'visible';
    printData(searchedCity);
  }
});

getElems('.data-section')[0].addEventListener('click', function () {
  getElems('.data-section__additionals-wrapper')[0].classList.toggle('data-section__additionals-wrapper--show');
});
