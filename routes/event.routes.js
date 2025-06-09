import { Router } from "express";
import { createEvent, getEvents, updateEvent } from "../controllers/event.controller.js";

const eventRouter=Router();

eventRouter.get('/',getEvents)
eventRouter.post('/',createEvent)
eventRouter.put('/:id',updateEvent)

export default eventRouter;