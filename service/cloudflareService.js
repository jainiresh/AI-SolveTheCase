import { uploadFile } from "@uploadcare/upload-client/node";
import { CLOUDFLARE_API_KEY, CLOUDFLARE_IMAGE_MODEL, UPLOADCARE_PUBLIC_KEY } from "../constants/constants.js";
import { response } from "express";

async function run(model, input) {
  try{
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/90fc83070e95f461645dd2ed67ef202d/ai/run/${model}`,
      {
        headers: { Authorization: `Bearer ${CLOUDFLARE_API_KEY}` },
        method: "POST",
        body: JSON.stringify(input),
      }
    );

    const imageBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(imageBuffer);

    const result = await uploadFile(buffer, {
      publicKey : UPLOADCARE_PUBLIC_KEY,
      store: 'auto'
    })

    const base64Image = Buffer.from(imageBuffer).toString('base64');
    
    return {cdnUrl : result.cdnUrl, base64Image };
  }
  catch(err){
    console.log("Errored " + JSON.stringify(err));
  }
    
}
  
export const generateImageServiceUrl = async (prompt) => {

  let finalPrmpt = `Give me an image of the situation happening in the following prompt :   ${prompt}`;
  const {cdnUrl, base64Image} = await run(CLOUDFLARE_IMAGE_MODEL, {
    prompt:finalPrmpt
  });

  
  console.log("Cdn url " + cdnUrl);
  return {cdnUrl : `${cdnUrl}-/preview/`, base64Image};
};