import { pingUrl } from "../constants/constants.js";

const config = {
    clientId: process.env.NYLAS_CLIENT_ID || 'f463709b-7ba2-408f-b48a-584d3298e841',
    callbackUri: process.env.CALLBACK_URI || `${pingUrl}/auth/oauth/exchange`,
    apiKey: process.env.NYLAS_API_KEY || 'nyk_v0_QpVw8xAWqtNPx89P0UDXX8xrINpJmp9r1cRROctOqCZ2AwxniSOjHTSmgFjssHep',
    apiUri: process.env.NYLAS_API_URI ||  'https://api.us.nylas.com',
    redirectUri: process.env.REDIRECT_URI || `${pingUrl}/oauth/success`,
    serverAccountGrantId: process.env.SERVER_ACCOUNT_GRANT_ID || "5033af8a-e472-46fc-b9f2-48a8a6fdd43c"
  }

export default config;