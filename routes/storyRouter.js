import express from 'express'
import { generateStory, getInvestigationResults, submitAnswer } from '../service/geminiService.js';
const storyRouter = express.Router();


storyRouter.post('/create', async (req, res, next) => {
    const storyInput = req.body.data;
    const response = await generateStory({
        inputData : storyInput
    });

    res.json({'storyDetails':response})
})


storyRouter.post('/investigate', async (req, res, next) => {
    const query = req.body.data;
    const response = await getInvestigationResults({
        query
    })
    res.json({'investigationResult':response})

});

storyRouter.post('/submit', async (req, res, next) => {
    const answer = req.body.data;
    const response = await submitAnswer({
        answer
    });
    res.json({'result':response})
})

export default storyRouter;