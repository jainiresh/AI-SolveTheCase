import mongoose from 'mongoose';
import { STORY_COLLECTION_NAME } from '../constants/constants.js';
import {  mongooseConnect } from '../service/mongooseService.js';


const ThreadSchemaDetails = {
    threadId:{
        type: String,
        required: true,
        unique: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    }
}
const storySchemaDetails = {
    email:{
        type:[String],
        unique:false,
        required:true
    },
    input:{
        type: String,
        unique: false,
        required: true
    },
    storyDescription:{
        type: String,
        required: true
    },
    storyMainPicture:{
        type: String,
        required: true
    },
    capitalThreadId:{
        type: String,
        unique: true,
        required: false
    },
    threadDetails:{
        type: [ThreadSchemaDetails],
        required: true
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
    },
    investigationImages:{
        type: [String],
        required: false
    },
    isStoryOpen: {
        type: Boolean,
        required: false,
        default: true
    }
};

const collectionDetails = {
    collection: STORY_COLLECTION_NAME
}

mongooseConnect();

const storySchema = new mongoose.Schema(storySchemaDetails,collectionDetails);

export default mongoose.model('Story', storySchema);