const User = require("../models/User");

const getUser = async (username) => {
    try {
        const user = await User.findOne({username: username});
        return user;
    } catch (err) {
        res.locals.endpoint = 'getUser';
    };
};

module.exports = {
    getUser: getUser
};