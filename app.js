const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mysql = require('mysql');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'client/build')));

const connection = mysql.createConnection({
  host: 'us-cdbr-iron-east-01.cleardb.net',
  user: 'ba2cf57fd03e1d',
  password: '1059b564',
  database: 'heroku_fb274b19cae264c',
});

connection.connect();

const jsonFormatter = results => {
  return {
    count: results.length,
    results,
  };
};

app.get('/get/project', function(req, res) {
  connection.query('SELECT * FROM project', function(err, results, fields) {
    if (err) throw err;

    res.json(jsonFormatter(results));
  });
});

app.get('/get/employee', function(req, res) {
  connection.query('SELECT * FROM employee', function(err, results, fields) {
    if (err) throw err;

    res.json(jsonFormatter(results));
  });
});

app.get('/get/participation', function(req, res) {
  connection.query('SELECT * FROM participation', function(err, results, fields) {
    if (err) throw err;

    res.json(jsonFormatter(results));
  });
});

// Anything that doesn't match the above, send back index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'))
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
