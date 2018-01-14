import express from 'express'
import path from 'path'
import logger from 'morgan'
import { createWriteStream } from 'fs'
import { json, urlencoded } from 'body-parser'

let endpoints = require('./routes/endpoints')
let login_authorize = require('./routes/login_authorize')

let app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')
let access = path.join(__dirname, 'access.log')
let accessLogStream = createWriteStream(access, {flags: 'a'})
app.use(logger('combined', {stream: accessLogStream}))
app.use(logger('dev'))
app.use(json())
app.use(urlencoded({ extended: false }))

app.use('/', login_authorize)
app.use('/api', [endpoints])

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  let err = new Error('Not Found')
  err.status = 404
  next(err)
})

global.baseDirectory = path.resolve(__dirname)
// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
