const jwt = require("jsonwebtoken");

const generateJWT = (id) => {
    const secret = process.env.JWT_SECRET || "dyslearn_default_jwt_secret_dev_2026";
    return jwt.sign(
        { id },
        secret,
        {
            expiresIn: "7d",
        }
    );
};

module.exports = generateJWT;
