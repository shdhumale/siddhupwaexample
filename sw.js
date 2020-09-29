//Define the cache name. By this name of the cache data is fetch when no internet is there.
const cacheName = 'siddhucache.1.0';
//This is the array that define the files that need to be cache
const staticAssets = [
    './',
    './index.html',
    './styles.css',
    './image/siddhu.jpg'
];

//Install :- In this step we will check if the browser allows us to use the PWA functionality. If not we will show error to the end user.
self.addEventListener('install', async e => {
    const cache = await caches.open(cacheName);
    await cache.addAll(staticAssets);
    //below line of code will tell start working as soon as request is made. 
    return self.skipWaiting();
});
//Activate :- In this step we will delete all the old cache and refill it with the new data that we get from the internet.
self.addEventListener('activate', e => {
    //below line of code will tell old cache will be deleted and new will be created for new service worker.
    self.clients.claim();
});
//Fetch:- Here we do following things
//Step A:- Frist check if the internet is online. If online then we will make a call to server using internet and cache the new data.
//Step B:- If no internet then show the result from the cache to the end users.
self.addEventListener('fetch', async e => {
    const req = e.request;
    const url = new URL(req.url);

    if (url.origin === location.origin) {
        //below line indicate if the requested url is same and no internet then fetch the date from the cache
        e.respondWith(displayFirstCache(req));
    } else {
        //below line indicate else make a call to the internet and fetch the new data.
        e.respondWith(callNetworkFirstAndThenDoCache(req));
    }
});

//This fuction will be used to take the data from the cache defined in cacheName
async function displayFirstCache(req) {
    //Opening the cachee
    const cache = await caches.open(cacheName);
    //Matching the request
    const cached = await cache.match(req);
    //if same then return the cached else call the internet using fetch method.
    return cached || fetch(req);
}

//This fuction will be used to take the data from the internet and fill the new values in the cache defined in cacheName
async function callNetworkFirstAndThenDoCache(req) {
    const cache = await caches.open(cacheName);
    try {
        //calling internet and taking new data.
        const fresh = await fetch(req);
        //deleting the old cahce and pusing the new data.
        await cache.put(req, fresh.clone());
        return fresh;
    } catch (e) {
        //if no internet then use the old data.
        const cached = await cache.match(req);
        return cached;
    }
}

//this method is used to show the push notification to the user even though they are offline.
self.addEventListener('push', function (event) {
    console.log('[Service Worker] Push Received.');
    console.log('[Service Worker] Push had this data: "${event.data.text()}"');

    const title = 'Siddhu Push Notication comes';
    const options = {
        body: 'Push notification comes. This time it is from Chorme browser',
        icon: 'image/icon-192x192.png',
        badge: 'image/icon-512x512.png'
    };

    self.registration.showNotification(title, options);
});

//This method is used for having sync call between device and server. If the user fill the data on form and internet goes off and when
//the user again comes online at that time this sync is called. There is sync periodic Sync that run at definite interval of time.
self.addEventListener('sync', function (event) {
    if (event.tag == 'myFirstSync') {
        event.waitUntil(doSomeStuff());
    }
});
//Do the things which we want once the sync is on
async function doSomeStuff() {
    console.log("reached here")
}


