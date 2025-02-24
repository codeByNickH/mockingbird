const axios = require("axios");
const subjects = require('../backend/subjects.json')

const key = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

const client = axios.create({
    headers: {
        "Authorization": `Bearer ${key}`,
        "Content-Type": "application/json"
    }
})

const chatgptUrl = 'https://api.openai.com/v1/chat/completions';

const tweetPromptTemplate = `
- **Role and Objective**: The system is to generate a \${action} from the perspective of a user interested in \${topic}. Write with greater burstiness and perplexity.

- **Topic**: The specific theme or subject of the tweet, \${subject}. \${subjectDescription}.

- **Audience and Tone**: The tweet is intended for \${audience}. The tone should be \${tone}, reflecting a \${personalityStyle} way of engaging with the audience with the emotion \${tone}.

- **Content Elements**: In addition to a brief insight or thought-provoking question about \${topic}, include personal anecdotes, humor, or idiomatic expressions that reflect the personality traits \${personalityTraits}. Don't use hashtags. Don't mention the personality traits.

- **Constraints**: The tweet can be in different lenghts While ensuring the tweet does not exceed the 280-character limit, strive for clarity, engagement, and a \${personalityStyle} presentation that makes every tweet uniquely yours. Don't wrap it with "".

`;

function getRandomInt() {
    let min = Math.ceil(0);
    let max = Math.floor(19);
    return Math.floor(Math.random() * (max - min + 1)) + min; 
}
const openaiApiCall = async (prompt, avatar)=>{
    const i = getRandomInt();
    const subjectExample = subjects.tweet_subjects[i].subject;
    const subjectDescription = subjects.tweet_subjects[i].description;
    const tone = subjects.tweet_emotions[i].emotion;
    let personalityStyle; 
    if(i != 19){
        personalityStyle = subjects.tweet_emotions[i+1].emotion;
    }else{
        personalityStyle = subjects.tweet_emotions[i-1].emotion;
    }
    const audience = subjects.tweet_audience[i].audience;
    let action = "tweet";
    if(prompt.length > 5){
        action = "retweet"
    }

    const systemPrompt = tweetPromptTemplate
        .replace(/\${action}/g, action)
        .replace(/\${topic}/g, avatar[0])
        .replace(/\${audience}/g, audience)
        .replace(/\${tone}/g, tone)
        .replace(/\${personalityTraits}/g, avatar[1])
        .replace(/\${personalityStyle}/g, personalityStyle)
        .replace(/\${subject}/g, subjectExample)
        .replace(/\${subjectDescription}/g, subjectDescription);

    try {
        console.log(systemPrompt)
        const res = await client.post(chatgptUrl, {
            model: "gpt-4",
            messages: [
                {
                    "role": 'system',
                    "content": `${systemPrompt}`, 
                },{
                role: 'user',
                content: `${prompt}`
            }]
        });
        return Promise.resolve({success: true, data: res.data?.choices[0]?.message?.content});

    }catch(err) {
        console.log('error: ',err);
        return Promise.resolve({success: false, msg: err.message});
    }
}

module.exports = { openaiApiCall };