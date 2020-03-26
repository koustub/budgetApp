
const cacheName = "v1";

self.addEventListener("install", function (evt) {
    evt.waitUntil(
        console.log('[Service Worker : Installed]')
    );
});

self.addEventListener("activate", function (evt) {
    evt.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if(cache != cacheName){
                        console.log('[Service Worker Clearing Old Caches]');
                        return caches.delete(cache);
                    }
                })
            )
        })
    );
});

self.addEventListener('fetch', e => {
    console.log('[Service Working => Fetching]');
    e.respondWith(
        fetch(e.request)
            .then(res => {
                //make copy clone of response
                const resClone = res.clone();
                caches
                    .open(cacheName)
                    .then(cache => {
                        cache.put(e.request, resClone);
                    });
                return res
            }).catch(err => caches.match(e.request).then(res => res))
    );

});