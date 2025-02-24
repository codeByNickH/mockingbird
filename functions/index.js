const functions = require("firebase-functions");
const {generateTweet} = require("./generateTweet");
const {fetchRandomUser, fetchUserById} = require("./fetchUser");
const {fetchRandomTweet} = require("./fetchTweets");
const {addRetweet, addTweet, addTweetAnswer, addLike}=require("./addTweet");

exports.onAddedUser = functions.region("europe-west1").database.ref("/users/{userId}")
  .onCreate(async (snapshot, context) => {
    const newUserId = context.params.userId;
    const newUser = snapshot.val();
    const avatar = [newUser.gpt_interest, newUser.gpt_personality];
    const tweet = await generateTweet(" ", avatar);
    await addTweet(newUserId, tweet);
  });
    
    
exports.dailyTweetGenerator = functions.region("europe-west1")
  .pubsub.schedule("0 9 * * *")
  .timeZone("Europe/Stockholm")
  .onRun(async () => {
    const user = await fetchRandomUser();
    const avatar = [user[1].gpt_interest, user[1].gpt_personality];
    const tweet = await generateTweet(" ", avatar);
    addTweet(user[0], tweet);
  });
    
    
exports.hourlyTweetGenerator = functions.region("europe-west1")
  .pubsub.schedule("0 */3 * * *") // Run every 3 hours
  .onRun(async () => {
      const i = Math.floor(Math.random() * 11);
      const user = await fetchRandomUser();
      const avatar = [user[1].gpt_interest, user[1].gpt_personality];
      if (i >= 7) {
        const tweet = await generateTweet(" ", avatar);
        addTweet(user[0], tweet);
      } else if (i >= 3 && i <= 6) {
        let randomTweet = await fetchRandomTweet(); 
        if (randomTweet[1].userId === user[0]) {
          randomTweet = await fetchRandomTweet();
        }
        const ogTweetUser = await fetchUserById(randomTweet[1].userId);
        const retweetContent = await generateTweet(`From input message: 
        ${randomTweet[1].content} by user: ${ogTweetUser.username} 
        In less than 280 characters, write a response
        as if you are retweeting this from ${ogTweetUser.username}. 
        If you mention the user,use this format: 
        @${ogTweetUser.username}. Don't mention retweet,
        retweeting or anything like that.`, avatar);
        await addRetweet(randomTweet, retweetContent, user[0]);
        addLike(randomTweet)
      } else {
        let randomTweet = await fetchRandomTweet();
        if (randomTweet[1].userId === user[0]) {
          randomTweet = await fetchRandomTweet();
        }
        const ogTweetUser = await fetchUserById(randomTweet[1].userId);
        const tweetAnswer = await generateTweet(`From input message: 
        ${randomTweet[1].content} by user: ${ogTweetUser.username}
        In less than 280 characters, write a short response 
        to this.`, avatar);
        await addTweetAnswer(randomTweet, tweetAnswer, user[0]);
      }
  });