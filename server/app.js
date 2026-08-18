const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const childRoutes = require("./routes/childRoutes");
const analysisRoutes = require("./routes/analysisRoutes");

const app = express();

app.use(cors({
origin: "http://localhost:5173",
credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(
"/ml-outputs",
express.static(path.join(__dirname, "..", "ml", "handwriting_analysis", "outputs"))
);

app.get("/", (req, res) => {
res.json({ message: "DysLearn Backend Running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/children", childRoutes);
app.use("/api/analysis", analysisRoutes);

module.exports = app;
