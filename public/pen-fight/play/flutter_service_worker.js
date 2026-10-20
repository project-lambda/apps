'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"flutter_bootstrap.js": "180ff3bc186db766686863061971ffb1",
"version.json": "8de6fbb65560c1d70ed5b3fe865bedcb",
"index.html": "096edee491c1e4aa3e16f6db998793c1",
"/": "096edee491c1e4aa3e16f6db998793c1",
"main.dart.js": "c56c85ccb03f817fc551389b8dd7d70c",
"flutter.js": "24bc71911b75b5f8135c949e27a2984e",
"favicon.png": "db6b9809a191fffd18c5d391f9ccd149",
"icons/Icon-192.png": "afb951e9afa5e73f12b97c44bd5475db",
"icons/Icon-maskable-192.png": "155374fd3051bfd863ae2d785f069387",
"icons/Icon-maskable-512.png": "087134d16d8cf553c4deb7433ee5ad9e",
"icons/Icon-512.png": "db550ff2a57de8b0065a9cad8faa6624",
"manifest.json": "05d25bdabefff1bf143c3616d69f4a6d",
"assets/NOTICES": "56e9521b39e2ee50084a0d998e95729b",
"assets/FontManifest.json": "f6313fb66904abaf5cf986ceeaa71726",
"assets/AssetManifest.bin.json": "1df41be894eb9acb6657e2c0ce9e2ce6",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "33b7d9392238c04c131b6ce224e13711",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"assets/shaders/stretch_effect.frag": "40d68efbbf360632f614c731219e95f0",
"assets/AssetManifest.bin": "e937cc8a67131b0224bc7cdde86a2170",
"assets/fonts/MaterialIcons-Regular.otf": "adaa39cd02d5ea49ed04766387d5e03c",
"assets/assets/audio/music/victory_jingle.ogg": "d4bb379f7d394dffacffe4d265a53dab",
"assets/assets/audio/music/music_menu.ogg": "36f3d5e0b8fb8853fe26f051786e5f72",
"assets/assets/audio/music/music_duel.ogg": "a1ddc4978a05152fc2032b03fcf035c9",
"assets/assets/audio/shrink.wav": "d07cd144909fd85d8268149dcf255c54",
"assets/assets/audio/powerup.wav": "08fa12cb59eaf0c2eae4273f5b3e654c",
"assets/assets/audio/victory.wav": "c69807eef692e315eac13083c4267f46",
"assets/assets/audio/shake_warning.wav": "9979f59670a20724026ea871c7de23ce",
"assets/assets/audio/music_loop.wav": "9cc7be7ed7f082d10b8c12106da1a781",
"assets/assets/audio/flick.wav": "87903623878c40eb5b08658dcfae9211",
"assets/assets/audio/teacher.wav": "51e03f10c2bbb08cf2e1eeb8622171b3",
"assets/assets/audio/round_lose.wav": "941f9b835313a0f2bf31b0bb4da9e9e4",
"assets/assets/audio/LICENSES.md": "6308ecf706197a867624dbd8973c8a0a",
"assets/assets/audio/impact_hard.wav": "8356fbaa666bb1119d74b6069273a422",
"assets/assets/audio/defeat.wav": "1671e7917841df1b52ed3439ba0a7b87",
"assets/assets/audio/ui_confirm.wav": "ee9e6532a9207b6c8ed8dec908fe2e27",
"assets/assets/audio/taunt.wav": "867bada02c49f5079a65ca4d9edfcb26",
"assets/assets/audio/pen_out.wav": "a4ff0de9a7d1702237a6bb1b8c297640",
"assets/assets/audio/ui_tick.wav": "869ed21947c5523d41afacc7f6398114",
"assets/assets/audio/slide.wav": "09a25928e5fbb1b909cfef318a18bb0b",
"assets/assets/audio/impact_soft.wav": "44447ce97349744a461e6de2181ae653",
"assets/assets/audio/round_win.wav": "dfcb9a1859aae32c775ce7ef42009563",
"assets/assets/audio/shake.wav": "c44de63f96125c40cdc122ad2d87399c",
"assets/assets/fonts/Inter-Variable.ttf": "bff0f6e3b9e2259a28313168a907054f",
"assets/assets/fonts/Outfit-Variable.ttf": "e31a3aa5fce3366bcadb8e9027f26178",
"canvaskit/skwasm.js": "8060d46e9a4901ca9991edd3a26be4f0",
"canvaskit/skwasm_heavy.js": "740d43a6b8240ef9e23eed8c48840da4",
"canvaskit/skwasm.js.symbols": "3a4aadf4e8141f284bd524976b1d6bdc",
"canvaskit/canvaskit.js.symbols": "a3c9f77715b642d0437d9c275caba91e",
"canvaskit/skwasm_heavy.js.symbols": "0755b4fb399918388d71b59ad390b055",
"canvaskit/skwasm.wasm": "7e5f3afdd3b0747a1fd4517cea239898",
"canvaskit/chromium/canvaskit.js.symbols": "e2d09f0e434bc118bf67dae526737d07",
"canvaskit/chromium/canvaskit.js": "a80c765aaa8af8645c9fb1aae53f9abf",
"canvaskit/chromium/canvaskit.wasm": "a726e3f75a84fcdf495a15817c63a35d",
"canvaskit/canvaskit.js": "8331fe38e66b3a898c4f37648aaf7ee2",
"canvaskit/canvaskit.wasm": "9b6a7830bf26959b200594729d73538e",
"canvaskit/skwasm_heavy.wasm": "b0be7910760d205ea4e011458df6ee01"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"flutter_bootstrap.js",
"assets/AssetManifest.bin.json",
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
        // Claim client to enable caching on first launch
        self.clients.claim();
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
      // Claim client to enable caching on first launch
      self.clients.claim();
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
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
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
