const express = require("express");
const cors = require("cors");
const app = express();
const routes = require("./routes");
const { NotFoundError } = require("./errorHandling");

app.use(cors());

// parse application/json
app.use(express.json());

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

app.use("/dogs", routes);

app.use(function (req, res, next) {
  return next(new NotFoundError());
});

app.use(function (err, req, res, next) {
  const status = err.status || 500;
  const message = err.message;
  if (process.env.NODE_ENV !== "test") console.error(status, err.stack);
  return res.status(status).json({ error: { message, status } });
});

app.listen(3001, console.log("Started on http://localhost://3001"));

module.exports = app;
