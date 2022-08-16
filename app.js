const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require("cors");
require("./models/db");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 6003;

app.use('/images', express.static('images'));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

const userRoute = require('./routes/user')
const noteRoute = require('./routes/note')

app.use('/', userRoute)
app.use('/note', noteRoute)

app.listen(PORT,  function () {
    console.log("Server started");
});

module.exports = app;
