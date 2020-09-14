var CACHE = 'cache-update-and-refresh';

self.addEventListener('install', function(e) {
    e.waitUntil(
      caches.open('edt-store').then(function(cache) {
        return cache.addAll([
          '/',
          '/edt.html',
          '/edt.js',
          '/images/icon.png'
        ]);
      })
    );
   });
   
   self.addEventListener('fetch', function(e) {
     console.log(e.request.url);
     e.respondWith(
       caches.match(e.request).then(function(response) {
         return response || fetch(e.request);
       })
     );
   });

   function fromCache(request) {
    return caches.open(CACHE).then(function (cache) {
      return cache.match(request);
    });
  }
   
  function update(request) {
    return caches.open(CACHE).then(function (cache) {
      return fetch(request).then(function (response) {
        return cache.put(request, response.clone()).then(function () {
          return response;
        });
      });
    });
  }
  
   
  function refresh(response) {
    return self.clients.matchAll().then(function (clients) {
      clients.forEach(function (client) { 
        var message = {
          type: 'refresh',
          url: response.url,
 
          eTag: response.headers.get('ETag')
        };
   
        client.postMessage(JSON.stringify(message));
      });
    });
  }