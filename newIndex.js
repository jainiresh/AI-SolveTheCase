// import nylas from "./service/nylasService.js";
// import fs from 'fs'

// let contacts = [];
// async function func() {

// let next_cursor = '';
//     while (true) {
//       console.log('iteration');
//       const response = await nylas.messages.list({
//         identifier: '9afa03cc-2be3-4a78-815b-99811dff214d',
//         queryParams: {
//           limit: 200,
//           pageToken: next_cursor,
//         },
//       });

//      contacts = [...contacts, ...response.data]

//      console.log(contacts.length)
//       next_cursor = response.nextCursor;
//       if (!next_cursor || contacts.length == 4000) break;

//       fs.appendFileSync('data.json', JSON.stringify(contacts), (err) => {
//         if(err)
//             console.log('Error writing to a file', err)
//         else
//         console.log('File written')
//     })
//     }
//     console.log(contacts.length)
    
// }

// async function newFunc(){
//   let list = await nylas.grants.list();
//   console.log(list.data.length)
// }

// newFunc();
