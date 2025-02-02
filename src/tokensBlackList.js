const redis = require('redis');
const { logger } = require('./logger.js');
const NODE_ENV = process.env.NODE_ENV || 'development';

const client = NODE_ENV === 'development'
    ? redis.createClient()
    : redis.createClient(process.env.REDIS_URL);

client.on("connect", () => logger.info("Redis is now connected"));
client.on("error", err => logger.error(`Redis error occurred: ${err}`));

exports.invalidateToken = async (id, token, time) =>
    new Promise((resolve, reject) =>
        client.set(id, token, err =>
            err ? reject(err) : client.expire(id, time, err =>
                err ? reject(err) : resolve())));

exports.checkToken = async (id, token) =>
    new Promise((resolve, reject) =>
        client.get(id, (err, reply) =>
            err ? reject(false) : resolve(reply !== token)));
