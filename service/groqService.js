import axios from 'axios';
import { prePrompt, testDay, GROQ_API_KEY } from '../constants/constants.js';
import StoryModel from '../models/StoryModel.js';

const GROQ_BASE_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

async function chatCompletion(prompt) {
  const response = await axios.post(
    GROQ_BASE_URL,
    {
      model: GROQ_MODEL,
      messages: [{ role: 'user', content: prompt }],
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
    }
  );
  return response.data.choices[0].message.content;
}

export async function generateNickNames(inputData) {
  const prompt = `Let me give you a paragraph below, output it in the same way but additionally adding names to the characters/roles, that dont have a name in it.
    
    
    
    ${inputData}`;

  return await chatCompletion(prompt);
}

export async function generateNickNamesWithReference(referenceData, inputData) {
  const prompt = `Let me give you a paragraph at the end enclosed in $, output it in the same way but additionally adding names to the characters/roles, referring to the below paragraph.
    
    Reference : 
    ${referenceData}

    To be output : 
    $    
    ${inputData}
    $`;

  return await chatCompletion(prompt);
}

export async function generateStory({ inputData }) {
  const prompt = `${prePrompt}  
    
    The details of my day goes like this :

    ${inputData}
    `;

  return await chatCompletion(prompt);
}

export async function getInvestigationResults({ query, email }) {
  const { prePrompt, answerReason } = await investigationContext({ email });

  const prompt = `${prePrompt}

    Get the actual culprit name/role from the below short text, and the reason behind their actions and let it be called as CULPRIT, and CULPRIT_REASON : 
    ${answerReason}

    Get the suspect name/role from the below short text, and their investigation query , and let it be called as SUSPECT, SUSPECT_INVESTIGATION respectively
    Investigation : 
    ${query}, is he/she the culprit ?

    In my investigation
    If, SUSPECT and CULPRIT's name/roles are different or NOT SAME,  Then, give appropriate scenarios that they were doing according to my question, and make sure your response starts with the word "NOT_SUS", and store this scenarios, in RESPONSE.
    else 
    If SUSPECT and CULPRIT's name/roles are SAME then make up situations that connects SUSPECT_INVESTIGATION to CULPRIT_REASON, and tell me he looks suspicious without directly telling me that he/she is the thief, and make sure your response starts with the word "SUS$" and store these scenarios, in RESPONSE

    Know that you are someone who just gives made up situations of people, accordingly to the context.
    Dont use words like "maybe", "might be", or it's synonyms, tell me strongly that this is what happened.
    
    Be careful not to expose the name of the actual culprit in your response.
`;

  console.log('Pre prompt is : ' + prompt);

  let text = await chatCompletion(prompt);

  const nonSusIndex = text.lastIndexOf('NOT_SUS');
  const susIndex = text.lastIndexOf('SUS$');

  console.log(nonSusIndex + ' $ ' + susIndex);

  console.log('Text full : ' + text);
  text =
    nonSusIndex != -1
      ? text.substring(nonSusIndex + 7)
      : susIndex != -1
      ? text.substring(susIndex + 4)
      : 'Error investigating, can you please retry your investigation ?';
  console.log('Text partial : ' + text);
  return { imageResponse: null, text };
}

export async function submitAnswer({ answer, email }) {
  const prompt = `${await context({ email })}
    
    Now im submitting my answer who is likely the thief, compare it with the right answer mentioned above, if iam right about who the thief is ? Congratulate me and explain why it's right.
    else
    If im wrong, tell me im wrong and give me the right answer, and explain it .
    Give me just the result, and explanation should be good.

    My guess to be checked is :
    
    ${answer}  
    
    
    Compare the above against the right answer, and give me the result if im right or wrong in the first line.
    And the sentence "If you would have investigated further, you could have found that", in the following line and match the reason with it.`;

  return await chatCompletion(prompt);
}

const context = async ({ email }) => {
  const { input, answerReason, storyDescription } = await StoryModel.findOne({
    email,
  });

  console.log('Story desc ' + storyDescription);
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
    `;
};

const investigationContext = async ({ email }) => {
  const { input, answerReason, storyDescription } = await StoryModel.findOne({
    email,
  });

  return {
    prePrompt: `I am a detective, and you are a story teller who makes up situations, and who responds to questinos asked to you about people. the story context is 
    ${input}, while this happened, the story plot happened is : ${storyDescription}"
    
    `,
    answerReason,
  };
};

export const generateRandomStory = async () => {
  const prompt = `Look at this day : 
  ${testDay}, and similarly generate and give me a day, keep the word count approximately same, including at max 5 people names
  Output only the day, and strictly keep it withing 999 characters`;

  return await chatCompletion(prompt);
};
