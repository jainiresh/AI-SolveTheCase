import Nylas from 'nylas';
import config from '../config/nylasConfig.js';

const nylas = new Nylas({
  apiKey: config.apiKey,
  apiUri: config.apiUri,
});

const nylasConfig = config;

export async function sendEmailViaNylas({
  name = 'DETECTIVE',
  email,
  subject = 'You have been assigned a case to solve !',
  body,
  threadId = '',
}) {
  console.log('Inside thread id ' + threadId);
  return await nylas.messages.send({
    identifier: nylasConfig.serverAccountGrantId,
    requestBody: {
      to: [{ name, email }],
      subject,
      body,
      replyToMessageId: threadId,
    },
  });
}


export default nylas;
