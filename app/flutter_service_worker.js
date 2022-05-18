'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "3a34a8f7e57a0d8ff0671a77073dc3ce",
"assets/assets/graphics/raster/icon.png": "9aefb81edc05500f8cfb561f1e2f63dd",
"assets/assets/graphics/raster/onboarding_images/onboarding_first_image.png": "dae8789889a4aeb32992531bcbbe5146",
"assets/assets/graphics/raster/onboarding_images/onboarding_second_image.png": "f7a58a3e18e971f2a8a89e1272d4b911",
"assets/assets/graphics/raster/onboarding_images/onboarding_third_image.png": "572f4dce1554a3fa71a7d9c6dc82e180",
"assets/assets/graphics/raster/splash.png": "c9080f2889690f4a2f35dde58670ed40",
"assets/assets/graphics/vector/icons/arrow_right.svg": "05a94ece6959035095bc75d2de4c081b",
"assets/assets/graphics/vector/icons/face_id.svg": "77c386577f812a1557cef77fd3431ddf",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/fonts/MaterialIcons-Regular.otf": "95db9098c58fd6db106f1116bae85a0b",
"assets/NOTICES": "3bb9a144d9f1b7d4a4e577ca08719089",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"canvaskit/canvaskit.js": "c2b4e5f3d7a3d82aed024e7249a78487",
"canvaskit/canvaskit.wasm": "4b83d89d9fecbea8ca46f2f760c5a9ba",
"canvaskit/profiling/canvaskit.js": "ae2949af4efc61d28a4a80fffa1db900",
"canvaskit/profiling/canvaskit.wasm": "95e736ab31147d1b2c7b25f11d4c32cd",
"favicon.png": "18615ae49887d340aaf51ae244126408",
"flutter.js": "0816e65a103ba8ba51b174eeeeb2cb67",
"icons/android-icon-144x144.png": "38223dd663513aa649fbdcdd6988f69d",
"icons/android-icon-192x192.png": "678854c172499bef5e25b3a7890635e5",
"icons/android-icon-36x36.png": "f39b86a8745d3086410a871136c1e2aa",
"icons/android-icon-48x48.png": "34d35446a29692f86b31ad64ac613823",
"icons/android-icon-72x72.png": "e8e2fab08e7d6efbccd1aa9152c5f2aa",
"icons/android-icon-96x96.png": "2dd6e3e79aced8f0b836f335d1b39446",
"icons/apple-icon-114x114.png": "a7b2a63c2d110307afce8792acc865e3",
"icons/apple-icon-120x120.png": "4818152b80a6e6620e643325d6029b61",
"icons/apple-icon-144x144.png": "128a138c30da200132afe323a8a720e7",
"icons/apple-icon-152x152.png": "afb2f7ee315cf25a5d2e9c161975bd6e",
"icons/apple-icon-180x180.png": "b8b68d6a5acfe106dfec4e3e79387a2c",
"icons/apple-icon-57x57.png": "ae399d7c01b0d50c97d3f5938663350d",
"icons/apple-icon-60x60.png": "f99b190b0b6cc75c3bd08ca2a62e9ccf",
"icons/apple-icon-72x72.png": "2947cce0956988601afb0d14daeda3ea",
"icons/apple-icon-76x76.png": "2c24863b5465c9eff2e722b1da6e7522",
"icons/apple-icon-precomposed.png": "3c390f4a5532a827df0eeabdd2e0fd17",
"icons/apple-icon.png": "3c390f4a5532a827df0eeabdd2e0fd17",
"icons/favicon-16x16.png": "18615ae49887d340aaf51ae244126408",
"icons/favicon-32x32.png": "537bb3b743093ca468a0040572c8f771",
"icons/favicon-96x96.png": "ca20dbb31a5a4347598303d2c0d90fce",
"icons/favicon.ico": "117f4e3924101fb8cf7ce10157bd10db",
"icons/ms-icon-144x144.png": "128a138c30da200132afe323a8a720e7",
"icons/ms-icon-150x150.png": "a98b67a1e1efe4834bc17d08dc2f3a9e",
"icons/ms-icon-310x310.png": "b5060958c7d68d319abac4210ad51d46",
"icons/ms-icon-70x70.png": "ef6a5970ea1a5679c077d87fd792c2c9",
"index.html": "66b106aba2c4fe7ba932b2a0e0fd4e2d",
"/": "66b106aba2c4fe7ba932b2a0e0fd4e2d",
"main.dart.js": "1e9d1491f810b7d550d5f0edd9464397",
"manifest.json": "d16d1a18d800fffc868c42e8f5483578",
"version.json": "f3b179bc455ff205970c4c00ab437dca"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
