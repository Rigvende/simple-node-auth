const {transports, createLogger, format} = require('winston');

exports.logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.json()
    ),
    defaultMeta: { service: 'user-service' },
    transports: [
        new transports.Console()
    ],
});
