const querySplitter = (req, res, next) => {
    try {
        if (req.query) {
            Object.keys(req.query).forEach(key => {
                req.query[key] = req.query[key].split(',')
            })
        };
        next ();
    } catch (err) {
        return next(err);
    };
};

module.exports = {
    querySplitter: querySplitter
};