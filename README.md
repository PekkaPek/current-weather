# Current Weather
Shows current weather for any searched city.

## Set up
* Clone this repository
* Download <a href="https://drive.google.com/file/d/0BzCmoMKkz7dwQjRvaWFoTW1ZdlE/view?usp=sharing" target="_blank">areas.json</a> and place it to localhost:8888
* Create new file "apikey.js" to the root of project and add following line:
```javascript
var apikey = 'insert your API key here';
```

### API key
API key is used to get actual weather forecasts. If you don't have one already, consult <a href="http://openweathermap.org/appid" target="_blank">API instructions</a>.

### Areas JSON
The file is used to search nearby areas for current search. You may use different location for the file: just replace "localhost:8888" with desired value in script.js. Remember to add <a href="http://enable-cors.org/server.html" target="_blank">CORS support for your server</a> if not already added.

## Access
Open project's index.html file in your browser.