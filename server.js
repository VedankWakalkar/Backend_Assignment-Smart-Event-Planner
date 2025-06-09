import app from "./app.js";
import connectToDatabase from "./database/mongoose.js";

const app= app;
const PORT = 5000;

app.listen(PORT,()=>{
    console.log(`Server is running on https://localhost:${PORT}`);
    connectToDatabase();
})