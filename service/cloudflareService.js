import { uploadFile } from "@uploadcare/upload-client/node";
import { CLOUDFLARE_API_KEY, CLOUDFLARE_IMAGE_MODEL, PINATA_GATEWAY_DOMAIN, PINATA_GATEWAY_PATH, PINATA_JWT_KEY, UPLOADCARE_PUBLIC_KEY } from "../constants/constants.js";
import { PinataSDK } from "pinata-web3";

const pinata = new PinataSDK({
  pinataJwt: PINATA_JWT_KEY,
  pinataGateway : PINATA_GATEWAY_DOMAIN
})

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

    console.log(response)

    const arrayBuffer = await response.arrayBuffer();

    console.log(arrayBuffer)

    const blob = new Blob([Buffer.from(arrayBuffer)])
    let file = new File([blob], {
        type : 'image/png'
    })

    console.log(file)

    const upload = await pinata.upload.file(file)

    const base64Image = Buffer.from(arrayBuffer).toString('base64');
    
    return {cdnUrl : PINATA_GATEWAY_PATH + "/" + upload.IpfsHash, base64Image };
  }
  catch(err){
    console.log(err);
  }
    
}
  
export const generateImageServiceUrl = async (prompt) => {

  let finalPrmpt = `Give me an image of the situation happening in the following prompt :   ${prompt}`;
  const {cdnUrl, base64Image} = await run(CLOUDFLARE_IMAGE_MODEL, {
    prompt:finalPrmpt
  });

  
  console.log("Cdn url " + cdnUrl);
  return {cdnUrl : `${cdnUrl}`, base64Image};
};