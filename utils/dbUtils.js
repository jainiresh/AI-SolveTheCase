import { DATABASE_NAME, STORY_COLLECTION_NAME } from '../constants/constants.js';

export const collectionSelectFromDb = (dbTitle, collectionTitle) => {
    const dbName = dbTitle != null ? dbTitle : DATABASE_NAME;
    const collectionName = collectionTitle != null ? collectionTitle : STORY_COLLECTION_NAME;

    
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    console.log(`Selected collection : ${collection.namespace}`)
    return collection;

}