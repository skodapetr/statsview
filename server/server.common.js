const config = require("../config");

function start(app) {
  const port = config.port;
  app.listen(port, (error) => {
    if (error) {
      console.error("Can't start server: ", error);
    }
    console.info("Listening on port: ", port);
  });
}

module.exports = {
  "start": start,
};
