if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

// const fs = require('fs');
const path = require('path');

const express = require("express");
const mongoose = require("mongoose");

const HttpError = require('./util/http-error');
const quotesRoutes = require('./routes/quotes-routes');
const usersRoutes = require('./routes/users-routes');

const dbUrl = process.env.DB_URL;
const portNumber = process.env.PORT || 5000;

const app = express();

app.use(express.json())


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    next();
});

app.use('/api/quotes', quotesRoutes);
app.use('/api/users', usersRoutes);

app.use((req, res, next) => {
    const error = new HttpError("cannot find route", 404);
    throw error;
});

app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500).json({ message: error.message || "unknown 500 error!" });
});


mongoose
    .connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log(`Connected to MongoDB database... `)
        app.listen(
            portNumber, () => {
                console.log(`Server active on port : ${portNumber}`);
            }
        );
    })
    .catch(err => { console.log(err) });
