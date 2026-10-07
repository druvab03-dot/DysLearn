require("dotenv").config();

const mongoose = require("mongoose");
const { app, attachFrontend } = require("./app");

const PORT = parseInt(process.env.PORT, 10) || 3000;
const HOST = "0.0.0.0";

async function startServer() {
    // Attempt MongoDB connection if MONGO_URI is set
    if (process.env.MONGO_URI) {
        try {
            await mongoose.connect(process.env.MONGO_URI, {
                serverSelectionTimeoutMS: 4000,
            });
            console.log("✅ MongoDB Connected successfully");
        } catch (err) {
            console.warn("⚠️ MongoDB connection failed. Running in standalone fallback mode:", err.message);
        }
    } else {
        console.log("ℹ️ MONGO_URI not configured. Operating in high-performance standalone mode.");
    }

    // Attach Frontend (Vite in dev, static dist in prod)
    await attachFrontend(app);

    // Start server
    app.listen(PORT, HOST, () => {
        console.log(`🚀 DysLearn server listening on http://${HOST}:${PORT}`);
    });
}

startServer().catch((err) => {
    console.error("❌ Fatal error during server startup:", err);
});
