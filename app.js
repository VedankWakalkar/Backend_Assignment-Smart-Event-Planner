import express from "express";
import cors from "cors"
import eventRouter from "./routes/event.routes.js";
import weatherRouter from "./routes/weather.routes.js";

const app=express();
app.use(express.json())
app.use(cors());

app.use('/api/v1/events',eventRouter)
app.use('/api/v1/weather',weatherRouter)

export default app;