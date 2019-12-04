/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

workbox.core.skipWaiting();

workbox.core.clientsClaim();

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "assets/css/main.css",
    "revision": "3b296d9746581a92a05c53911491365a"
  },
  {
    "url": "assets/js/app.js",
    "revision": "22b0e9fc19cce1cd21e1686e475f70ae"
  },
  {
    "url": "assets/js/modernizr-custom.js",
    "revision": "8c8e76b7f690143a6d6bc5e5886e8d0f"
  },
  {
    "url": "assets/js/three.min.js",
    "revision": "32b9147c1c127cc78ad44eff8dd6c777"
  },
  {
    "url": "index.html",
    "revision": "3bfcd365fb53667f0bf4a22423f6ba84"
  },
  {
    "url": "assets/img/bg-blue-sky-1024x1024.jpg",
    "revision": "591bea81e5816b6ee145b4f4714795db"
  },
  {
    "url": "assets/img/bg-blue-sky-1920x1080.jpg",
    "revision": "d97b30fa88e48becbb49f8a789368eda"
  },
  {
    "url": "assets/img/bg-blue-sky-768x768.jpg",
    "revision": "82dbd850b881eaf6d4b19b8e9411976d"
  },
  {
    "url": "assets/img/bg-classic-1024x1024.jpg",
    "revision": "b1965c19eba66c1bc41a792ae3b34274"
  },
  {
    "url": "assets/img/bg-classic-1440x1080.jpg",
    "revision": "dbe534af0575a3692d356338d06dbd15"
  },
  {
    "url": "assets/img/bg-classic-768x768.jpg",
    "revision": "09cf04bdf02b9a5aa2bf9c4123957466"
  },
  {
    "url": "assets/img/bg-night-sky-clouds-1024x1024.jpg",
    "revision": "14654ab34b7c2b39f1be51f03a09d348"
  },
  {
    "url": "assets/img/bg-night-sky-clouds-1920x1080.jpg",
    "revision": "81f17b3a6ddceb02a94adc34229a80fb"
  },
  {
    "url": "assets/img/bg-night-sky-clouds-768x768.jpg",
    "revision": "e9adc7364ea4d3392baf63bf9067ae7a"
  },
  {
    "url": "assets/img/flag-default.png",
    "revision": "68daaf550cef5f5b90ce2f8ef433b2c7"
  },
  {
    "url": "assets/img/site-headline-inverse.png",
    "revision": "eed9239c264649f05459e724fbdbc42a"
  },
  {
    "url": "assets/img/site-headline-inverse.svg",
    "revision": "7b36d7b27e59a9190910a6b02f09f132"
  },
  {
    "url": "assets/img/site-headline.png",
    "revision": "df5ba91b2b76363e7f8b70a7504c5403"
  },
  {
    "url": "assets/img/site-headline.svg",
    "revision": "44524eba63d11b1039e75b1d98d76613"
  },
  {
    "url": "assets/img/social-banner.png",
    "revision": "25cbf11c38232414a0ed47980a909a47"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {
  "directoryIndex": "index.html",
  "ignoreURLParametersMatching": [/./]
});

workbox.precaching.cleanupOutdatedCaches();

workbox.routing.registerRoute(/assets\/fonts/, new workbox.strategies.StaleWhileRevalidate({ "cacheName":"webfonts", plugins: [] }), 'GET');
workbox.routing.registerRoute(/^https:\/\/ajax\.googleapis\.com/, new workbox.strategies.StaleWhileRevalidate({ "cacheName":"google-typekit-webfontloader", plugins: [] }), 'GET');
