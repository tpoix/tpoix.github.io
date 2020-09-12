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
