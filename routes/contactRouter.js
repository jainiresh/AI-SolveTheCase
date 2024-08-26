import express from 'express';
const contactRouter = express.Router();
import nylas, { sendEmailViaNylas } from '../service/nylasService.js';
import ContactModel from '../models/ContactModel.js';
import mongoose from 'mongoose';
import StoryModel from '../models/StoryModel.js';

contactRouter.post('/list', async (req, res, next) => {
  const grantID = req.body.grantID;
  const email = req.body.email;

  try {
    let resultSet = await ContactModel.find({ email });
    console.log('Contacts ! ' + resultSet);

    if (!resultSet) {
      throw new Error(
        'Contact collection head not found for this email !' + email
      );
    }
    resultSet = resultSet[0].contacts;

    //If already contacts in DB, then return .
    if (resultSet.length > 0) {
      res.json({ data: resultSet });
      return next();
    }

    //Find and upload contacts in DB
    let next_cursor = '';
    let contacts = [];
    while (true) {
      console.log('iteration');
      const response = await nylas.contacts.list({
        identifier: grantID,
        queryParams: {
          limit: 200,
          pageToken: next_cursor,
        },
      });

      //filter out contacts with atleast one email
      let filteredContacts = response.data.filter((contact) => {
        if (contact.emails.length > 0) return true;
      });

      filteredContacts = filteredContacts.map((contact) => ({
        email: contact.emails[0].email,
        contactName: contact.givenName,
        isInvited: false,
      }));

      contacts = [...contacts, ...filteredContacts];

      if (contacts.length > 0) {
        await ContactModel.findOneAndUpdate(
          { email },
          {
            $push: {
              contacts: {
                $each: contacts,
              },
            },
            $set: {
              locked: false,
            },
          }
        );
      }

      next_cursor = response.nextCursor;
      if (!next_cursor) break;
    }

    let temp = await ContactModel.findOne({ email });

    res.json({ data: temp.contacts });
  } catch (e) {
    await ContactModel.findOneAndUpdate(
      { email },
      {
        $set: {
          locked: false,
        },
      }
    );
    console.log(e);
  }
});

contactRouter.post('/invite', async (req, res, next) => {
  try {
    console.log('Start ' + JSON.stringify(req.body));
    let { id: contactID, email: currUserEmail } = req.body;
    console.log(currUserEmail);

    //Gets the email of the current user, and the contactID .
    let contacts = await ContactModel.findOne({ email: currUserEmail });

    //Fetches the contacts of the current User.
    contacts = contacts.contacts;
    console.log('Contacts found ' + JSON.stringify(contacts));

    contactID = new mongoose.Types.ObjectId(contactID);

    let filteredContacts = contacts.filter((contact) => {
      return contact._id.toString() === contactID.toString();
    });

    //If no contacts found, return.
    if (filteredContacts.length < 1) {
      res.status(500).json({ error: 'No contacts found' });
      return next();
    }

    // Get the contact for the contactID
    let invitee = filteredContacts[0];

    console.log('Invite ' + JSON.stringify(invitee));
    if (invitee.isInvited) {
      throw new Error('Contact already invited !');
    }

    // Get the existing story model for the current user.
    let existingStoryPiece = await StoryModel.findOne({ email: currUserEmail });

    // Send a context email
    await sendContext({ invitee });

    // Send the story's start for the invited user.
    const threadIDOfInvitedUser = await fireStart({
      invitee,
      existingStoryPiece,
      currUserEmail,
    });

    // Send the rest of the investigation, if Any !
    for (let index = 0; index < existingStoryPiece.queries.length; index++) {
      await sendEmailViaNylas({
        name: invitee.contactName,
        email: invitee.email,
        subject: 'You have been assigned a case to solve !',
        body: `<h2>Investigation query : </h2> <hr /> <h5>${existingStoryPiece.queries[index]}</h5><hr /><img src='${existingStoryPiece.investigationImages[index]}' /> <br><hr />\n <i>${existingStoryPiece.queryResponses[index]}</i> `,
        threadId: threadIDOfInvitedUser,
      });
    }

    await ContactModel.findOneAndUpdate(
      { email: currUserEmail, 'contacts._id': contactID },
      { $set: { 'contacts.$.isInvited': true } }
    );

    res.json({
      data: `Invited ${invitee.email} to the case, and shared the details !`,
    });
  } catch (error) {
    console.log('Errored ' + JSON.stringify(error.message));
    res.status(500).json({ error: error.message });
  }
});

async function fireStart({ invitee, existingStoryPiece, currUserEmail }) {
  const sentMessageDetails = await sendEmailViaNylas({
    name: invitee.contactName,
    email: invitee.email,
    subject: 'You have been assigned a case to solve !',
    body:
      `<b> Your case has successfully been created ! Find the details below : </b> <br /><hr /><br /> <img src=${existingStoryPiece.storyMainPicture}' /> <hr /> <p><i>` +
      existingStoryPiece.storyDescription +
      '</i></p>',
  });

  let threadDetail = {
    threadId: sentMessageDetails.data.threadId,
    email: invitee.email,
  };

  // Store the thread details, in the story model along with the new email
  await StoryModel.findOneAndUpdate(
    { email: currUserEmail },
    {
      $push: {
        email: invitee.email,
        threadDetails: {
          $each: [threadDetail],
        },
      },
    }
  );

  return threadDetail.threadId;
}

async function sendContext({ invitee }) {
  await sendEmailViaNylas({
    name: invitee.contactName,
    email: invitee.email,
    subject: 'A friend has shared a case with you to help him solve it !',
    body: '<hr /> <i>One of your friends has shared you a mysterious case, to help him solve it ! You would have received it in a seperate email thread , along with the investigations that your friend made ! <i/><h4>Good Luck !</h4> <hr />',
  });
}

export default contactRouter;
