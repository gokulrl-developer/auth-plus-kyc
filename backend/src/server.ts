import { connectDB } from "./config/mongoDB"
import app from "./app";


const startServer= async ()=>{
  try{
    await connectDB();

    const PORT=process.env.PORT;

    app.listen(PORT,()=>{
        console.log(`Server starting at port ${PORT}`)
    })
  }catch(error){
     throw new Error("Error starting server")
     process.exit(1);
  }
}

startServer()