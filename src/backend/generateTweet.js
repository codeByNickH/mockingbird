import {openaiApiCall} from "@/lib/openai"



export const GenerateTweet = async (message, avatar) => {
    if (message != null) {

        await openaiApiCall(message.trim(), avatar).then(res => {
            console.log('got api data ', res);

            if (res.success) {
                console.log(res.data[0])

            } else {
            alert('Error', res.msg);
            }
        });
    }
}