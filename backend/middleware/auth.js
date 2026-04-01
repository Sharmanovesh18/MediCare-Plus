const jwt = require('jsonwebtoken');

const authAdmin = async (req, res, next) => {
    try {
        const { atoken } = req.headers;
        if (!atoken) {
            return res.status(401).json({ success: false, message: "Token not found" });
        }
        const token_decode = jwt.verify(atoken, process.env.JWT_SECRET);
        if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
            return res.status(401).json({ success: false, message: "Invalid access token" });
        }
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const authUser = async (req, res, next) => {
    try {
        const { token } = req.headers;
        if (!token) {
            return res.status(401).json({ success: false, message: "Token not found" });
        }
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        req.body.userId = token_decode.id;
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const authDoctor = async (req, res, next) => {
    try {
        const { dtoken } = req.headers;
        if (!dtoken) {
            return res.status(401).json({ success: false, message: "Token not found" });
        }
        const token_decode = jwt.verify(dtoken, process.env.JWT_SECRET);
        req.body.docId = token_decode.id;
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { authAdmin, authUser, authDoctor };
