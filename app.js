const express = require('express');
const itemsRoutes = require('./routes/items');
const ExpressError = require('./expressError');


const app = express();

app.use(express.json());
app.use('/items', itemsRoutes);


// 404 handler
app.use((req, res, next) => {
  return new ExpressError("Not Found", 404);
});


// general error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);

  return res.json({
    error: err.msg,
  });
});


module.exports = app;
