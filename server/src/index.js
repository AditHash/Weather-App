
import express from "express";
import dotenv from "dotenv";

dotenv.config();    



const app = express();
const PORT = Number(process.env.PORT) || 3000;
const API_KEY = process.env.OPENWEATHER_API_KEY;



app.get("/", (req, res) => {
    res.json({message: "Welcome to Weather API"});
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});