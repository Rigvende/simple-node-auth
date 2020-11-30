require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const userRouter = require('./src/routes/userRoute');
const authRouter = require('./src/routes/authRoute');
const sequelize = require('./src/dbConfig');
const handler = require('./src/responseCodesHandler.js');
// const cors = require('cors');
const winston = require('winston');

const app = express();
const PORT = process.env.PORT || 3000;

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
    ],
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}

app.use(morgan('dev'));
app.use(express.json({ extended: true }));
// app.use(cors());
app.use(function (req, res, next) {
    var origins = [
        'https://simplenodeauth.herokuapp.com',
        'https://www.simplenodeauth.herokuapp.com'
    ];

    for(var i = 0; i < origins.length; i++){
        var origin = origins[i];

        if(req.headers.origin.indexOf(origin) > -1){
            res.header('Access-Control-Allow-Origin', req.headers.origin);
        }
    }
    
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use('/', authRouter);
app.use('/users', userRouter);
app.use((req, res, next) => handler.send404(res));
app.use(send200 = (res, data) => handler.send200(res, data));
app.use(send201 = (res, data) => handler.send201(res, data));
app.use(send400 = (res, errors, message) => handler.send400(res, errors, message));
app.use(send401 = res => handler.send401(res));
app.use(send500 = res => handler.send500(res));

sequelize.sync()
    .then(() => app.listen(PORT, () => console.log(`Server started on port ${PORT}`)))
    .catch(err => {
        console.log(err);
        process.exit(1);
    });

module.exports = app;
