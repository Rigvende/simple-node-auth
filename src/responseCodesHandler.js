exports.send500 = (res) => res.status(500).json({ message: "Something goes wrong..." });

exports.send401 = res =>
    res.status(401).json({ message: "You are not logged in. Enter valid email/password" });

exports.send400 = (res, errors, message) => res.status(400).json({ errors, message });

exports.send404 = res => res.status(404).json({ message: "Resource not found" });

exports.send200 = (res, data) => res.status(200).json({ data });

exports.send201 = (res, data, message) => res.status(201).json({ data, message });
