const express = require('express');
const app = express();
const recipeRoutes = require('./api/routes/recipes');
const userRoutes = require('./api/routes/users');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.connect(
    "mongodb+srv://lanelake:" + process.env.MONGO_ATLAS_PW + "@seasonedwithlove.2ylhf8p.mongodb.net/?retryWrites=true&w=majority&appName=SeasonedWithLove"
)

//Logger Middleware
app.use(morgan('dev'));

//Body Parser Middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//CORS
app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*');
    response.header(
        'Access-Control-Allow-Headers', 
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if(request.method === 'OPTIONS') {
        response.header('Access-Control-Allow-Methods', 'PUT, POST, DELETE, GET');
        return response.status(200).json({});
    }
    next();
});

//Controllers
app.use('/recipes', recipeRoutes);
app.use('/users', userRoutes);

//Handle 404
app.use((request, response, next)=> {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

//Error handler
app.use((error, request, response, next)=>{
    response.status(error.status || 500);
    response.json({
        error: {
            message: error.message,
            status: error.status
        }
    })
});

module.exports = app;