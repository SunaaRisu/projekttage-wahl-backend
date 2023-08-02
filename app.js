const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

// Routes

const userRoutes = require('./routes/user');
const projectRoutes = require('./routes/project');


// mongoose connect 

mongoose.connect(    
    'mongodb+srv://projekttagewahl:48frMUyqhQXFKQeI@cluster0.wnx4gbk.mongodb.net/'
);
mongoose.Promise = global.Promise;


// body-parser

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


// CORS

app.use(
    cors({ 
        origin: 'http://localhost:5173', 
        methods: ['GET', 'POST'], 
        credentials :  false
    })
);

// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Contorl-Allow-Headers', '*');
//     if(req.method === 'OPTIONS') {
//         res.header('Access-Control-Allow_Methods' , 'PUT, POST, PATCH, DELETE, GET');
//         return res.status(200).json({});
//     }
//     next();
// });
// idk!!!!!!!!!!!

// Use Routes

app.use('/user', userRoutes);
app.use('/project', projectRoutes);


// Error

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
});



module.exports = app;