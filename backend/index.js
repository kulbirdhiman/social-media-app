import epxress from "express";
import cookieParser from "cookie-parser";
//database
import connectDb from "./db/connectDb.js";
//routes
import userRoutes from './routes/userRoutes.js'
import dotenv from 'dotenv'

dotenv.config()
const app = epxress();
app.use(epxress.json());
app.use(epxress.urlencoded({ extended: true }));
app.use(cookieParser());
connectDb();
const port = process.env.PORT || 4000;

//routes
app.use("/api/user",userRoutes)

app.listen(port, () => console.log(`server up on ${port}`));
