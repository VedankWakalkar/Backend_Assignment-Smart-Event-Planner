import { createClient } from "redis";
import { REDIS_URL } from "./env.js";

const redisClient=createClient({url:REDIS_URL});

redisClient.on('error',(err)=>{
    console.error('Redis Error : ',err)
})

await redisClient.connect()

export default redisClient;