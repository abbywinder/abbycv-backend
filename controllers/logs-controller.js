const Log = require("../models/Log");

// POST

const createNewLog = async log => {
    try {
        const newLog = new Log(log);
        return await newLog.save();
    } catch (err) {
        return;
    };  
};

module.exports = {
    createNewLog: createNewLog
};