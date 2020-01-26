const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const routes = require('./router/routes');
const PORT = process.env.port || 3000;
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/cache';

app.use(express.urlencoded({extended: true})); 
app.use(express.json());  
app.use(morgan('dev'));
app.use('/', routes);

mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Database connected!');
        app.listen(PORT, _ => {
            console.log(`Cache API application running on ${PORT}`);
        });
    })
    .catch(err => console.error('Error', err));