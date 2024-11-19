const express = require("express");
const app = express();
const connectDB = require("./config/database")
const cookieParser = require("cookie-parser");
const cors = require("cors");

const port = process.env.PORT || 4000;

app.use(
    cors({
        origin: "https://devconnect-web.onrender.com",
        credentials: true, 
    }
));
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB().then(()=>{
    console.log("Database connection successful");
    app.listen(port, ()=>{
        console.log("Server listening at port", port)
    });
})
.catch(err => {
    console.log("Db cannot be connected");
})
