import axios from 'axios'

const pingUrl = async() => {
    try{
        const response = await axios.get(pingUrl);
        console.log(`Pinged url :${pingUrl} at ${new Date()} , Server is alive`);
    }
    catch(err){
        console.error("Errored in pinging the url" , pingUrl);
    }
}

export default pingUrl