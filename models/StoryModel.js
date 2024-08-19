import mongoose from 'mongoose';
import { STORY_COLLECTION_NAME } from '../constants/constants.js';
import { mongooseConnect } from '../service/mongooseService.js';

// Define the ThreadSchemaDetails as a Mongoose Schema
const ThreadSchema = new mongoose.Schema({
    threadId: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true
    }
});

// Define the storySchemaDetails
const storySchemaDetails = new mongoose.Schema({
    email: {
        type: [String],
        required: true
    },
    input: {
        type: String,
        required: true
    },
    storyDescription: {
        type: String,
        required: true
    },
    storyMainPicture: {
        type: String,
        required: true
    },
    capitalThreadId: {
        type: String,
        unique: true
    },
    threadDetails: {
        type: [ThreadSchema],
        required: true
    },
    answerReason: {
        type: String,
        required: true
    },
    queries: {
        type: [String]
    },
    queryResponses: {
        type: [String]
    },
    investigationImages: {
        type: [String]
    },
    isStoryOpen: {
        type: Boolean,
        default: true
    }
}, {
    collection: STORY_COLLECTION_NAME
});

// Connect to MongoDB
mongooseConnect();

// Create and export the model
export default mongoose.model('Story', storySchemaDetails);
