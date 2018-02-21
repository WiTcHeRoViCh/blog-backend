import express from 'express';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';


mongoose.connect('mongodb://localhost/conduit');
mongoose.set('debug', true);

require("./models/User");
require("./models/Post");

const app = express();

// uncomment after placing your favicon in /public
app.use(require('morgan')('dev'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', require('./routes'));

// catch 404 and forward to error handler
app.use( (req, res) => {
  const err = new Error('Not Found');
  err.status = 404;
  res.status(404).json({message: "404"});
});

export default app;
