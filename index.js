window.addEventListener('load', () => {
  registerSW();
  syncButton()
});

//register the sw.js with the browser. In this step we will check if the browser allows us to use the PWA functionality. If not we will show error to the end user.
async function registerSW() {
  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('./sw.js');

    } catch (e) {
      console.log('SW registration failed');
    }
  }
}

async function syncButton() {
  try {
    await navigator.serviceWorker.ready.then(function (swRegistration) {
      return swRegistration.sync.register('myFirstSync');
    });
  } catch (e) {
    console.log('SW registration failed');
  }
}


