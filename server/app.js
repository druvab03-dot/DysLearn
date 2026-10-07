const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const fs = require("fs");

const authRoutes = require("./routes/authRoutes");
const childRoutes = require("./routes/childRoutes");
const analysisRoutes = require("./routes/analysisRoutes");

const app = express();

app.use(cors({
    origin: true,
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// Static uploads & ML output directories
const uploadsDir = path.join(__dirname, "uploads");
const mlOutputsDir = path.join(__dirname, "uploads", "ml-outputs");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
if (!fs.existsSync(mlOutputsDir)) fs.mkdirSync(mlOutputsDir, { recursive: true });

app.use("/uploads", express.static(uploadsDir));
app.use("/ml-outputs", express.static(mlOutputsDir));

// Health check
app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        appName: "DysLearn",
        timestamp: new Date().toISOString(),
    });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/children", childRoutes);
app.use("/api/analysis", analysisRoutes);

// Frontend SPA Integration (Vite in dev, static files in prod)
async function attachFrontend(expressApp) {
    const isProduction = process.env.NODE_ENV === "production";
    const clientPath = path.resolve(__dirname, "..", "client");
    const distPath = path.resolve(clientPath, "dist");

    if (!isProduction && fs.existsSync(clientPath)) {
        try {
            const { createServer: createViteServer } = await import("vite");
            const vite = await createViteServer({
                root: clientPath,
                server: {
                    middlewareMode: true,
                    hmr: process.env.DISABLE_HMR === "true" ? false : undefined,
                },
                appType: "spa",
            });
            expressApp.use(vite.middlewares);
            console.log("⚡ Vite dev server attached as middleware");
            return;
        } catch (viteError) {
            console.warn("⚠️ Could not initialize Vite middleware:", viteError.message);
        }
    }

    if (fs.existsSync(distPath)) {
        expressApp.use(express.static(distPath));
        expressApp.use((req, res, next) => {
            if (req.path.startsWith("/api") || req.path.startsWith("/uploads")) {
                return next();
            }
            res.sendFile(path.join(distPath, "index.html"));
        });
        console.log("📁 Serving production build from client/dist");
    }
}

module.exports = {
    app,
    attachFrontend,
};
