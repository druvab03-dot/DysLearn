const jwt = require("jsonwebtoken");
const Parent = require("../models/Parent");


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


        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );


        const parent = await Parent.findById(
            decoded.id
        ).select("-password");


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