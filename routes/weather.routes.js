import { Router } from "express";
import { getWeatherByLocationAndDate } from "../controllers/weather.controller.js";

const weatherRouter=Router();

weatherRouter.get("/:location/:date",getWeatherByLocationAndDate)

export default weatherRouter;