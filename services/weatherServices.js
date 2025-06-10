import { API_KEY } from "../config/env.js"
import axios from "axios";

export const get5DayForecast=async(location)=>{
    const url=`https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${API_KEY}&units=metric`
    const response =await axios.get(url);
    return response.data;
}

export const findForecastDate=(forecastList, targetDate)=>{
    const target= new Date(targetDate).toDateString();
    console.log("Date: ",target)
    return forecastList.filter(entry=>{
        const entryDate = new Date(entry.dt_txt).toDateString();
        console.log("Entry Date: ",entryDate)
        return entryDate === target;
    })
}