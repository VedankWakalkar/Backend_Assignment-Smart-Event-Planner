import mongoose from "mongoose";

const eventSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    location:{
        type:String,
        required:true
    }, 
    date:{
        type:Date,
        required:true
    },
    type:{
        type:String,
        enum:['sports','wedding','hiking','office','others'],
        required:true,
    },
    weatherAnalysis:{
        suitability:{
            type:String,
            default:null
        },
        details:{
            type:Object,
            default:null
        }
    }
},{
    timestamps:true
})

const Event= mongoose.model('Event',eventSchema);

export default Event;