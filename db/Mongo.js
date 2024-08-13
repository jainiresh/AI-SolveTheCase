import { MongoClient, ServerApiVersion } from 'mongodb';
import { MONGO_URI } from '../constants/constants.js';


const uri = MONGO_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
export const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
