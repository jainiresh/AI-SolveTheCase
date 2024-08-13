import mongoose from 'mongoose';
import { STORY_COLLECTION_NAME } from '../constants/constants.js';
import {  mongooseConnect } from '../service/mongooseService.js';

const storySchemaDetails = {
    email:{
        type:String,
        unique:true,
        required:true
    },
    input:{
        type: String,
        unique: false,
        required: true
    },
    capitalThreadId:{
        type: String,
        unique: true,
        required: false
    },
    answerReason:{
        type: String,
        unique: false,
        required: true
    },
    queries:{
        type: [String],
        unique: false
    },
    queryResponses: {
        type: [String],
        required: false
    }
};

const collectionDetails = {
    collection: STORY_COLLECTION_NAME
}

mongooseConnect();

const storySchema = new mongoose.Schema(storySchemaDetails,collectionDetails);

export default mongoose.model('Story', storySchema);