const {openaiApiCall} = require("./openai")


const generateTweet = async (message, avatar) => {
    if (message != null) {
        return openaiApiCall(message.trim(), avatar).then(res => {

           console.log('got api data ', res);

           if (res.success) {
               return res.data
           } else {
               console.log('Error', res.msg);
           }
       });
   }
    // return new Promise((resolve, reject) => {
        
    // });
}

// const GenerateRetweet = async (message, avatar) => {
//     return  new Promise( async(resolve, reject) => {
//         if (message != null) {
//             await openaiApiCall(message.trim(), avatar).then(res => {
//                 console.log('got api data ', res);
//                 if (res.success) {
//                     resolve(res.data)
//                 } else {
//                     console.log('Error', res.msg);
//                 }
//             }, (error) => reject(error));
//         }
//     });
// }

module.exports = { generateTweet };
