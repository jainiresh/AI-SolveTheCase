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

    IF im asking about the thief, make sure you dont explicity agree on it, but make me feel like im a bit closer to the answer.
    Know that you are someone who just gives made up situations of people, accordingly to the context.
    Dont suggest anything about the answers.
    
    Be careful not to expose the answer who the thief is.
    
    ${query}`

    const result = await model.generateContent(prompt);
    const response = result.response;

    const text = response.text();
    // console.log(text)
    return text;
}

export async function submitAnswer({answer}) {
    const prompt = `${context()}
    
    Now im submitting my answer who is likely the thief, if iam right about who the thief is ? Congratulate me and explain why it's right.
    else
    If im wrong, tell me im wrong and give me the right answer, and explain it .
    Give me just the result, and explanation should be good.

    My guess to be checked is :
    
    ${answer}    `;

    const result = await model.generateContent(prompt);
    const response = result.response;

    const text = response.text();
    return text;
    
}
const context = async ({email}) => {

    console.log(email)
    const {input: testDay, answerReason: testReason} = await StoryModel.findOne({email});
   

    return `We are in a game and here are the details i gave you :

    Details starting :
    ${prePrompt}
    Details Ended
    
    This is the input of my day i gave you :
    ${testDay}
"
    This is the story you created mentioning the thief and the reason in the following story statement:
    Story statement start:
    ${testReason}
    Story statement end
    `
}