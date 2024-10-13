// navigator.serviceWorker.ready.then(function(registration) {
//   return registration.sync.register('mySyncTag');
// }).then(function() {
//   console.log('Background Sync registered');
// }).catch(function(err) {
//   console.log('Background Sync registration failed:', err);
// });

// When a form is submitted offline
// document.querySelector('form').addEventListener('submit', function(event) {
//   event.preventDefault();
//   const formData = new FormData(event.target);

//   // Store formData locally (for example, in localStorage)
//   localStorage.setItem('formData', JSON.stringify(Object.fromEntries(formData)));

//   // Register background sync
//   navigator.serviceWorker.ready.then(function(registration) {
//     return registration.sync.register('mySyncTag');
//   });
// });

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js')
        .then(registration => {
            console.log('Service Worker registered with scope:', registration.scope);
        }).catch(err => {
            console.log('Service Worker registration failed:', err);
        });
    });
}

let deferredPrompt;
const installBtn = document.getElementById('installBtn');
installBtn.style.display = 'none';

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.style.display = 'block';

  installBtn.addEventListener('click', () => {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(choiceResult => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the installation');
      } else {
        console.log('User dismissed the installation');
      }
      deferredPrompt = null;
    });
  });
});



// Function to request notification permission
async function askPermission() {
  return new Promise((resolve, reject) => {
    const permissionResult = Notification.requestPermission(result => {
      resolve(result);
    });

    if (permissionResult) {
      permissionResult.then(resolve, reject);
    }
  }).then(permissionResult => {
    if (permissionResult !== 'granted') {
      throw new Error('Permission not granted for notifications');
    }
  });
}

// Function to subscribe the user to push notifications
function subscribeUserToPush() {
  navigator.serviceWorker.ready.then(function(registration) {
    const subscribeOptions = {
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array('BMiUxKsLKyJJqoF-hubIjtDOUc2kFo_v-Lap9QpRmyD4axHUu_2dXMQbVSICVSvyMyk3eGtW4_ubBVby3_fCkho')  // Replace with your VAPID public key
    };

    return registration.pushManager.subscribe(subscribeOptions);
  })
  .then(function(pushSubscription) {
    console.log('Received PushSubscription:', JSON.stringify(pushSubscription));

    // You need to send this subscription object to your server to store
    sendSubscriptionToServer(pushSubscription);
  });
}

// Convert VAPID key from base64
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

// Call the functions
askPermission().then(() => {
  subscribeUserToPush();
});
