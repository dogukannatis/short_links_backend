const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/restful_api", {useUnifiedTopology: true, useNewUrlPArser: true})
    .then(()=>{
        console.log("Veritabanı bağlantısı başarılı");
    })
    .catch((err)=>{
        console.log("Veritabanı bağlantı hatası : " + err);
    });



