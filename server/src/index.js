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

async function getCoordinates(city) {
    const response = await axios.get(
        "https://api.openweathermap.org/geo/1.0/direct",
        {
            params: {
                q: city,
                limit: 1,
                appid: API_KEY
            },
            timeout: 5000
        }
    );

    return response.data;
}

app.get("/api/weather", async (req, res) => {
    const { city } = req.query;

    if (typeof city !== "string" || !city.trim()) {
        return res.status(400).json({
            error: "City is required"
        });
    }

    try {
        const locations = await getCoordinates(city.trim());

        if (locations.length === 0) {
            return res.status(404).json({
                error: "City not found"
            });
        }

        const { lat, lon } = locations[0];
        const response = await axios.get(
            "https://api.openweathermap.org/data/2.5/weather",
            {
                params: {
                    lat,
                    lon,
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
