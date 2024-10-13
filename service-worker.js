// Listen for the sync event
// self.addEventListener('sync', function(event) {
//   if (event.tag === 'mySyncTag') {
//     event.waitUntil(syncData());  // A function to handle syncing data
//   }
// });

// async function syncData() {
//   // Example: Send stored data to the server
//   return fetch('/sync', {
//     method: 'POST',
//     body: JSON.stringify({data: 'example data'}),
//     headers: {
//       'Content-Type': 'application/json'
//     }
//   })
//   .then(response => response.json())
//   .then(data => console.log('Data synced:', data))
//   .catch(err => console.error('Error syncing data:', err));
// }

const CACHE_NAME = 'my-pwa-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './images/icon-192x192.png',
  './images/icon-512x512.png'
];

// Install the service worker and cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Serve resources from the cache
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});



// Listen for Push events
self.addEventListener('push', function(event) {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Notification Title';
  const options = {
    body: data.body || 'Default body',
    icon: './images/icon-192x192.png',
    badge: './images/icon-512x512.png'
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Handle notification click event
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('https://yusuf0786.github.io/pwa')
  );
});
