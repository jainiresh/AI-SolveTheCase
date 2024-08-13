import express from 'express'
import { generateStory, getInvestigationResults, submitAnswer } from '../service/geminiService.js';
import StoryModel from '../models/StoryModel.js';
import config from '../config/nylasConfig.js';
import Nylas from 'nylas';
const storyRouter = express.Router();


const nylas = new Nylas({ 
    apiKey: config.apiKey, 
    apiUri: config.apiUri
  })
const nylasConfig = config;


storyRouter.post('/create', async (req, res, next) => {
    const {data:storyInput, email} = req.body;

    try {
        const response = await generateStory({
            inputData: storyInput
        });
        console.log("Response : " + response)

        const existsingRecord = await StoryModel.findOne({ email});
        if (existsingRecord) {
            throw new Error("User already has a story assigned  !")
        }

        const sentMessageDetails = await nylas.messages.send({
            identifier: nylasConfig.serverAccountGrantId,
            requestBody: {
              to: [{ name: "JOHN DOE", email }],
              subject: "MYSTERY_STORY_BOT",
              body: "Your story has successfully been created",
            },
          });

          const threadId = sentMessageDetails.data.threadId;

          const storyModel = new StoryModel({
            email,
            input: storyInput,
            answerReason: response,
            capitalThreadId: threadId
        })

        await storyModel.save();


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
    const { data: query, email } = req.body;

    try {
        const response = await getInvestigationResults({
            query,
            email
        })

        const storyThread = await StoryModel.findOneAndUpdate({ email }, {
            $push: {
                queries: query,
                queryResponses: response
            }
        }, { new: true })

        const sentMessageDetails = await nylas.messages.send({
            identifier: nylasConfig.serverAccountGrantId,
            requestBody: {
              to: [{ name: "JOHN DOE", email }],
              replyToMessageId: storyThread.capitalThreadId,
              subject: "MYSTERY_STORY_BOT",
              body: response,
            },
          });

        
        res.json({ 'investigationResult': response })
    } catch (error) {
        res.json({ 'error': error.message })
    }

});

storyRouter.post('/submit', async (req, res, next) => {
    const { data: answer, email } = req.body;
    const response = await submitAnswer({
        answer
    });
    await StoryModel.findOneAndUpdate({ email }, {
        $push: {
            queries: answer,
            queryResponses: response
        }
    }, { new: true })
    res.json({ 'result': response })
})

export default storyRouter;