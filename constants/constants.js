export const USER_AUTH_COLLECTION_NAME = process.env.USER_AUTH_COLLECTION_NAME || 'Users'
export const STORY_COLLECTION_NAME = process.env.STORY_COLLECTION_NAME || 'Stories'
export const  MONGO_URI = process.env.MONGO_URI || "mongodb+srv://nireshpandian19:MongoDb008%40@targetdomains.a7fqocp.mongodb.net/?retryWrites=true&w=majority&appName=TargetDomains"
export const USER_DB_NAME = process.env.USER_DB_NAME || "nireshpandian19"
export const DATABASE_NAME = process.env.DATABASE_NAME || "StoryBot"
export const CONTACTS_COLLECTION_NAME = process.env.CONTACTS_COLLECTION_NAME || "UserContacts"

//GEMINI SERVICE
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyDLHYtS6M8SbgbaGr52K6CPt1Vbm4xvffw'
export const CLOUDFLARE_API_KEY = process.env.CLOUDFLARE_API_KEY || "W3v6ffHWxczZO9f1gQvyeKwcZSJsFNH_8drcDzZA"
export const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || "90fc83070e95f461645dd2ed67ef202d"
export const CLOUDFLARE_IMAGE_MODEL = process.env.CLOUDFLARE_IMAGE_MODEL || "@cf/stabilityai/stable-diffusion-xl-base-1.0"


//UPLOADCARE
export const UPLOADCARE_PUBLIC_KEY = process.env.UPLOADCARE_PUBLIC_KEY || "9e3af627f3eab612be88";



//PROMPTS
export const prePrompt = `
LEts play a interestingn mystery game

Ill share you details about my day,  like
 - whom all i met ?
 - what they do ?
 - i occasionally also provide at which circumstance/instance i met them today.
 - where i met thim ?
 - when i met them ?
etc.,.,

Remember you are telling this story to kids, so dont use harsh words.

Assume all of these is happening in my town.
form a decent robbery story without any harsh words, where a rich person or some valuable thing got stolen in our town, and make one of the people i met the thief, dont tell me who.

Form a clear reason, it can include details that was made up by you , or unrelated to the details i have mentioned, about why the thief stole the money, sky is your imagination.

Give me strictly 2 paragraphs.
The first paragraph should contain the description of the story without exposing who the culprit is,
 and the 2nd paragraph should tell me, who is the thief and the paragraph of reason of why he stole in detail.

There must be only one answer, who is the thief and one reason that he did it.
You can yourself make situations happening to people, even if i have not mentioned it.

`;

// If the input is not enough give me response like "INPUTNOTENOUGH"

export const testReason = `
The thief is Antony. 
Antony, your friend, was in dire straits. He'd been struggling financially for months, unable to keep up with mounting debts. He'd been secretly betting on sports, hoping for a quick win to solve his problems, but his luck had run out.  He had even resorted to taking out loans from shady figures, accumulating a crushing amount of interest. When a friend mentioned the town's wealthiest resident had recently received a large sum of money, a desperate idea took root in his mind. He knew the resident's daily routine, having spoken to him often. He decided to use the phone call as a cover, hoping you wouldn't notice the brief call was more than just a connection issue. The money, he reasoned, would be enough to cover his debts and even give him a fresh start. \n
`
export const testDay = `
Morning i woke up, and my gardener was watering my plants .\nHe was cheerful as everyday, singing while watering the plants.\n\nI got up and took up my laptop.\nMy friend Antony called, but when i picked up he did not speak, and the call got disconnected in a few seconds.\n\nThen i worked up to noon, then my maiden came and collected all my clothes.\nShe did not speak to me properly, and she told that it was a family problem so i did not ask deeper details from her.\n\nThen evening i went to the gym , my trainer ALI was there, also working out with his other friends Veronica, and Saru.\n\nI went to the medical shop, and bought some digestive tablets, as i had some stomach ache.\nThe person in the reception was a bit sad, but was working seriously.\n\nThen i came home, and slept`;

