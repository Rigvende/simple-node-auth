const redis = require('redis');
const { logger } = require('./logger.js');

const client = redis.createClient();
client.on("connect", () => logger.info("Redis is now connected"));
client.on("error", err => logger.error(`Redis error occurred: ${err}`));

exports.invalidateToken = (id, token) =>
    client.set(id, token, err => {
        if (err) {
            throw err;
        }
    });

exports.checkToken = (id, token, res) => {
    try {
        client.get(id, (err, reply) => {
            if (err) throw err;
            if (reply === token) throw new Error();
        })
    } catch (err) {
        logger.error(`Token found in blacklist! ${err}`);
        res.send401(`User credentials are in blacklist`);
    };
}
