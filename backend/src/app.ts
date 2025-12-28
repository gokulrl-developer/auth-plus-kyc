import dotenv from 'dotenv'
dotenv.config()
import express from 'express';
import cookieParser from "cookie-parser";
import cors from "cors"
import { errorHandler } from './utils/app-error-handler.js';
import router from './routes/user.routes.js';
import corsOptions from './config/cors.js';


const app= express();
app.use(express.json());

app.use(cors(corsOptions));
app.use(cookieParser());


app.use("/", router);

app.use(errorHandler)

export default app;