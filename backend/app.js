const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// DB connection
const db = require('./utils/db.utils');
db.init();

// Passport (auth)
const auth = require('./utils/auth.utils');
auth.init();

// Launching app
const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// handlers
const userRouter = require('./routes/user.route');
const authRouter = require('./routes/auth.route');
const postRouter = require('./routes/post.route');
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', { error: err });
});

module.exports = app;
