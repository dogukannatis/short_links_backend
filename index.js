const express = require("express");
require("./db/databaseConnection");
require('dotenv').config();

const errorMiddleware = require("./middleware/errorMiddleware");


// Routes
const userRouter = require("./router/userRouter");
const linkRouter = require("./router/linkRouter");
const statisticsRouter = require("./router/statisticsRouter");
const linkController = require("./controllers/linkController");

// Session
const session = require("express-session");

const ejs = require("ejs");

const expressLayouts = require("express-ejs-layouts");

const app = express();

const path = require("path");

const cors=require("cors");

app.set("view engine", "ejs");
app.set("views", path.relative(__dirname, "./views"));


app.use(express.json());
app.use(express.urlencoded({extended: true}));



const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}

app.use(cors(corsOptions)) // Use this after the variable declaration


app.use("/api/users", userRouter);
app.use("/api/links", linkRouter);
app.use("/api/statistics", statisticsRouter);

app.use(session({
    secret: "SSK010203.Q",
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}));


app.listen(process.env.PORT || 5000, ()=>{
    console.log("Server " + process.env.PORT + " portundan başlatıldı")
});



app.get("/", (req, res) => {
    res.json({
        "message" : "welcome"
    })
});

// Redirect to original link
app.get("/:ref", linkController.redirect);



app.use(errorMiddleware);
 