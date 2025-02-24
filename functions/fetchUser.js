const { ref, onValue } = require('firebase/database');
const { database } = require('./firebase');

const fetchUserById = async (userId) => {
  return new Promise((resolve, reject) => {
    const userRef = ref(database,'users/' + userId);
    onValue(userRef, (snapshot) => {
      const user = snapshot.val();
      resolve(user);
    }, (error) => reject(error));
  });
}

const fetchUsers = async () => {
  return new Promise((resolve, reject) => {
    const userRef = ref(database,'users');
    onValue(userRef, (snapshot) => {
      const user = snapshot.val();
      resolve(user);
    }, (error) => reject(error));
  });
}
const fetchRandomUser = async () => {
  return new Promise((resolve, reject) => {
    const userRef = ref(database,'users');
    onValue(userRef, (snapshot) => {
      const users = snapshot.val();
      const nrOfUsers = users ? Object.keys(users).length : 0;
      if(nrOfUsers > 0){
        const userIds = Object.keys(users);
        const min = Math.ceil(0);
        const max = Math.floor(nrOfUsers - 1);
        const randomIndex = Math.floor(Math.random() * (max - min + 1)) + min;
        const randomUserId = userIds[randomIndex];
        const user = [randomUserId, users[randomUserId]]
        resolve(user)
      }
    }, (error) => reject(error));
  });
}
module.exports = {fetchRandomUser, fetchUserById, fetchUsers};