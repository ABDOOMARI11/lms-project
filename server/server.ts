import {app} from "./app";
import connectDB from "./Utils/db"
require("dotenv").config();





app.listen(process.env.PORT, () =>{
    console.log(`server is connected with port ${process.env.PORT}`);
    connectDB();
});