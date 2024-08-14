import { UploadClient } from "@uploadcare/upload-client";
import { UPLOADCARE_PUBLIC_KEY } from "../constants/constants.js";

const client = new UploadClient({publicKey : UPLOADCARE_PUBLIC_KEY})

export default client;