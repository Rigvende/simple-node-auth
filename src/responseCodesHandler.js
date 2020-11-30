const addCustomResponses = (req, res, next) => {
    res.send500 = () => res.status(500).json({ message: "Something goes wrong..." });
    res.send401 = (message = "Authorization failed") => res.status(401).json({ message });
    res.send400 = (errors, message) => res.status(400).json({ errors, message });
    res.send404 = () => res.status(404).json({ message: "Resource not found" });
    
    res.send200 = data => res.status(200).json({ data });
    res.send201 = data => res.status(201).json({ data });
    return next();
}

module.exports = { addCustomResponses }
