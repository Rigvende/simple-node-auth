require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const userRouter = require('./src/routes/userRoute');
const authRouter = require('./src/routes/authRoute');
const sequelize = require('./src/dbConfig');
const {addCustomResponses} = require('./src/responseCodesHandler');
const cors = require('cors');
const logger = require('./src/logger');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use(express.json({ extended: true }));
app.use(cors());
app.use(addCustomResponses);
app.use('/', authRouter);
app.use('/users', userRouter);

sequelize.sync()
    .then(() => app.listen(PORT, () => logger.info(`Server started on port ${PORT}`)))
    .catch(err => {
        logger.error(err);
        process.exit(1);
    });

module.exports = app;
