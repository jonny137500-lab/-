const CACHE="travel-frog-offline-v2";
const LOCAL_ASSETS=["./","./index.html","./style.css","./app.js","./manifest.webmanifest","./Travel_Frog_旅行青蛙_旅かえる_BGM_背景音乐_KLICKAUD.mp3"];
const REMOTE_ASSETS=["https://raw.githubusercontent.com/jsmask/TravelFrog/master/assets/Texture/audio/bgm.mp3","https://raw.githubusercontent.com/jsmask/TravelFrog/master/assets/Texture/audio/se06.mp3","https://raw.githubusercontent.com/jsmask/TravelFrog/master/assets/Texture/other/MainOut_mail_tuuti.png","https://raw.githubusercontent.com/jsmask/TravelFrog/master/assets/Texture/other/hi_syokudai_01.png","https://raw.githubusercontent.com/jsmask/TravelFrog/master/assets/Texture/other/hi_syokudai_02.png","https://raw.githubusercontent.com/jsmask/TravelFrog/master/assets/Texture/other/hi_syokudai_03.png","https://raw.githubusercontent.com/jsmask/TravelFrog/master/assets/Texture/role/1/role1.png","https://raw.githubusercontent.com/jsmask/TravelFrog/master/assets/Texture/role/2/role2.png","https://raw.githubusercontent.com/jsmask/TravelFrog/master/assets/Texture/role/4/role4.png","https://raw.githubusercontent.com/jsmask/TravelFrog/master/assets/Texture/ui/back.png","https://raw.githubusercontent.com/jsmask/TravelFrog/master/assets/Texture/ui/back_mainIn.png","https://raw.githubusercontent.com/jsmask/TravelFrog/master/assets/Texture/ui/back_mainOut_2_L.png","https://raw.githubusercontent.com/jsmask/TravelFrog/master/assets/Texture/ui/back_mainOut_2_R.png","https://raw.githubusercontent.com/jsmask/TravelFrog/master/assets/Texture/ui/clover_154.png","https://raw.githubusercontent.com/jsmask/TravelFrog/master/assets/Texture/ui/clover_160.png","https://raw.githubusercontent.com/jsmask/TravelFrog/master/assets/Texture/ui/clover_166.png","https://raw.githubusercontent.com/jsmask/TravelFrog/master/assets/Texture/ui/haikei_niwa.png","https://raw.githubusercontent.com/jsmask/TravelFrog/master/assets/Texture/ui/haikei_niwa_akari.png","https://raw.githubusercontent.com/jsmask/TravelFrog/master/assets/Texture/ui/icon_camera_84_88.png","https://raw.githubusercontent.com/jsmask/TravelFrog/master/assets/Texture/ui/icon_help_84_88.png","https://raw.githubusercontent.com/jsmask/TravelFrog/master/assets/Texture/ui/icon_house_84_88.png","https://raw.githubusercontent.com/jsmask/TravelFrog/master/assets/Texture/ui/icon_item_84_88.png","https://raw.githubusercontent.com/jsmask/TravelFrog/master/assets/Texture/ui/icon_menu_92_96.png","https://raw.githubusercontent.com/jsmask/TravelFrog/master/assets/Texture/ui/icon_out_84_88.png","https://raw.githubusercontent.com/jsmask/TravelFrog/master/assets/Texture/ui/icon_shop_84_88.png","https://raw.githubusercontent.com/jsmask/TravelFrog/master/assets/Texture/ui/icon_urabeya_84_88.png","https://raw.githubusercontent.com/jsmask/TravelFrog/master/assets/Texture/ui/loading.png","https://raw.githubusercontent.com/jsmask/TravelFrog/master/assets/Texture/ui/loading_dorai.png","https://raw.githubusercontent.com/jsmask/TravelFrog/master/assets/Texture/ui/loading_off.png","https://raw.githubusercontent.com/jsmask/TravelFrog/master/assets/Texture/ui/loading_on.png","https://raw.githubusercontent.com/jsmask/TravelFrog/master/assets/Texture/ui/lottery_ball_01.png","https://raw.githubusercontent.com/jsmask/TravelFrog/master/assets/Texture/ui/lottery_ball_02.png","https://raw.githubusercontent.com/jsmask/TravelFrog/master/assets/Texture/ui/lottery_ball_03.png","https://raw.githubusercontent.com/jsmask/TravelFrog/master/assets/Texture/ui/lottery_ball_04.png","https://raw.githubusercontent.com/jsmask/TravelFrog/master/assets/Texture/ui/lottery_ball_05.png","https://raw.githubusercontent.com/jsmask/TravelFrog/master/assets/Texture/ui/lottery_dodai.png","https://raw.githubusercontent.com/jsmask/TravelFrog/master/assets/Texture/ui/name/frame_01.png","https://raw.githubusercontent.com/jsmask/TravelFrog/master/assets/Texture/ui/name/frame_name.png","https://raw.githubusercontent.com/jsmask/TravelFrog/master/assets/Texture/ui/name/icon_name.png","https://raw.githubusercontent.com/jsmask/TravelFrog/master/assets/Texture/ui/name/icon_syougou.png","https://raw.githubusercontent.com/jsmask/TravelFrog/master/assets/Texture/ui/name/ok.png","https://raw.githubusercontent.com/jsmask/TravelFrog/master/assets/Texture/ui/name/zukan_title.png","https://raw.githubusercontent.com/jsmask/TravelFrog/master/assets/Texture/ui/start.png","https://raw.githubusercontent.com/jsmask/TravelFrog/master/assets/Texture/ui/sys_clover_window.png","https://raw.githubusercontent.com/jsmask/TravelFrog/master/assets/Texture/ui/title.png"];
const ONLINE_ASSET="https://www.hit-point.co.jp/games/tabikaeru/img/banner_tabikaeru.png";
self.addEventListener("install",event=>{
 event.waitUntil((async()=>{
   const cache=await caches.open(CACHE);
   await cache.addAll(LOCAL_ASSETS);
   await Promise.all(REMOTE_ASSETS.map(async url=>{try{const r=await fetch(url);if(r.ok)await cache.put(url,r.clone())}catch(e){}}));
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
