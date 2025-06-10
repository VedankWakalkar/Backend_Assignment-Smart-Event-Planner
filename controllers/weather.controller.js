import { success } from "zod/v4";
import Event from "../models/event.model.js";
import { findForecastDate, get5DayForecast } from "../services/weatherServices.js";
import { getCache, setCache } from "../utils/cache.js";

export const getWeatherByLocationAndDate=async(req,res)=>{
    const {location,date}=req.params;
    const cacheKey=`weather:${location}:${date}`
    try {
        console.log("Code reaching here : 1")
        const cached=await getCache(cacheKey);
        if(cached){
            return res.status(200).json({
                success:true,
                message:"cached",
                data:cached
            })
        }   
        console.log("Code reaching here : 2")
        const forecast=await get5DayForecast(location);
        const filtered = findForecastDate(forecast.list,date);
        console.log("filterd Data : ",filtered)
        if(!filtered.length){
            return res.status(404).json({
                success:false,
                message:"No forecast found on the given date"
            })
        }

        await setCache(cacheKey,filtered)

        res.status(200).json({
            success:true,
            data:filtered
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

export const analyzeWeather= async (req,res)=>{
    const {id} = req.params;
    try {
        const event=await Event.findById(id);
        if(!event){
            return res.status(404).json({
                success:false,
                message:"Event with this Id not found"
            })
        }

        const forecast=await get5DayForecast(event.location);
        const filteredData= findForecastDate(forecast.list,event.date)

        if(!filteredData){
            return res.status(404).json({
                success:false,
                message:`No data found for this event date ${event.date}`
            })
        }
        event.weatherAnalysis.details=filteredData;
        await event.save();
        console.log("updated Event: ",event.weatherAnalysis)
        
        return res.status(200).json({
            success:true,
            message:'Weather linked',
            data:{
                filteredData
            }
        })

    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

export const getSuitability= async(req,res)=>{
    try{
        const eventId=req.params.id;
        const event= await Event.findById(eventId);
        if(!event){
            return res.status(404).json({
                success:false,
                message:`Event this is eventId : ${eventId} does not exists`
            })
        }

        const forecasts= event.weatherAnalysis.details;
        if(!forecasts || forecasts.length==0){
            return res.status(404).json({
                success:false,
                message:"No Forecast Found for the Event."
            })
        }

        let totalScore=0;
        const typeOfEvent= event.type;

        forecasts.forEach((forecast)=>{
            let score=0;

            if(typeOfEvent === "sports"){
            
                const temp=forecast.main.temp;
                if(temp>=15 &&  temp<=30)score+=30;
            
                const percipitation=forecast.populate;
                if(percipitation<0.25)score+=25;
            
                const windSpeed=forecast.wind.speed;
                if(windSpeed<20)score+=20
            
                const weather= forecast.weather.main;
                if(weather==="Clouds" || weather==="Clear")score+=25
            
                totalScore+=score
            }else{
            
                const temp=forecast.main.temp;
                if(temp>=18 &&  temp<=28)score+=30;
            
                const percipitation=forecast.populate;
                if(percipitation<0.1)score+=30;
            
                const windSpeed=forecast.wind.speed;
                if(windSpeed<15)score+=25
            
                const weather= forecast.weather.main;
                if(weather==="Clouds" || weather==="Clear" || weather=="Few clouds")score+=25
            
                totalScore+=score
            }
        })
        const avgScore = totalScore / forecasts.length;

        let suitability;
        if (avgScore >= 80) suitability = "Good";
        else if (avgScore >= 50) suitability = "Okay";
        else suitability = "Poor";
        
        event.weatherAnalysis.suitability = suitability;
        await event.save();

        res.status(200).json({
        success: true,
        score: avgScore,
        suitability,
        });
    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

export const getAlternative= async(req,res)=>{
    try {
        const eventId=req.params.id;
        const event = await Event.findById(eventId);

        if(!event){
            return res.status(404).json({
                success:false,
                message:`Event with this eventId : ${eventId} does not exists.`
            })
        }

        const forecasts= await get5DayForecast(event.location);
        const forecastList= forecasts.list;

        const dateScores={};

        forecastList.forEach((entry)=>{
            const date = new Date(entry.dt_txt).toDateString();
            console.log("Checking the format of Date: ",date)

            if(!dateScores[date]){
                dateScores[date]=[]
            }
            dateScores[date].push(entry)
        })
        const typeOfEvent= event.type;

        const evaluatedDates = Object.entries(dateScores).map(([dateStr, entries]) => {
            console.log("checking the dateStr: ",dateStr)
            let totalScore = 0;
        
        entries.forEach((forecast) => {
            let score=0;

            if(typeOfEvent === "sports"){
            
                const temp=forecast.main.temp;
                if(temp>=15 &&  temp<=30)score+=30;
            
                const percipitation=forecast.populate;
                if(percipitation<0.25)score+=25;
            
                const windSpeed=forecast.wind.speed;
                if(windSpeed<20)score+=20
            
                const weather= forecast.weather.main;
                if(weather==="Clouds" || weather==="Clear")score+=25
            
                totalScore+=score
            }else{
            
                const temp=forecast.main.temp;
                if(temp>=18 &&  temp<=28)score+=30;
            
                const percipitation=forecast.populate;
                if(percipitation<0.1)score+=30;
            
                const windSpeed=forecast.wind.speed;
                if(windSpeed<15)score+=25
            
                const weather= forecast.weather.main;
                if(weather==="Clouds" || weather==="Clear" || weather=="Few clouds")score+=25
            
                totalScore+=score
            }
        });

        const avgScore = totalScore / entries.length;
        return {
            date: dateStr,
            avgScore,
            suitability:
              avgScore >= 80 ? "Good" : avgScore >= 50 ? "Okay" : "Poor",
        };
        });

    // Remove original event date from alternatives
        const currentEventDate = new Date(event.date).toDateString();
        const alternatives = evaluatedDates
          .filter((entry) => entry.date !== currentEventDate && entry.suitability !== "Poor")
          .sort((a, b) => b.avgScore - a.avgScore)
          .slice(0, 2); // Return top 2 suggestions

        res.status(200).json({
          success: true,
          message:`The best Alternative for this Event (which is ${event.type}) is ${alternatives[0].date}`,
          alternatives,
        }); 

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}