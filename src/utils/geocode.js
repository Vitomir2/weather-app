const request = require("postman-request");

const geocode = (address, callback) => {
    const url = `http://api.weatherstack.com/current?access_key=33ebaa9939f84abc03bc30a0a74a6380&query=${address}`;
  
    request({url, json: true}, function (error, { body }) {
      if (error) { // low-level errors (e.g., disabling network connection)
        callback('Unable to connect to weather API.', undefined);
      } else if (body.error) { // high-level/coordinate error (e.g. passing incorrect query)
        callback('Error!', body.error.info);
      } else {
        // callback(`It is currently ${body.current.temperature} degrees out. There is a ${body.current.precip}% chance of rain.`, body.current);
        callback(undefined, body);
      }
    });
};

module.exports = geocode;