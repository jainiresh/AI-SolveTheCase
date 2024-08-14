import mongoose from 'mongoose';
import { CONTACTS_COLLECTION_NAME } from '../constants/constants.js';
import {  mongooseConnect } from '../service/mongooseService.js';

const ContactSchema = {
    contactName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    isInvited:{
        type:Boolean,
        required:true
    }
}

const UserContactsSchema = {
    email:{
        type:String,
        unique:true,
        required:true
    },
    contacts: {
        type: [ContactSchema],
        required: true
    }
};

const collectionDetails = {
    collection: CONTACTS_COLLECTION_NAME
}

mongooseConnect();

const userContactsSchema = new mongoose.Schema(UserContactsSchema,collectionDetails);

export default mongoose.model('UserContacts', userContactsSchema);