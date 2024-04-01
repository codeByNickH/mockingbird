import { database } from '@/lib/firebase';
import { ref, push } from 'firebase/database';

export function addTweet(userId, tweetContent) {
    const tweetsRef = ref(database, 'tweets');

    const newTweet = {
        content: tweetContent,
        createdAt: new Date().toISOString(),
        userId: userId,
        metadata: {
            favorite_count: 0,
            retweet_count: 0
        }
    };

    push(tweetsRef, newTweet)
        .then(() => console.log('Tweet added successfully!'))
        .catch((error) => console.error('Error adding tweet: ', error));
}
