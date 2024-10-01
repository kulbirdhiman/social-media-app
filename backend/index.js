import epxress from "express";
import cookieParser from "cookie-parser";
//database
import connectDb from "./db/connectDb.js";
const app = epxress();
app.use(epxress.json());
app.use(epxress.urlencoded({ extended: true }));
app.use(cookieParser());
connectDb();
const port = process.env.PORT || 4000;

app.listen(port, () => console.log(`server up on ${port}`));
