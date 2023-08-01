const mongoose = require("mongoose");
require('dotenv').config()

mongoose.connect(process.env.MONGODB_CONNECTION_URL, {useUnifiedTopology: true, useNewUrlPArser: true})
    .then(()=>{
        console.log("Veritabanı bağlantısı başarılı");
    })
    .catch((err)=>{
        console.log("Veritabanı bağlantı hatası : " + err);
    });



