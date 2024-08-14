import express from 'express'
const contactRouter = express.Router();
import nylas, { sendEmailViaNylas } from '../service/nylasService.js';
import ContactModel from '../models/ContactModel.js';
import mongoose from 'mongoose';
import StoryModel from '../models/StoryModel.js';

contactRouter.post('/list', async (req, res, next) => {
    const grantID = req.body.grantID;
    const email = req.body.email;

    let resultSet = await ContactModel.find({email});
    resultSet = resultSet[0].contacts;

    //If already contacts in DB, then return .
    if(resultSet.length > 0)
    {
        res.json({"data":resultSet})
        return next();
    }
    

    //Find and upload contacts in DB
    let next_cursor = '';
    let contacts = [];
    while(true){
    console.log("iteration")
    const response = await nylas.contacts.list({
        identifier: grantID,
        queryParams:{
            limit:200,
            pageToken: next_cursor
        }
    })

    
    //filter out contacts with atleast one email
    let filteredContacts = (response.data.filter(contact => {
        if(contact.emails.length > 0)
            return true;
    }));

    
    filteredContacts = filteredContacts.map(contact => ({
        
        email: contact.emails[0].email,
        contactName : contact.givenName

    }));

   
    
   

    contacts = [...contacts, ...filteredContacts];
    
    if(contacts.length > 0){
       await ContactModel.findOneAndUpdate(
            {email},{
                $push: {
                    contacts :{
                        $each: contacts
                    }               
                }
            }
        )
    }

    next_cursor = response.nextCursor;
    if(!next_cursor)
        break;
    }

    let temp = await ContactModel.findOne({email});
    
    res.json({"data":temp.contacts})
})

contactRouter.post('/invite', async (req, res, next) => {
    try {
        
    
    let {id:contactID, currUserEmail} = req.body;

    //Gets the email of the current user, and the contactID .
    let contacts = await ContactModel.findOne({currUserEmail});

   

    //Fetches the contacts of the current User.
    contacts = contacts.contacts;
    
   

    contactID = new mongoose.Types.ObjectId(contactID);

    
    let filteredContacts = contacts.filter(contact => {
        return contact._id.toString() === contactID.toString()
    });
    console.log(filteredContacts);

    //If no contacts found, return.
    if(filteredContacts.length < 1){
        res.status(500).json({error: 1})
        return next();
    }

    // Get the contact for the contactID
    filteredContacts = filteredContacts[0];

    // Get the existing story model for the current user.
    let existingStoryPiece = await StoryModel.findOne({currUserEmail});

    // Send the story's start for the invited user.
    await fireStart({filteredContacts, existingStoryPiece, currUserEmail});
    
    res.json({data:`Invited ${filteredContacts.email} to the case, and shared the details !`});
} catch (error) {
        console.log("Errored " + JSON.stringify(error) )
        res.status(500).json({error})
}
})

async function fireStart({filteredContacts, existingStoryPiece, currUserEmail}){

    const sentMessageDetails = await sendEmailViaNylas({
        name: filteredContacts.contactName,
        email: filteredContacts.email,
        subject:"You have been assigned a case to solve !",
        body: `<b> Your case has successfully been created ! Find the details below : </b> <br /><hr /><br /> <img src=${existingStoryPiece.storyMainPicture}' /> <hr /> <p><i>` + existingStoryPiece.storyDescription+"</i></p>"
    })

    
    let threadDetail = {
        threadId : sentMessageDetails.data.threadId,
        email: filteredContacts.email
    }

    // Store the thread details, in the story model along with the new email
     await StoryModel.findOneAndUpdate({currUserEmail},{
        $push:{
            email: filteredContacts.email,
            threadDetails:{
                $each: [threadDetail]
            }
        }
    });
}

export default contactRouter;