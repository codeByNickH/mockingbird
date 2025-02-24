const { ref, onValue, where, orderByChild, query, limitToLast } = require('firebase/database');
const { database } = require("../lib/firebase");
const { orderByValue } = require("firebase/database");
const { fetchUsers } = require("./fetchUser");

async function fetchTweetsAndUserData() {
    return new Promise(async (resolve, reject) => {
        let theseTweets;
        let theseRetweets;
        const tweetsRef = ref(database, 'tweets');
        onValue(tweetsRef, async (snapshot) => {
            const tweets = await snapshot.val();

            if (tweets != null) {
                const usersRef = ref(database, 'users');
                onValue(usersRef, async (snapshot) => {
                    const users = await snapshot.val();

                    const retweetsRef = ref(database, 'retweets');
                    onValue(retweetsRef, async (snapshot) => {
                        const retweets = await snapshot.val();

                        const tweet = Object.keys(tweets).map((key) => {
                            const tweetData = tweets[key];
                            const user = users[tweetData.userId];
                            const Id = key;

                            const retweet = Object.keys(retweets).map((rtkey) => {
                                const retweetData = retweets[rtkey];
                                const ogTweet = tweets[retweetData?.ogTweetId];
                                const ogUser = users[retweetData?.ogUserId];
                                const user = users[retweetData?.userId];
                                const Id = rtkey;
                                return {
                                    ...retweetData,
                                    ogTweet,
                                    ogUser,
                                    user,
                                    Id
                                }
                            })
                            theseRetweets = retweet
                            return {
                                ...tweetData,
                                user,
                                Id
                            };
                        })
                        theseTweets = tweet
                        const merged = [...theseTweets, ...theseRetweets]
                        merged.sort((a, b) => a.createdAt.localeCompare(b.createdAt)).reverse()
                        resolve(merged)
                    })
                }, (error) => reject(error));
            }
        }, (error) => reject(error));
    }, (error) => reject(error));
};


const fetchRandomTweet = async () => { // Add random nr to make if less then.. take from retweets.
    return new Promise(async (resolve, reject) => {
        const tweetsRef = query(ref(database, 'tweets'), limitToLast(10))

        onValue(tweetsRef, (snapshot) => {
            const tweets = snapshot.val()
            const nrOfTweets = tweets ? Object.keys(tweets).length : 0;

            if (nrOfTweets > 0) {
                const tweetIds = Object.keys(tweets);
                const min = Math.ceil(0);
                const max = Math.floor(nrOfTweets - 1);
                const randomIndex = Math.floor(Math.random() * (max - min + 1)) + min;
                const randomTweetId = tweetIds[randomIndex];
                const tweet = [randomTweetId, tweets[randomTweetId]];

                resolve(tweet)
            }

        }, (error) => reject(error));
    });
}

const fetchTweetById = async (tweetId) => {
    return new Promise(async (resolve, reject) => {
        const tweetsRef = ref(database, 'tweets/' + tweetId)
        let tweet;
        onValue(tweetsRef, (snapshot) => {
            tweet = snapshot.val()

            if (tweet == null) {
                const retweetsRef = ref(database, 'retweets/' + tweetId)

                onValue(retweetsRef, (snapshot) => {
                    tweet = snapshot.val()

                }, (error) => reject(error));
            }

            const returnTweet = [tweetId, tweet]

            resolve(returnTweet)
        }, (error) => reject(error));
    });
}

const fetchTweetAndAnswerById = async (tweetId) => {  // Needs a rebuild, gets alot of unnecessary data.
    return new Promise(async (resolve, reject) => {
        const tweetRef = ref(database, 'tweets/' + tweetId)
        let ogUser;
        let tweet;
        onValue(tweetRef, async (snapshot) => {
            tweet = await snapshot.val()

            if (tweet == null) {
                const retweetRef = ref(database, 'retweets/' + tweetId)
                onValue(retweetRef, async (snapshot) => {
                    tweet = await snapshot.val()

                    const ogUsersRef = ref(database, 'users/' + tweet.ogUserId);
                    onValue(ogUsersRef, async (snapshot) => {
                        ogUser = await snapshot.val()

                        const usersRef = ref(database, 'users/' + tweet?.userId);
                        onValue(usersRef, async (snapshot) => {
                            const user = await snapshot.val();
                            const tweetWithId = { tweetId, ...tweet }

                            if (tweet?.metadata?.answer_count > 0) {
                                const users = await fetchUsers();
                                const answerRef = query(ref(database, 'answers'))
                                onValue(answerRef, async (snapshot) => {
                                    const answers = await snapshot.val()

                                    const answer = Object.keys(answers).map((key) => {
                                        const answerData = answers[key]
                                        const perTweetId = answerData?.ogTweetId == tweetId // Need to remove all that are false
                                        const answerUser = users[answerData?.userId]
                                        return {
                                            ...answerData,
                                            perTweetId,
                                            answerUser
                                        }
                                    })
                                    answer.reverse()
                                    const merged = [{ ...tweetWithId, ...user, answer, ogUser }]
                                    resolve(merged)
                                })
                            } else {

                                const merged = [{ ...tweetWithId, ...user, ogUser }]
                                resolve(merged)
                            }
                        }, (error) => reject(error))
                    }, (error) => reject(error))
                }, (error) => reject(error))
            } else {
                const usersRef = ref(database, 'users/' + tweet?.userId);
                onValue(usersRef, async (snapshot) => {
                    const user = await snapshot.val();
                    const tweetWithId = { tweetId, ...tweet }
                    if (tweet?.metadata?.answer_count > 0) {
                        const users = await fetchUsers();
                        const answerRef = query(ref(database, 'answers'))
                        onValue(answerRef, async (snapshot) => {
                            const answers = await snapshot.val()

                            const answer = Object.keys(answers).map((key) => {
                                const answerData = answers[key]
                                const perTweetId = answerData?.ogTweetId == tweetId // Need to remove all that are false
                                const answerUser = users[answerData?.userId]
                                return {
                                    ...answerData,
                                    perTweetId,
                                    answerUser
                                }
                            })
                            answer.reverse()
                            const merged = [{ ...tweetWithId, ...user, answer }]
                            resolve(merged)
                        }, (error) => reject(error))
                    } else {

                        const merged = [{ ...tweetWithId, ...user }]
                        resolve(merged)
                    }
                }, (error) => reject(error))
            }
        }, (error) => reject(error))
    });
};

module.exports = { fetchRandomTweet, fetchTweetsAndUserData, fetchTweetAndAnswerById, fetchTweetById };


