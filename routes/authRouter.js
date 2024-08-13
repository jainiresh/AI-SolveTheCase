import express from 'express';
const router = express.Router();
import config from '../config/nylasConfig.js';
import Nylas from 'nylas'

const nylas = new Nylas({ 
    apiKey: config.apiKey, 
    apiUri: config.apiUri
  })

router.get('/oauth/success', (req, res) => {
    res.json({success: 1})
})

router.get('/nylas/hostedAuth', (req, res) => {  
  const authUrl = nylas.auth.urlForOAuth2({
    clientId: config.clientId,
    provider: 'google',
    redirectUri: config.callbackUri
  })

  res.redirect(authUrl)
})   

router.get('/oauth/exchange', async (req, res) => {
    const code = req.query.code
  
    if (!code) {
      res.status(400).send('No authorization code returned from Nylas')
  
      return
    }
  
    try {
      const response = await nylas.auth.exchangeCodeForToken({ 
        clientId: config.clientId,
            redirectUri: config.callbackUri,
            code
      })
  
      const { grantId } = response
      localStorage.setItem("grantId", grantId);

      console.log(`Grant id : ${grantId}`)
  
      res.status(200)
      res.redirect(`http://localhost:3000/oauth/success`)
    } catch (error) {
      res.status(500).send('Failed to exchange authorization code for token ' + JSON.stringify(error))
    }
  })  

  router.get('/logout', (req, res) => {
    localStorage.removeItem('grantId');
    res.redirect('/login');
})


export default router;