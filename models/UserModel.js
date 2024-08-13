const mongoose = require('../service/mongooseService')
const { USER_AUTH_COLLECTION_NAME } = require('../constants/constants.js');

const userSchemaDetails = {
    firstName:{
        type: String,
        unique: false,
        required: true
    },
    secondName:{
        type: String,
        unique: false,
        required: true
    },
    email:{
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
};

const collectionDetails = {
    collection: USER_AUTH_COLLECTION_NAME
}

const userSchema = new mongoose.Schema(userSchemaDetails,collectionDetails);

module.exports = mongoose.model('User', userSchema);