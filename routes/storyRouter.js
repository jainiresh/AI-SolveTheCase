import express from 'express'
import { generateStory, getInvestigationResults, submitAnswer } from '../service/geminiService.js';
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
    const {data:storyInput, email} = req.body;

    try {

        const existsingRecord = await StoryModel.findOne({email});
        if (existsingRecord && existsingRecord.isStoryOpen) {
            throw new Error("User already has a story assigned  !")
        }

        const response = await generateStory({
            inputData: storyInput
        });
        console.log("Response : " + response)

        let responseParts = response.trim().split("\n");
        let storyDesc = responseParts[0];
        let storyAnswer = responseParts[responseParts.length-1];


        if (storyDesc.toLowerCase().startsWith('INPUTNOTENOUGH')) {
           return res.send({ "error": response });
        }

        const { cdnUrl } = await generateImageServiceUrl(storyDesc);
        
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
          const storyModel = new StoryModel({
            email,
            input: storyInput,
            answerReason: storyAnswer,
            threadDetails: threadDetail,
            storyDescription: storyDesc,
            storyMainPicture: cdnUrl,
            capitalThreadId:  sentMessageDetails.data.threadId
            
        })

        const contactModel = new ContactModel({
            email,
            contacts : []
        })

        await storyModel.save();
        const existsingContactRecord = await StoryModel.findOne({email});
        if(!existsingContactRecord){
            await ContactModel.findOne()
        }else{
            await contactModel.save()
        }

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
        const response = await getInvestigationResults({
            query,
            email
        });
        

        console.log("Investigation response received " + JSON.stringify(response).substring(1,30));
        const { cdnUrl } = await generateImageServiceUrl(response);

        const storyThread = await StoryModel.findOneAndUpdate({ email }, {
            $push: {
                queries: query,
                queryResponses: response,
                investigationImages : cdnUrl
            }
        }, { new: true })

        let threadId = storyThread.threadDetails.filter(threadDetail => threadDetail.email === email);
        threadId = threadId[0];

        console.log("Thread id " + threadId)
        await sendEmailViaNylas({
            email,
            subject:  "You have been assigned a case to solve !",
            body: `<h2>Investigation query : </h2> <hr /> <h5>${query}</h5><hr /><img src='${cdnUrl}' /> <br><hr />\n <i>${response}</i> `,
            threadId: threadId.threadId
        })
    

        
        res.json({ 'investigationResult': response })
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