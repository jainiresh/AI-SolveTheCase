const config = {
    clientId: process.env.NYLAS_CLIENT_ID || '491ed749-0032-48f1-bac4-a2f09001cbca',
    callbackUri: process.env.CALLBACK_URI || "http://localhost:3000/auth/oauth/exchange",
    apiKey: process.env.NYLAS_API_KEY || 'nyk_v0_3ZxACVeKsR4aL1JNGG0qhsTUJrOXszG3DavzjwQ5PLEOfG8L2nSOdqDTGpz0PYnk',
    apiUri: process.env.NYLAS_API_URI ||  'https://api.eu.nylas.com',
    redirectUri: process.env.REDIRECT_URI || 'http://localhost:3000/oauth/success',
    serverAccountGrantId: process.env.SERVER_ACCOUNT_GRANT_ID || "ec999227-37bf-4f3d-bfd0-8c6abdc55e60"
  }

export default config;