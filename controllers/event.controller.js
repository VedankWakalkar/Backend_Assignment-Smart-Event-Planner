import mongoose from "mongoose";
import Event from "../models/event.model.js"
import eventSchema, { updateEventSchema } from "../validations/event.validation.js";
import { safeParse } from "zod/v4-mini";

export const getEvents= async(req,res)=>{
    try {
        const events= await Event.find();
        res.status(200).json({
            success:true,
            data:{
                events
            }
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message: error.message
        });

    }
}

export const createEvent = async(req,res)=>{
    
    const validation = eventSchema.safeParse(req.body);
    if(!validation.success){
        return res.status(400).json({
            success:false,
            message:'Input Validation Failed',
            errors:validation.error.errors
        })
    }
    const session =await mongoose.startSession();
    try {
        session.startTransaction();
        const {name , location, date, type } =validation.data;
        const eventExist= await Event.findOne({name});
        if(eventExist){
            await session.abortTransaction();
            session.endSession(); 
            return res.status(409).json({
                success:false,
                message:"Event with this name already Listed"
            })
        }

        const newEvent = await Event.create(
            [{name ,
            location,
            type,
            date}],{session}
        )
        await session.commitTransaction();
        session.endSession()
        res.status(201).json({
            success:true,
            message:"Event Created Successfully",
            data:{
                newEvent
            }
        })
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

export const updateEvent = async(req,res)=>{

    const {id}=req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({
            success:false,
            message:"Invalid ID"
        })
    }

    const validation= updateEventSchema.safeParse(req.body);
    if(!validation.success){
        return res.status(400).json({
            success:false,
            message:'Input Validation Failed',
            errors:validation.error.errors
        })
    }

    try {
        const updatedEvent= await Event.findByIdAndUpdate(id,{
            $set:validation.data
        },{
            new: true, runValidators: true 
        })

        if(!updatedEvent){
            return res.status(404).json({
                success:false,
                message:"Event not Found"
            })
        }
        res.status(200).json({
            success:true,
            message:"Event Updated Successfully",
            data:{
                updatedEvent
            }
        })

    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }


}