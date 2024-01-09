const userData = {};

const readLocalStorage = async (key) => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get([key], function (result) {
      if (result[key] === undefined) {
        reject(new Error('Key not found: ' + key));
      } else {
        resolve(result[key]);
      }
    });
  });
};

const bearerToken =
  'AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA';

const fetchListMembers = async (listID) => {
  const url = `https://api.twitter.com/1.1/lists/members.json?list_id=${listID}&count=5000`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${bearerToken}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return await response.json();
};

const fetchFollowingList = async (screen_name) => {
  let allFriends = [];
  let cursor = -1; // Twitter API uses -1 to start

  do {
    const url = `https://api.twitter.com/1.1/friends/list.json?screen_name=${screen_name}&count=200&cursor=${cursor}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('HTTP error! status: ', response.status);
      if (response.status === 429) {
        console.log('Rate limit exceeded, waiting 15 minutes...');
        await new Promise((resolve) => setTimeout(resolve, 15 * 60 * 1000));
      }
    }

    const data = await response.json();
    allFriends = allFriends.concat(data.users);
    cursor = data.next_cursor; // Update the cursor for the next iteration
  } while (cursor !== 0); // The API returns 0 when there are no more pages

  return allFriends;
};

// const fetchFollowersList = async (screen_name) => {
//   let allFollowers = [];
//   let cursor = -1; // Twitter API uses -1 to start

//   do {
//     const url = `https://api.twitter.com/1.1/followers/list.json?screen_name=${screen_name}&count=200&cursor=${cursor}`;
//     const response = await fetch(url, {
//       method: 'GET',
//       headers: {
//         Authorization: `Bearer ${bearerToken}`,
//         'Content-Type': 'application/json',
//       },
//     });

//     if (!response.ok) {
//       console.error('HTTP error! status: ', response.status);
//       return allFollowers;
//     }

//     const data = await response.json();
//     allFollowers = allFollowers.concat(data.users);

//     cursor = data.next_cursor; // Update the cursor for the next iteration
//   } while (cursor !== 0); // The API returns 0 when there are no more pages

//   return allFollowers;
// };

const processLocation = (location) => {
  const processedLocations = location
    .toLowerCase()
    .split(/\s*[,\/\\&\+|·]+\s*|and\s+/)
    .map((l) => l.trim())
    .filter((l) => l);

  return processedLocations;
};

const addLocations = (theList) => {
  const locations = {};
  theList.forEach((member) => {
    if (member.location) {
      const processedLocations = processLocation(member.location);

      processedLocations &&
        processedLocations.forEach((location) => {
          if (locations[location]) {
            locations[location] += 1;
          } else {
            locations[location] = 1;
          }
        });
    }
  });
  return locations;
};

const getListIDs = async () => {
  let listIDs;
  try {
    listIDs = await readLocalStorage('listIDs');
    return listIDs;
  } catch (error) {
    console.log('No list IDs were provided, skipping list data', error);
    return [];
  }
};

const processUser = (user) => {
  return {
    name: user.name,
    screen_name: user.screen_name,
    avatar: user.profile_image_url_https.replace('_normal', ''),
    followers: user.followers_count,
    location: user.location,
  };
};

(async () => {
  try {
    let listIDs = await getListIDs();

    const screen_name = await readLocalStorage('twitterHandle');

    if (!screen_name) {
      throw new Error('No twitter handle was provided');
    }
    if (listIDs) {
      let locationsPerList = {};
      const usersPerList = {};
      for (const listID of listIDs) {
        console.log(`Fetching ${listID} list members...`);
        const listMembers = await fetchListMembers(listID);
        console.log(`length of ${listID} list members:`, listMembers.users.length);
        locationsPerList[listID] = addLocations(listMembers.users);
        usersPerList[listID] = listMembers.users.map(processUser);
      }

      userData.lists = usersPerList;
    }

    const getPopularFriendsLocations = async () => {
      console.log('fetching following list...');
      let friendsList = [];
      try {
        friendsList = await fetchFollowingList(screen_name);
      } catch (error) {
        console.log('error fetching friends:', error);
      }

      userData.friends = friendsList.map(processUser);

      chrome.storage.local.set(
        {
          userData,
        },
        function () {
          console.log('Location data is saved in local storage.');
        }
      );
    };

    await getPopularFriendsLocations();
  } catch (error) {
    console.error('Error fetching data:', error);
  }
})();
