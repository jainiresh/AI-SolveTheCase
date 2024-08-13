const mongoose = require('mongoose');
const constants = require('../constants/constants')
const {mongooseConfig} = require('../config/mongooseConfig')

mongoose
.connect(constants.MONGO_URI, {...mongooseConfig, dbName: constants.USER_DB_NAME})
.then(()=>{
    console.log("MongoDB connected via Mongoose !")
})
.catch((err) => {
    console.error("Connection error on MongoDB, via Mongoose " + err)
})

module.exports = mongoose;