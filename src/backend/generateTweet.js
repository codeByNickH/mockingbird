const {openaiApiCall} = require("../lib/openai")
const {addTweet} = require('../backend/addTweet')


const generateTweet = async (message, avatar) => {
    return  new Promise( async(resolve, reject) => {
        if (message != null) {
            await openaiApiCall(message.trim(), avatar).then(res => {

                console.log('got api data ', res);

                if (res.success) {
                    resolve(res.data)
                } else {
                    console.log('Error', res.msg);
                }
            }, (error) => reject(error));
        }
    });
}

const GenerateRetweet = async (message, avatar) => {
    return  new Promise( async(resolve, reject) => {
        if (message != null) {
            await openaiApiCall(message.trim(), avatar).then(res => {

                console.log('got api data ', res);

                if (res.success) {
                    resolve(res.data)
                } else {
                    console.log('Error', res.msg);
                }
            }, (error) => reject(error));
        }
    });
}

module.exports = { generateTweet, GenerateRetweet };
