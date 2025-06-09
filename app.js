import express from "express";
import cors from "cors"
import eventRouter from "./routes/event.routes.js";

const app=express();
app.use(express.json())
app.use(cors());

app.use('/api/v1/events',eventRouter)

export default app;