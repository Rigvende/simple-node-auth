require('dotenv').config
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const logger = require('morgan');
const userRouter = require('./src/routes/user-route');
const authRouter = require('./src/routes/auth-route');
const sequelize = require('./src/db-config')

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "hbs");

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', authRouter);
app.use('/users', userRouter);
app.use(function (req, res, next) {
    res.status(404).send("Not Found")
});

sequelize.sync()
    .then(() => {
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    }).catch(err => {
        console.log(err);
        process.exit(1);
    });

module.exports = app;
