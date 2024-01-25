chrome.runtime.onMessage.addListener(({ message }, sender, sendResponse) => {
  if (message === 'refresh') {
    console.log('refreshing data...');
    run()
      .then(() => {
        console.log('done!!!');
        sendResponse({ message: 'done', type: 'success' });
      })
      .catch((error) => {
        console.log('error, user probably private or does not exist', error);
        sendResponse({
          message: 'user probably private or does not exist',
          error: error.message,
          type: 'error',
        });
      });
    return true; // Keep the message channel open for the response
  }
});

const readLocalStorage = async (key) => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get([key], function (result) {
      if (result[key] === undefined) {
        resolve(null);
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

const run = async () => {
  try {
    const screen_name = await readLocalStorage('twitterHandle');
    const getPopularFriendsLocations = async () => {
      let userData = {};

      // TODO: cache data per user?
      // try {
      //   const cachedData = await readLocalStorage('userData');

      //   if (cachedData) {
      //     console.log('using cached data...');
      //     userData = cachedData;
      //   }
      // } catch (error) {
      //   userData = {};
      // }

      console.log('fetching following list...');
      let friendsList = await fetchFollowingList(screen_name);
      userData.friends = friendsList.map(processUser);

      let userLists = [];

      chrome.storage.local.set(
        {
          userData,
        },
        function () {
          console.log('Friend data is saved in local storage.');
        }
      );

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

        console.log(`fetched ${userData.userListData.length} lists`);

        chrome.storage.local.set(
          {
            userData,
          },
          function () {
            console.log('List data is saved in local storage.');
          }
        );
      } catch (error) {
        console.log('error fetching lists:', error);
      }
    };

    await getPopularFriendsLocations();
  } catch (error) {
    console.log('Error fetching data:', error);
    throw error;
  }
};

(async () => {
  const screen_name = await readLocalStorage('twitterHandle');
  if (!screen_name) {
    console.log('No twitter handle was provided, aborting...');
    return;
  }

  const lastAutoRefreshObj = (await readLocalStorage('lastAutoRefresh')) || {};
  const lastAutoRefresh = lastAutoRefreshObj[screen_name];

  if (lastAutoRefresh) {
    const lastAutoRefreshDate = new Date(lastAutoRefresh);
    const today = new Date();
    const hourDiff = Math.abs(today - lastAutoRefreshDate) / 36e5;

    if (hourDiff < 24) {
      console.log(`Last auto refresh for ${screen_name} was less than 24 hours ago, aborting...`);
      return;
    }
  }

  await run()
    .then(() => {
      lastAutoRefreshObj[screen_name] = new Date().toISOString();
      chrome.storage.local.set(
        {
          lastAutoRefresh: lastAutoRefreshObj,
        },
        function () {
          console.log(`Auto-refresh time updated for ${screen_name} in local storage.`);
        }
      );
    })
    .catch((error) => {
      console.log('error, user probably private or does not exist', error);
    });
})();
