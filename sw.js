const CACHE="travel-frog-offline-v2";
const LOCAL_ASSETS=["./","./index.html","./style.css","./app.js","./manifest.webmanifest","./Travel_Frog_旅行青蛙_旅かえる_BGM_背景音乐_KLICKAUD.mp3"];
const ONLINE_ASSET="https://www.hit-point.co.jp/games/tabikaeru/img/banner_tabikaeru.png";
self.addEventListener("install",event=>{
 event.waitUntil((async()=>{
   const cache=await caches.open(CACHE);
   await cache.addAll(LOCAL_ASSETS);
   try{
     const response=await fetch(ONLINE_ASSET,{mode:"no-cors"});
     await cache.put(ONLINE_ASSET,response);
   }catch(e){}
   await self.skipWaiting();
 })());
});
self.addEventListener("activate",event=>event.waitUntil(self.clients.claim()));
self.addEventListener("fetch",event=>{
 event.respondWith((async()=>{
   const cached=await caches.match(event.request);
   if(cached)return cached;
   try{
     const response=await fetch(event.request);
     if(event.request.method==="GET"){
       const copy=response.clone();
       caches.open(CACHE).then(c=>c.put(event.request,copy)).catch(()=>{});
     }
     return response;
   }catch(e){
     return caches.match("./");
   }
 })());
});
