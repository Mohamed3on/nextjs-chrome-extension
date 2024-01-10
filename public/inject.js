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

const alternativeBearerToken =
  'AAAAAAAAAAAAAAAAAAAAAFQODgEAAAAAVHTp76lzh3rFzcHbmHVvQxYYpTw%3DckAlMINMjmCwxUcaXbAN4XqJVdgMJaHqNOFgPMK0zN1qLqLQCF';

const makeTwitterApiRequest = async (url, useAlternativeToken = false) => {
  const token = useAlternativeToken ? alternativeBearerToken : bearerToken;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 429 && !useAlternativeToken) {
      console.log('Rate limit exceeded with primary token, trying alternative token...');
      return makeTwitterApiRequest(url, true);
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }

  return response.json();
};

const fetchUserLists = async (screen_name) => {
  const url = `https://api.twitter.com/1.1/lists/list.json?screen_name=${screen_name}`;
  return makeTwitterApiRequest(url);
};

const fetchListMembers = async (listID) => {
  const url = `https://api.twitter.com/1.1/lists/members.json?list_id=${listID}&count=5000`;
  return makeTwitterApiRequest(url);
};

const fetchFollowingList = async (screen_name) => {
  let allFriends = [];
  let cursor = -1;

  do {
    const url = `https://api.twitter.com/1.1/friends/list.json?screen_name=${screen_name}&count=200&cursor=${cursor}`;
    const data = await makeTwitterApiRequest(url);

    allFriends = allFriends.concat(data.users);
    cursor = data.next_cursor;
  } while (cursor !== 0);

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
    const screen_name = await readLocalStorage('twitterHandle');

    if (!screen_name) {
      throw new Error('No twitter handle was provided');
    }

    const getPopularFriendsLocations = async () => {
      console.log('fetching following list...');
      let friendsList = [];
      try {
        friendsList = await fetchFollowingList(screen_name);
        userData.friends = friendsList.map(processUser);
      } catch (error) {
        console.log('error fetching friends:', error);
      }

      let userLists = [];
      try {
        userLists = await fetchUserLists(screen_name);

        const userListData = await userLists.map(async (list) => {
          const listMemebers = await fetchListMembers(list.id_str);

          return {
            name: list.name,
            id: list.id_str,
            follower_count: list.subscriber_count,
            member_count: list.member_count,
            creator: list.user.screen_name,
            avatar: list.user.profile_image_url_https.replace('_normal', ''),
            url: `https://twitter.com/i/lists/${list.id_str}`,
            users: listMemebers.users.map(processUser),
          };
        });

        userData.userListData = await Promise.all(userListData);

        console.log('🚀 ~ getPopularFriendsLocations ~ lists:', userListData);
      } catch (error) {
        console.log('error fetching lists:', error);
      }

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
