const express = require("express");
require("./db/databaseConnection");
const errorMiddleware = require("./middleware/errorMiddleware");

// Routes
const userRouter = require("./router/userRouter");
const linkRouter = require("./router/linkRouter");


const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/api/users", userRouter);
app.use("/api/links", linkRouter);


app.listen(3000, ()=>{
    console.log("Server 3000 portundan başlatıldı")
});



app.get("/", (req, res) => {
    res.json({
        "message" : "welcome"
    })
});


app.use(errorMiddleware);
 