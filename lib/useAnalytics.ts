function getClientId() {
  let clientId = localStorage.getItem('gaClientId');
  if (!clientId) {
    clientId = 'uuid-' + Date.now() + '-' + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('gaClientId', clientId);
  }
  return clientId;
}

const mixpanelToken = 'f8369ca1a3ed0d94906903132d6d5552';

export const trackEvent = async (eventName, properties = {}) => {
  const eventData = {
    event: eventName,
    properties: {
      token: mixpanelToken,
      distinct_id: getClientId(),
      ...properties,
    },
  };

  const base64EventData = btoa(JSON.stringify(eventData));

  await fetch(`https://api.mixpanel.com/track/?data=${base64EventData}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded', // Mixpanel's expected content type for this endpoint
    },
  });
};
