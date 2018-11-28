const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mysql = require('mysql');
require('dotenv').config();

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'client/build')));

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
};

let connection;

function handleDisconnect() {
  connection = mysql.createConnection(dbConfig);

  connection.connect(function(err) {      // The server is either down
    if (err) {                             // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
                                          // If you're also serving http, display a 503 error.
  connection.on('error', function(err) {
    console.log('db error', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}

handleDisconnect();

const jsonFormatter = (results = [], fields = []) => {
  return {
    count: results.length,
    results,
    fields,
  };
};

app.get('/get/project', async function(req, res) {
  const projectQuery = `
    SELECT
      a.project_id,
      project_name,
      a.start_date,
      a.end_date,
      ordering_company,
      COUNT(*) employee_count
    FROM project a JOIN participation b ON a.project_id = b.project_id
    GROUP BY project_id;
  `;

  connection.query(projectQuery, function(err, results, fields) {
    if (err) throw err;

    res.json(jsonFormatter(results, fields));
  });
});

app.get('/get/employee', function(req, res) {
  connection.query('SELECT * FROM employee', function(err, results, fields) {
    if (err) throw err;

    res.json(jsonFormatter(results, fields));
  });
});

app.get('/get/participation', function(req, res) {
  const participationQuery = `
    SELECT project_id, e.emp_id, name, start_date, end_date, job, career, skill
    FROM employee e
    NATURAL JOIN participation
    LEFT JOIN career ON participation.emp_id = career.emp_id
  `;

  connection.query(participationQuery, function(err, results, fields) {
    if (err) throw err;

    res.json(jsonFormatter(results, fields));
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
