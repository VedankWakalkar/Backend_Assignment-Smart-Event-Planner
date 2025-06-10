import { Router } from "express";
import { createEvent, getEvents, updateEvent } from "../controllers/event.controller.js";
import { analyzeWeather, getAlternative, getHourlyBreakdown, getSuitability } from "../controllers/weather.controller.js";

const eventRouter=Router();

eventRouter.get('/',getEvents)
eventRouter.post('/',createEvent)
eventRouter.put('/:id',updateEvent)
eventRouter.post('/:id/weather-check',analyzeWeather)
eventRouter.post('/:id/suitability',getSuitability)
eventRouter.post('/:id/alternatives',getAlternative)
eventRouter.get('/:id/hourly-breakdown',getHourlyBreakdown)

export default eventRouter;