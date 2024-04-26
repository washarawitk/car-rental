const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cookieParser=require('cookie-parser');
const mongoSanitize=require('express-mongo-sanitize');
const helmet=require('helmet');
const {xss}=require('express-xss-sanitizer');
const rateLimit=require('express-rate-limit');
const hpp=require('hpp');

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

const carproviders = require ('./routes/carproviders');
const auth = require('./routes/auth');

const carrentals=require('./routes/carrentals');


const cors = require('cors');


const multer = require('multer');
//const mongoSanitize=require('express-mongo-sanitize');
const Uploadimage=require('./routes/uploadimage');


dotenv.config({path:'./config/config.env'});

connectDB();
const app=express();
app.use(cors());

app.use(cookieParser());


app.use(express.json());

//openapi
const swaggerOptions={
    swaggerDefinition:{
        openapi: '3.0.0',
        info:{
            title: 'Library API',
            version: '1.0.0',
            description: 'A simple Express VacQ API'
        },
        servers: [
            {
                url: 'http://localhost:5100/api/v1'
            }
        ],
    },
    apis:['./routes/*.js'],
};
const swaggerDocs=swaggerJsDoc(swaggerOptions);
app.use('/api-docs' , swaggerUI.serve, swaggerUI.setup(swaggerDocs));



app.use(mongoSanitize());

app.use(helmet());

app.use(xss());

const limiter=rateLimit({
    windowsMs: 10*60*1000,
    max:100
});

app.use(limiter);

app.use(hpp());

app.use('/api/v1/carproviders',carproviders);
app.use('/api/v1/auth',auth);
//appoinement
app.use('/api/v1/carrentals',carrentals);

app.use('/api/v1/upload',Uploadimage);

const PORT=process.env.PORT || 5100;
const server = app.listen(PORT, console.log('Server running in ', process.env.NODE_ENV, 'mode on port ', PORT));

process.on('unhandledRejection',(err,promise)=>{
    console.log(`Error: ${err.message}`);
    server.close(()=>process.exit(1));
});




