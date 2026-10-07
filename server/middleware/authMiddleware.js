const jwt = require("jsonwebtoken");
const { Parent } = require("../models/dbAdapter");

const protect = async (req, res, next) => {

    try {

        const authorization =
            req.headers.authorization || "";


        const token =
            authorization.startsWith("Bearer ")
                ? authorization.split(" ")[1]
                : null;


        if (!token) {

            return res.status(401).json({
                message: "Authentication is required",
            });

        }


        const secret = process.env.JWT_SECRET || "dyslearn_default_jwt_secret_dev_2026";
        const decoded = jwt.verify(
            token,
            secret
        );


        const parent = await Parent.findById(
            decoded.id
        );


        if (!parent) {

            return res.status(401).json({
                message: "This account no longer exists",
            });

        }


        req.parent = parent;

        next();


    } catch (error) {

        console.error(
            "JWT Authentication Error:",
            error.message
        );


        return res.status(401).json({
            message:
                "Your session has expired. Please log in again.",
        });

    }

};


module.exports = {
    protect,
};