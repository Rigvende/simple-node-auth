const redis = require('redis');
const { logger } = require('./logger.js');
const bluebird = require('bluebird');

const client = redis.createClient(); //for localhost
// const client = redis.createClient(process.env.REDIS_URL); //for heroku

client.on("connect", () => {
    logger.info("Redis is now connected");
    bluebird.promisifyAll(redis);
});
client.on("error", err => logger.error(`Redis error occurred: ${err}`));

// exports.invalidateToken = (id, token) =>
//     client.set(id, token, err => {
//         if (err) {
//             throw err;
//         }
//     });

exports.invalidateToken = (id, token) =>
    new Promise((resolve, reject) =>
        client.set(id, token, err =>
            err ? reject(err) : resolve()));

exports.checkToken = async (id, token) => {
    return client.getAsync(id)
        .then(data => {
            if (data === token) {
                return false;
            }
            return true;
        })
        .catch(err => {
            return false;
        });
};
