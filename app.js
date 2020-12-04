require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const userRouter = require('./src/routes/userRoute');
const authRouter = require('./src/routes/authRoute');
const sequelize = require('./src/dbConfig');
const { addCustomResponses } = require('./src/middleware/responseCodes.middleware');
const cors = require('cors');
const { logger } = require('./src/logger.js');
const app = express();
const PORT = process.env.PORT || 3000;

if (app.get('env') == 'development') {
    app.use(morgan('dev'));
}
app.use(express.json({ extended: true }));
app.use(cors());
app.use(addCustomResponses);
app.use('/', authRouter);
app.use('/users', userRouter);

sequelize.sync()
    .then(() => app.listen(PORT, () =>
        logger.info(`Server started on port ${PORT}, mode: ${app.get('env')}`)))
    .catch(err => {
        logger.error(err);
        process.exit(1);
    });

module.exports = app;
