
const errorHandler = (err, req, res, next) => {

    console.log(err);


    if(err.code === 11000){
        return res.json({
            "errorCode": 400,
            "message": Object.keys(err.keyValue) + " should be unique"
        });
    }

    if(err.code === 66){
        return res.json({
            "errorCode": 400,
            "message": "ID field can not modify"
        });
    }




    res.status(err.statusCode || 500);

    res.json({
        "errorCode": err.statusCode || 500,
        "message": err.message
    });


    
}

module.exports = errorHandler;