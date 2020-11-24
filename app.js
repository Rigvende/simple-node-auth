require('dotenv').config();
const express = require('express');
const path = require('path');
const logger = require('morgan');
const userRouter = require('./src/routes/userRoute');
const authRouter = require('./src/routes/authRoute');
const sequelize = require('./src/dbConfig');
const handler = require('./src/errorHandler.js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(logger('dev'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', authRouter);
app.use('/users', userRouter);
app.use((req, res, next) => handler.send404(res));

sequelize.sync()
    .then(() => app.listen(PORT, () => console.log(`Server started on port ${PORT}`)))
    .catch(err => {
        console.log(err);
        process.exit(1);
    });

module.exports = app;
