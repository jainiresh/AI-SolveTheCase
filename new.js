import { CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_KEY, CLOUDFLARE_IMAGE_MODEL } from "./constants/constants.js";

async function run(model, input) {
    console.log("INput " + input);
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/90fc83070e95f461645dd2ed67ef202d/ai/run/${model}`,
        {
          headers: { Authorization: `Bearer ${CLOUDFLARE_API_KEY}` },
          method: "POST",
          body: JSON.stringify(input),
        }
      );

      console.log("Response " + JSON.stringify(response))
  
      const imageBuffer = await response.arrayBuffer();
      return Buffer.from(imageBuffer);
  
      
      
  }

await run(CLOUDFLARE_IMAGE_MODEL, {
    prompt:"Cybercat"
});