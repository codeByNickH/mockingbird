const { database } = require('@/lib/firebase');
const { ref, push } = require('firebase/database');

export function addUser(newChar) {
    const userRef = ref(database, 'users');
    const newUser = {
        avatar: newChar[0],
        full_name: newChar[1],
        username: newChar[2],
        gpt_personality: newChar[3],
        gpt_interest: newChar[4],
        profile_details: {
            bio: newChar[5],
            joined: new Date().toISOString(),
            location: 'Earth'
        }
    };

    push(userRef, newUser)
        .then(() => console.log('User added successfully!'))
        .catch((error) => console.error('Error adding user: ', error));
}