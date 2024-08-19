import {GoogleGenerativeAI} from '@google/generative-ai'
import { prePrompt, testDay, testReason } from '../constants/constants.js';
import StoryModel from '../models/StoryModel.js';
// import { GEMINI_API_KEY } from '../constants/constants'

const genAI = new GoogleGenerativeAI("AIzaSyDLHYtS6M8SbgbaGr52K6CPt1Vbm4xvffw")

const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash'
})

export async function generateStory({inputData}){

    const prompt = `${prePrompt}  
    
    The details of my day goes like this :

    ${inputData}
    `

    const result = await model.generateContent(prompt);
    const response = result.response;

    const text = response.text();
    return text;
}


export async function getInvestigationResults({query, email}){
    
    
    const prompt = `${await context({email})}
    
    Ill be asking you a question below, of suspects and their doings ?
    If they are not related to the theft, give appropriate scenrios that they were doing according to my question.

    If i mention the thief name, or the person's reference and ask about the thief, give me hints related to the final answer, linking to this preson, that would make me think a bit closer that he might be the thief.
    If im not asking about the thief, gthen make up situations of people accordingly to the context.
    Know that you are someone who just gives made up situations of people, accordingly to the context.
    Dont suggest anything about the answers.
    
    Be careful not to expose the name of the culprit is.
    Below is my investigation query ,

    ${query}, is he/she the culprit ?`

    const result = await model.generateContent(prompt);
    const response = result.response;

    const text = response.text();
    // console.log(text)
    return text;
}

export async function submitAnswer({answer, email}) {

    // console.log("Pre prompt : " + context(email) + "$$")
    const prompt = `${await context({email})}
    
    Now im submitting my answer who is likely the thief, compare it with the right answer mentioned above, if iam right about who the thief is ? Congratulate me and explain why it's right.
    else
    If im wrong, tell me im wrong and give me the right answer, and explain it .
    Give me just the result, and explanation should be good.

    My guess to be checked is :
    
    ${answer}  
    
    
    Compare the above against the right answer`;

    const result = await model.generateContent(prompt);
    const response = result.response;

    const text = response.text();
    return text;
    
}

const context = async ({email}) => {

    const {input, answerReason, storyDescription} = await StoryModel.findOne({email});

    console.log("Story desc " +storyDescription)
    return `We are in a game and here are the details i gave you, with which you created a story :

    
    This is the input of my day i gave you :
    ${input}
"
    This is the story you created mentioning the thief and the reason in the following story statement:
    Story statement start:
    ${storyDescription}
    Story statement end

    This is the final answer  and reason of the story's about who is the culprit ? :
    ${answerReason}
    `
}