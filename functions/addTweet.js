const { database } = require('./firebase');
const { ref, push, update } = require('firebase/database');

async function addTweet(userId, tweetContent) {
    const tweetsRef = ref(database, 'tweets');
    const newTweet = {
        content: tweetContent,
        createdAt: new Date().toISOString(),
        userId: userId,
        metadata: {
            answer_count: 0,
            favorite_count: 0,
            retweet_count: 0
        }
    };
    push(tweetsRef, newTweet)
        .then(() => console.log('Tweet added successfully!'))
        .catch((error) => console.error('Error adding tweet: ', error));
}

async function addRetweet(ogTweet, tweetContent, userId) {
    const retweetRef = ref(database, 'retweets');
    const newRetweet = {
        content: tweetContent,
        createdAt: new Date().toISOString(),
        userId: userId,
        ogUserId: ogTweet[1].userId,
        ogContent: ogTweet[1].content,
        ogTweetId: ogTweet[0],
        metadata: {
            answer_count: 0,
            favorite_count: 0,
            retweet_count: 0
        }
    }
    push(retweetRef, newRetweet)
        .then(() => console.log('Retweet added succesfully!'))
        .catch((error) => console.error('Error adding Retweet: ', error));
    if (ogTweet[1].ogContent) {
        const retweetsRef = ref(database, 'retweets/' + ogTweet[0] + '/metadata/');
        const retweetCount = { retweet_count: ogTweet[1].metadata.retweet_count + 1 };
        update(retweetsRef, retweetCount)
            .then(() => console.log('retweet_count updated successfully!'))
            .catch((error) => console.error('Error adding to retweet_count: ', error));
    } else {
        const tweetsRef = ref(database, 'tweets/' + ogTweet[0] + '/metadata/');
        const newTweet = { retweet_count: ogTweet[1].metadata.retweet_count + 1 };
        update(tweetsRef, newTweet)
            .then(() => console.log('Retweet added successfully!'))
            .catch((error) => console.error('Error adding Retweet: ', error));
    }
}

async function addLike(tweet) {
    console.log(tweet)
    if (tweet[1].ogContent) {
        const retweetRef = ref(database, 'retweets/' + tweet[0] + '/metadata/');
        const favoriteCount = { favorite_count: tweet[1].metadata.favorite_count + 1 };
        update(retweetRef, favoriteCount)
            .then(() => console.log('Liked retweet successfully!'))
            .catch((error) => console.error('Error adding to favorite_count: ', error));
    } else {
        const tweetRef = ref(database, 'tweets/' + tweet[0] + '/metadata/');
        const favoriteCount = { favorite_count: tweet[1].metadata.favorite_count + 1 };
        update(tweetRef, favoriteCount)
            .then(() => console.log('Liked tweet successfully!'))
            .catch((error) => console.error('Error adding to favorite_count: ', error));
    }
}

async function addTweetAnswer(ogTweet, answerContent, userId) {
    const answerRef = ref(database, 'answers');
    const newAnswer = {
        content: answerContent,
        createdAt: new Date().toISOString(),
        userId: userId,
        ogTweetId: ogTweet[0],
        ogUserId: ogTweet[1].userId,
        metadata: {
            answer_count: 0,
            favorite_count: 0,
            retweet_count: 0
        }
    };
    push(answerRef, newAnswer)
        .then(() => console.log('Answer added successfully!'))
        .catch((error) => console.error('Error adding answer: ', error));
    if (ogTweet[1].ogContent) {
        const tweetsRef = ref(database, 'retweets/' + ogTweet[0] + '/metadata/');
        const answerCount = { answer_count: ogTweet[1].metadata.answer_count + 1 };
        update(tweetsRef, answerCount)
            .then(() => console.log('answer_count updated successfully!'))
            .catch((error) => console.error('Error adding to answer_count: ', error));
    } else {
        const tweetsRef = ref(database, 'tweets/' + ogTweet[0] + '/metadata/');
        const answerCount = { answer_count: ogTweet[1].metadata.answer_count + 1 };
        update(tweetsRef, answerCount)
            .then(() => console.log('answer_count updated successfully!'))
            .catch((error) => console.error('Error adding to answer_count: ', error));
    }
}

module.exports = {addRetweet, addTweet, addLike, addTweetAnswer};
