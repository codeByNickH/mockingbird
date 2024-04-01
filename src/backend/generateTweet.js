import {openaiApiCall} from "@/lib/openai"
import {addTweet} from '@/backend/addTweet'


export const GenerateTweet = async (message, avatar, id) => {
    
    if (message != null) {
        await openaiApiCall(message.trim(), avatar).then(res => {
            console.log('got api data ', res);
            
            if (res.success) {
                console.log(res.data.trim())
                addTweet(id, res.data);
                
            } else {
                alert('Error', res.msg);
            }
        });
    }
}

