const webpush = require('web-push');

// VAPID keys should be generated only once
const vapidKeys = {
  publicKey: 'BMiUxKsLKyJJqoF-hubIjtDOUc2kFo_v-Lap9QpRmyD4axHUu_2dXMQbVSICVSvyMyk3eGtW4_ubBVby3_fCkho',
  privateKey: 'E6bsKM9-r2Rdok3p3CMm_pEimNCtcjpfzuq2kNYTX54'
};

webpush.setVapidDetails(
  'mailto:yans04786@gmail.com',  // Update this email
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

// Replace with the subscription object you receive from the client
const pushSubscription = {
  endpoint: 'USER_SUBSCRIPTION_ENDPOINT',
  keys: {
    auth: 'USER_AUTH_KEY',
    p256dh: 'USER_P256DH_KEY'
  }
};

const payload = JSON.stringify({
  title: 'Test Notification',
  body: 'This is a test message sent from the server.'
});

webpush.sendNotification(pushSubscription, payload)
  .then(response => {
    console.log('Push sent successfully:', response);
  })
  .catch(err => {
    console.error('Error sending push notification:', err);
  });
