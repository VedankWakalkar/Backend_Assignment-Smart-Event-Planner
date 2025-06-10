import redisClient from "../config/redis.js"

export const getCache=async(key)=>{
    const data= await redisClient.get(key);
    return data ? JSON.parse(data):null
}

export const setCache=async (key,value)=>{
    await redisClient.setEx(key,21600,JSON.stringify(value))
}