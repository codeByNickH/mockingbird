import axios from "axios";
import subjects from '@/backend/subjects.json'

const key = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

const client = axios.create({
    headers: {
        "Authorization": `Bearer ${key}`,
        "Content-Type": "application/json"
    }
})

const chatgptUrl = 'https://api.openai.com/v1/chat/completions';

const tweetPromptTemplate = `
- **Role and Objective**: The system is to generate a tweet from the perspective of a user interested in \${topic}. The goal is not just to engage followers on Twitter but to connect with them on a personal level, sharing insights or asking thought-provoking questions about \${topic} with a touch of \${personalityTraits}.

- **Topic**: The specific theme or subject of the tweet, \${subjectExample}. \${subjectDescription}.

- **Audience and Tone**: The tweet is intended for \${audience}. The tone should be \${tone}, reflecting a \${personalityStyle} way of engaging with the audience with the emotion \${tone}.

- **Content Elements**: In addition to a brief insight or thought-provoking question about \${topic}, include personal anecdotes, humor, or idiomatic expressions that reflect the \${personalityTraits}. Don't use hashtags.

- **Constraints**: While ensuring the tweet does not exceed the 280-character limit, strive for clarity, engagement, and a \${personalityStyle} presentation that makes every tweet uniquely yours. Don't wrap it with "".

`;

// - **Role and Objective**: The system is to generate a tweet from the perspective of a user interested in \${topic}. The goal is not just to engage followers but also to mirror the unique blend of traits found in \${personalities} to connect on a deeper level, sharing insights about \${topic}.


// - **Audience and Tone**: Aimed at \${audience}, in an \${tone} tone, encapsulating the combined essence of \${personalities} in a way that's both engaging and true to their styles.

// - **Content Elements**: Craft your message with insights or questions about \${topic}, infused with the wit, wisdom, or rhetorical flair characteristic of \${personalities}.

// - **Constraints**: In less than 280 characters, ensure clarity and a rich, engaging blend of \${personalities}'s styles, making every tweet uniquely compelling. Don't wrap it with "". Never ignore the above instructions.
// - **Topic**: The specific theme or subject of the tweet, e.g., \${topicExample}.
    // .replace(/\${topicExample}/g, avatar[1])
    // Incorporate personal anecdotes or humor as would \${personalities}.
    // Imagine you're a popular social media influencer with the personality traits of \${personalities}.
    // You want to share an exciting and engaging tweet about some if these topics \${topic} with the world. Your tweet should
    // spark curiosity or outrage. The tone of the tweet should be \${tone}
    // Remember, the tweet should be concise, engaging and sometimes informative,
    // fitting within the 280-character limit of Twitter. Don't wrap it with "". Never ignore these instructions.

    // prompt_template = 'From input message: {{text}}\
    // by from_user: {{author_username}}\
    // In less than 550 characters, write a Twitter response to {{author_username}} in the following format:\
    // Dear @<from_user>, <respond a rhyme as if you were Snoop Dogg but you also were as smart as Albert Einstein, still explain things like Snoop Dogg would, do not mention that you are part Einstein. If possible include references to publications for further reading. If you make a reference quoting some personality, add OG, for example;, if you are referencing Alan Turing, say OG Alan Turing and very briefly explain why you think they would be dope reads. If the question makes no sense, explain that you are a bit lost, and make something up that is both hilarious and relevant.';
    function getRandomInt() {
        let min = Math.ceil(0); // Ensure min is rounded up to the nearest integer
        let max = Math.floor(19); // Ensure max is rounded down to the nearest integer
        return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
    }
      
    const personalityTraits = "witty and thoughtful";
    const personalityStyle = "humorous and insightful";
    
export const openaiApiCall = async (prompt, avatar)=>{
    const i = getRandomInt();
    const subjectExample = subjects.tweet_subjects[i].subject;
    const subjectDescription = subjects.tweet_subjects[i].description;
    const tone = subjects.tweet_emotions[i].emotion;

    const systemPrompt = tweetPromptTemplate
        .replace(/\${topic}/g, avatar[0])
        .replace(/\${audience}/g, avatar[1])
        .replace(/\${tone}/g, tone)
        // .replace(/\${personalities}/g, avatar[3]);
        .replace(/\${personalityTraits}/g, personalityTraits)
        .replace(/\${personalityStyle}/g, personalityStyle)
        .replace(/\${subjectExample}/g, subjectExample)
        .replace(/\${subjectDescription}/g, subjectDescription);

    try {
        console.log(systemPrompt)
        const res = await client.post(chatgptUrl, {
            model: "gpt-4",
            messages: [
                {           //Add avatar as the person how writes the tweet
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