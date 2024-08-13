import {client} from '../db/Mongo.js'


export async function connectToDatabase(){
    try{
        console.log('Startig to connect mongo db')
        await client.connect();
        console.log("Mongo db connection successful !")
        
    }
    catch(err){
        console.error("Failed to connect MongoDb");
        throw err;
    }
}
