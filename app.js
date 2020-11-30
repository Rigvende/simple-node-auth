require('dotenv').config();
const express = require('express');
const logger = require('morgan');
const userRouter = require('./src/routes/userRoute');
const authRouter = require('./src/routes/authRoute');
const sequelize = require('./src/dbConfig');
const handler = require('./src/responseCodesHandler.js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(logger('dev'));
app.use(express.json({ extended: true }));
app.use('/', authRouter);
app.use('/users', userRouter);
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});
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
