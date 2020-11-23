exports.send500 = function(res, err) {
    return res.status(500).json({message: "Something goes wrong...", stack: err.stack});
};

exports.send401 = function(res) {
    return res.status(401).json({message: "You are not logged in. Enter valid email/password"});
};

exports.send400 = function(res) {
    return res.status(400).json({message: "Bad request occurred"});
};

exports.sendCustom400 = function(res, errors, message) {
    return res.status(400).json({errors, message})
}

exports.send404 = function(res) {
    return res.status(404).json({message: "Resource not found"});
}