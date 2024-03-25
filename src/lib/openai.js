import axios from "axios";

const key = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

const client = axios.create({
    headers: {
        "Authorization": `Bearer ${key}`,
        "Content-Type": "application/json"
    }
})

const chatgptUrl = 'https://api.openai.com/v1/chat/completions';

export const openaiApiCall = async (prompt, avatar)=>{
    try{
        const res = await client.post(chatgptUrl, {
            model: "gpt-4",
            messages: [
                {           //Add avatar as the person how writes the tweet
                    "role": 'system',
                    "content": `${avatar}`, 
                },{
                role: 'user',
                content: `${prompt}`
            }]
        });
        return Promise.resolve({success: true, data: res.data?.choices[0]?.message?.content});

    }catch(err){
        console.log('error: ',err);
        return Promise.resolve({success: false, msg: err.message});
    }
}