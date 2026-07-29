const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());

app.use(express.json());

app.use(cookieParser());

// Home Route
app.get("/", (req, res) => {
    res.json({
        message: "DysLearn Backend Running",
    });
});

// API Routes
app.use("/api/auth", authRoutes);

module.exports = app;