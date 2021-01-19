const User = require('../models/User');
const sequelize = require('../dbConfig');
const { logger } = require('../logger.js');

module.exports = async (req, res, next) => {
    try {
        const count = await User.findAll({
            attributes: [[sequelize.fn('COUNT', sequelize.col('id')), 'count']]
        });
        const length = Number(count[0].count);

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const username = req.query.name || null;

        let users;
        if (username) {
            users = await User.findAll({
                where: {
                    ['name']: username,
                  },
                order: [['id', 'ASC']],
                limit,
                offset: (page - 1) * limit,
            });
        } else {
            users = await User.findAll({                
                order: [['id', 'ASC']],
                limit,
                offset: (page - 1) * limit,
            });
        }        
        req.users = users;
        req.limit = limit;
        req.length = length;
        return next();
    } catch (err) {
        logger.error(`Cannot find users! ${err}`);
        res.send500();
    }
}
