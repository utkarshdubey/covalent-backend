const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Dotenv configuration
require('dotenv').config();

// Server configuration
const app = express();
const port = process.env.PORT || 8300;

// Mongoose configuration

mongoose.Promise = global.Promise;


mongoose
    .connect(process.env.DATABASE_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    })
    .then(() => console.log('Database connected successfully.'))
    .catch(err => console.log(err));

// Middlewares

// Cors
app.use(cors());

// Limiting payload size
app.use(express.json({ limit: '2kb' }));
app.use(express.urlencoded({ extended: false }));

// Route configuration
app.use('/', require('./routes/global'));
app.use('/people', require('./routes/people'));

app.listen(port, console.log(`Server started on port ${port}`));

