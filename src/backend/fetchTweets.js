import { ref, onValue, orderByChild, query } from 'firebase/database';
import { database } from "@/lib/firebase"

export async function fetchTweetsAndUserData() {
    return new Promise((resolve, reject) => {
        const tweetsRef = query(ref(database, 'tweets'), orderByChild('createdAt'));
        
        onValue(tweetsRef, (snapshot) => {
            const tweets = snapshot.val();
      
            const usersRef = ref(database, 'users');
            onValue(usersRef, (snapshot) => {
                const users = snapshot.val();

                const combinedData = Object.keys(tweets).map((key) => {
                    const tweet = tweets[key];
                    const user = users[tweet.userId];
                    return {
                    ...tweet,
                    user
                    };
                });
                resolve(combinedData.reverse())
                // const array = combinedData.reverse()
                console.log(combinedData);
        
            }, (error) => reject(error));
        }, (error) => reject(error));
    });
};


