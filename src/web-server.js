const express = require('express');
const path = require('path');
const hbs = require('hbs');

const geocode = require('./utils/geocode');
const geoTime = require('./utils/geoTime');

const app = express();
const port = process.env.PORT || 3000;

// Define paths for Express config
const staticHTMLpath = path.join(__dirname, '../public/');
const viewsPath = path.join(__dirname, '../templates/views/');
const partialPath = path.join(__dirname, '../templates/partials/');

// Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialPath);

app.use(express.static(staticHTMLpath));

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather'
    });
});

app.get('/weather', (req, res) => {
    if (!req.query.location) {
        return res.send({
            error: 'You must provide an address'
        });
    }

    geocode(req.query.location, (error, {current, location} = {}) => {
        if (error) {
            return res.send({
                error
            });
        }
      
        let forecast = `It is currently ${current.temperature} degrees out. There is a ${current.precip}% chance of rain.`;
        console.log(forecast);
        
        geoTime(location.lat, location.lon, (error, observation_time) => {
          if (error) {
            return res.send({
                error
            });
          } else {
            console.log(`It is ${observation_time} at lat=${location.lat} and long${location.lon}`);
            res.render('weather', {
                forecast,
                location: location.name,
                region: location.region
            });
          }
        });
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About'
    });
});

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help'
    });
});

app.get('/help/*', (req, res) => {
    res.render('404', {
        errorMessage: 'Help article not found'
    });
});

app.get('*', (req, res) => {
    res.render('404', {
        errorMessage: 'Page not found'
    });
});

/* old routes
app.get('/about', (req, res) => {
    res.render('index');
});

app.get('/help', (req, res) => {
    res.send('<h3>Help</h3>');
});

app.get('/weather', (req, res) => {
    res.send({forecast: "cloudy", location: "Ayia Napa"});
});
*/

app.listen(port, () => {
    console.log(`Server is up on port ${port}.`);
});