module.exports = async (req, res, next) => {
    const count = await User.findAll({
        attributes: [[sequelize.fn('COUNT', sequelize.col('id')), 'count']]
    });
    const length = Number(count[0].count);

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const users = await User.findAll({
        order: [['id', 'ASC']],
        limit,
        offset: (page - 1) * limit,
    });
    req.users = users;
    req.limit = limit;
    req.length = length;
    return next();
}
