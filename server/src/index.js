import express from "express";
import dotenv from "dotenv";
import axios from "axios";
import morgan from "morgan";
import logger from "./utils/logger.js";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const API_KEY = process.env.OPENWEATHER_API_KEY;

// Middleware
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.get("/", (req, res) => {
    res.json({ message: "Welcome to Weather API" });
});

app.get("/api/weather", async (req, res) => {
    try {
        const response = await axios.get(
            "https://api.openweathermap.org/data/2.5/weather",
            {
                params: {
                    lat: 22.5726,
                    lon: 88.3639,
                    appid: API_KEY,
                    units: "metric"
                },
                timeout: 5000
            }
        );

        res.json(response.data);
    } catch (error) {
        logger.error("Failed to fetch weather", {
            status: error.response?.status,
            code: error.code
        });

        res.status(502).json({
            error: "Failed to fetch weather data"
        });
    }
});

// Start server
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});
