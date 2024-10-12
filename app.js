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
