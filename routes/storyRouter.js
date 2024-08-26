import express from 'express'
import { generateNickNames, generateNickNamesWithReference, generateStory, getInvestigationResults, submitAnswer } from '../service/geminiService.js';
import StoryModel from '../models/StoryModel.js';
import config from '../config/nylasConfig.js';
import { generateImageServiceUrl } from '../service/cloudflareService.js';
import nylas, { sendEmailViaNylas } from '../service/nylasService.js';
import ContactModel from '../models/ContactModel.js';
const storyRouter = express.Router();



const nylasConfig = config;



storyRouter.post('/exists', async (req, res, next) => {
    const {email} = req.body;
    const existsingRecord = await StoryModel.findOne({email});
    res.json({"response" : existsingRecord && existsingRecord.isStoryOpen})
})

storyRouter.post('/get', async (req, res, next) => {
    const {email} = req.body;
    const existsingRecord = await StoryModel.findOne({email});
    res.json({"response" : existsingRecord})
})

storyRouter.post('/create', async (req, res, next) => {
    let {data:storyInput, email} = req.body;

    
    console.log("Create router");
    console.log("Story input : " + storyInput + " $ " + email)
    try {


        if(!storyInput || storyInput == ''){
            throw new Error("No input storyinput found !");
        }
        
        const existsingRecord = await StoryModel.findOne({email, isStoryOpen: true});
        if (existsingRecord && existsingRecord.isStoryOpen) {
            throw new Error("User already has a story assigned  !")
        }
        //TBC , deleting the old records
        await StoryModel.findOneAndDelete({email, isStoryOpen:false});
        await ContactModel.findOneAndDelete({email});

        const response = await generateStory({
            inputData: storyInput
        });
        console.log("Response : " + response)

        let responseParts = response.trim().split("\n");
        let storyDesc = responseParts[0];
        let storyAnswer = responseParts[responseParts.length-1];

        storyInput = await generateNickNames(storyInput);
        storyAnswer = await generateNickNamesWithReference(storyInput, storyAnswer);


        if (storyDesc.toLowerCase().startsWith('INPUTNOTENOUGH')) {
           return res.send({ "error": response });
        }

        const { cdnUrl } = await generateImageServiceUrl(storyDesc);
        
        
          const storyModel = new StoryModel({
            email,
            input: storyInput,
            answerReason: storyAnswer,
            storyDescription: storyDesc,
            storyMainPicture: cdnUrl,
            isStoryOpen: true
            
        })

        const contactModel = new ContactModel({
            email,
            contacts : [],
            locked:false
        })

        console.log("Trying to save story Model")
        await storyModel.save();

        console.log("Saved story Model")
        const existsingContactRecord = await ContactModel.findOne({email});
        if(!existsingContactRecord){
            console.log("Existing contact record not found")
            await contactModel.save()
        }

        const sentMessageDetails = await sendEmailViaNylas({
            name: "Mr Detective",
            email,
            subject: "You have been assigned a case to solve !",
            body: `<b> Your case has successfully been created ! Find the details below : </b> <br /><hr /><br /> <img src=${cdnUrl}' /> <hr /> <p><i>` + storyDesc+"</i></p>"
        })

          const threadDetail = {
            threadId: sentMessageDetails.data.threadId,
            email: email
          }

        await StoryModel.findOneAndUpdate({email, isStoryOpen:true}, {$set: {
            threadDetails: [threadDetail],
            capitalThreadId: sentMessageDetails.data.threadId
          }})        


        console.log("Debug nylas message " + JSON.stringify(sentMessageDetails))
       
        res.json({ 'storyDetails': response });

    }
    catch (err) {
        res.json({
            'error': err.message
        })
    }
    next();
})


storyRouter.post('/investigate', async (req, res, next) => {
    console.log(req)
    const { data: query, email } = req.body;

    try {
        const {text} = await getInvestigationResults({
            query,
            email
        });

        console.log("Text is " + text)

        const { cdnUrl } = await generateImageServiceUrl(text);

        const storyThread = await StoryModel.findOneAndUpdate({ email }, {
            $push: {
                queries: query,
                queryResponses: text,
                investigationImages : cdnUrl
            }
        }, { new: true })

        let threadId = storyThread.threadDetails.filter(threadDetail => threadDetail.email === email);
        threadId = threadId[0];

        console.log("Thread id " + threadId)
        await sendEmailViaNylas({
            email,
            subject:  "You have been assigned a case to solve !",
            body: `<h2>Investigation query : </h2> <hr/> <h5>${query}</h5><hr/><img src='${cdnUrl}' /> <br><hr/> \n <i>${text}</i> `,
            threadId: threadId.threadId
        })
    


        res.json({ 'investigationResult': text, imageUrl:cdnUrl })
    } catch (error) {
        res.json({ 'error': error.message })
    }

});

storyRouter.post('/submit', async (req, res, next) => {
    const { data: answer, email } = req.body;
    const response = await submitAnswer({
        answer,
        email
    });
    await StoryModel.findOneAndUpdate({ email }, {
        $push: {
            queries: answer,
            queryResponses: response,
        },
        isStoryOpen: false
    }, { new: true })
    res.json({ 'result': response })
})

storyRouter.post('/genImage', async (req, res, next) => {
    
    res.send(await generateImageServiceUrl(req.body.data));
})


export default storyRouter;