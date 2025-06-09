import app from "./app.js";
import connectToDatabase from "./database/mongoose.js";
import { PORT } from "./config/env.js";

app.listen(PORT,()=>{
    console.log(`Server is running on https://localhost:${PORT}`);
    connectToDatabase();
})