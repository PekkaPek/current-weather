# Current Weather
Shows current weather for any searched city.

## Set up
Open terminal
```bash
cd [path to desired location]
git clone https://github.com/PekkaPek/current-weather.git .
touch apikey.js
```

### API key
You need to use your own API key to get the actual weather forecasts in the application. If you don't have one already, consult http://openweathermap.org/appid#get. Insert this key to empty apikey.js file you created:
```javascript
var apikey = '[insert your API key here]';
```

## Access
Open project's weather.html file in your browser.