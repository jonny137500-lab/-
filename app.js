const KEY="travel-frog-offline-v2";
const defaultState={clover:80,tickets:3,bags:[],postcards:[],souvenirs:[],trip:null,harvested:0,log:[]};
let state=load();
let selected={food:null,charm:null,cloth:null};
const BGM_SRC="./Travel_Frog_旅行青蛙_旅かえる_BGM_背景音乐_KLICKAUD.mp3";
let musicOn=localStorage.getItem("travel-frog-music")!=="off";

const destinations=[
{name:"温暖的田野",emoji:"🌻",scene:"meadow",cost:20,time:12000,need:"food",loot:["🌱 四叶草","🍞 小面包"]},
{name:"森林小径",emoji:"🌲",scene:"forest",cost:35,time:18000,need:"charm",loot:["🍄 森林蘑菇","🍂 秋叶"]},
{name:"海边小镇",emoji:"🌊",scene:"sea",cost:50,time:24000,need:"cloth",loot:["🐚 贝壳","🎐 海边纪念品"]},
{name:"古老的寺院",emoji:"⛩️",scene:"temple",cost:70,time:32000,need:"charm",loot:["🧿 护身符","📿 小念珠"]}
];
const shop=[
{name:"蜂蜜面包",icon:"🍞",price:18,kind:"food",desc:"便携的旅行便当。"},
{name:"三明治",icon:"🥪",price:28,kind:"food",desc:"更适合长途旅行。"},
{name:"幸运铃",icon:"🔔",price:35,kind:"charm",desc:"旅行时带来好运。"},
{name:"四叶草护符",icon:"🍀",price:55,kind:"charm",desc:"稀有的幸运物。"},
{name:"手帕",icon:"🧣",price:22,kind:"cloth",desc:"轻便又实用。"},
{name:"小地图",icon:"🗺️",price:45,kind:"map",desc:"帮助探索新的地方。"}
];

function load(){
 try{
   const old=JSON.parse(localStorage.getItem(KEY)||"null");
   if(old)return {...defaultState,...old};
   return {...defaultState};
 }catch{return {...defaultState}}
}
function save(){localStorage.setItem(KEY,JSON.stringify(state));render()}
function el(s){return document.querySelector(s)}
function setStatus(t){const x=el("#status");if(x)x.textContent=t}
function updateMail(){const n=state.postcards.length;const box=el("#mailbox");const badge=el("#mailBadge");if(box){box.classList.toggle("has-mail",n>0);if(badge)badge.textContent=n>9?"9+":n}}\nfunction render(){
 el("#clover").textContent=state.clover;
 el("#bagCount").textContent=state.bags.length;
 el("#tickets").textContent=state.tickets;
 el("#postcards").textContent=state.postcards.length; updateMail();
 if(state.trip && Date.now()-state.trip.started>=state.trip.time) finishTrip();
 const tab=document.querySelector(".tab.active")?.dataset.tab||"home";
 renderTab(tab);
}
function renderTab(tab){
 document.querySelectorAll(".tab").forEach(b=>b.classList.toggle("active",b.dataset.tab===tab));
 const c=el("#content");
 if(tab==="home")c.innerHTML=homeHTML();
 if(tab==="prepare")c.innerHTML=prepareHTML();
 if(tab==="shop")c.innerHTML=shopHTML();
 if(tab==="album")c.innerHTML=albumHTML();
}
function homeHTML(){
 if(state.trip){
   const left=Math.max(0,state.trip.time-(Date.now()-state.trip.started));
   return '<div class="notice">🐸 正在前往 <b>'+state.trip.destination+'</b>。<br>还需要 <b>'+format(left)+'</b>。<br><small>关闭网页也不会暂停旅行。</small></div>'+
   '<div class="grid"><div class="card"><div class="photo">'+state.trip.emoji+'</div><h3>旅途中</h3><p>带着 '+state.trip.used+' 出发。回家后可能获得照片、纪念品和三叶草。</p><button class="secondary" onclick="checkTrip()">检查是否回家</button></div></div>';
 }
 return '<div class="notice">🐸 青蛙回家后会休息一会儿。去「准备」选择便当和护身符，再完成准备让它出发。<br>三叶草可以在花园里收集。</div>'+
 '<div class="grid"><div class="card"><div class="photo">🍀</div><h3>收集三叶草</h3><p>庭院里会长出新的三叶草。</p><button class="primary" onclick="harvest()">收集 +'+(2+Math.floor(Math.random()*5))+' 🍀</button></div>'+
 '<div class="card"><div class="photo">🎟️</div><h3>抽奖</h3><p>用抽奖券换取旅行用品。</p><button class="secondary" onclick="lottery()">抽一次（1券）</button></div>'+
 '<div class="card"><div class="photo">📖</div><h3>旅行记录</h3><p>已完成 '+state.log.length+' 次旅行。</p><button class="secondary" onclick="renderTab('album')">打开相册</button></div></div>';
}
function prepareHTML(){
 if(state.trip)return '<div class="empty">青蛙正在旅行，等它回来再准备下一次吧。</div>';
 const foods=state.bags.filter(x=>x.kind==="food"), charms=state.bags.filter(x=>x.kind==="charm"), clothes=state.bags.filter(x=>x.kind==="cloth");
 const chosen=selected;
 return '<div class="notice">核心玩法参考「したく（准备）」：准备物品会影响旅行目的地和路线。</div>'+
 '<div class="card" style="margin:14px"><h3>① 便当</h3>'+choiceHTML(foods,"food")+
 '<h3 style="margin-top:14px">② 护身符</h3>'+choiceHTML(charms,"charm")+
 '<h3 style="margin-top:14px">③ 其他用品</h3>'+choiceHTML(clothes,"cloth")+
 '<button class="primary '+((!chosen.food&&!chosen.charm&&!chosen.cloth)?"disabled":"")+'" onclick="startPreparedTrip()">完成准备，出发</button></div>'+
 '<div class="notice">当前背包：'+state.bags.length+' 件。没有合适的用品？去商店购买。</div>';
}
function choiceHTML(arr,kind){
 if(!arr.length)return '<div class="empty" style="padding:12px">没有这类用品</div>';
 return '<div class="choice">'+arr.map((x,i)=>'<button class="'+(selected[kind]===i?'selected':'')+'" onclick="selectItem(\''+kind+'\','+i+')">'+x.icon+' '+x.name+'</button>').join("")+'</div>';
}
function shopHTML(){
 return '<div class="grid">'+shop.map((x,i)=>'<div class="card"><div class="photo">'+x.icon+'</div><h3>'+x.name+'</h3><p>'+x.desc+'</p><b>🍀 '+x.price+'</b><button class="primary '+(state.clover<x.price?"disabled":"")+'" onclick="buy('+i+')">购买</button></div>').join("")+'</div>';
}
function postcardHTML(p){
 const scene=p.scene||"meadow";
 return '<article class="postcard"><div class="pc-scene destination-'+scene+'"><span>'+p.emoji+'</span><div class="pc-stamp">🍀</div></div><div class="pc-title">'+p.title+'</div><div class="pc-note">'+p.text+'</div></article>';
}
function albumHTML(){
 const photos=state.postcards;
 if(!photos.length)return '<div class="empty">📮 邮箱里还没有明信片。让青蛙出去旅行吧。</div>';
 return '<div class="mail-note">📮 青蛙寄回来的明信片会自动保存。每次旅行的地点、纪念品和日期都会记录。</div><div class="grid">'+photos.map(p=>'<div class="card">'+postcardHTML(p)+'<small>'+new Date(p.date).toLocaleString()+'</small></div>').join("")+'</div>';
}
function selectItem(kind,i){selected[kind]=i;renderTab("prepare")}
function harvest(){
 const gain=2+Math.floor(Math.random()*5);
 state.clover+=gain;state.harvested++;
 setStatus("🍀 收到了 "+gain+" 片三叶草！");
 save();
}
function buy(i){
 const x=shop[i];
 if(state.clover<x.price)return;
 state.clover-=x.price;
 state.bags.push({...x});
 setStatus("买好了："+x.name);
 save();
}
function startPreparedTrip(){
 if(state.trip)return;
 const food=selected.food==null?null:state.bags.filter(x=>x.kind==="food")[selected.food];
 const charm=selected.charm==null?null:state.bags.filter(x=>x.kind==="charm")[selected.charm];
 const cloth=selected.cloth==null?null:state.bags.filter(x=>x.kind==="cloth")[selected.cloth];
 if(!food&&!charm&&!cloth){setStatus("至少准备一样旅行用品。");return}
 const candidates=destinations.filter(d=>
   !d.need || (d.need==="food"&&food)||(d.need==="charm"&&charm)||(d.need==="cloth"&&cloth)
 );
 const d=candidates[Math.floor(Math.random()*candidates.length)]||destinations[0];
 const used=food||charm||cloth;
 const idx=state.bags.indexOf(used);
 if(idx>=0)state.bags.splice(idx,1);
 state.trip={destination:d.name,emoji:d.emoji,started:Date.now(),time:d.time,used:used.name,loot:d.loot};
 selected={food:null,charm:null,cloth:null};
 el("#frog")?.classList.add("travel");
 setStatus("🐸 出发啦！");
 save();
}
function finishTrip(){
 if(!state.trip)return;
 const t=state.trip;
 const loot=t.loot[Math.floor(Math.random()*t.loot.length)];
 const bonus=12+Math.floor(Math.random()*18);
 state.souvenirs.push(loot);
 state.postcards.unshift({title:t.destination+"的明信片",text:"旅行回来了，带回："+loot+"。",emoji:t.emoji,scene:destinations.find(d=>d.name===t.destination)?.scene||"meadow",date:Date.now()});
 state.clover+=bonus;
 state.tickets+=1;
 state.log.unshift(t.destination);
 state.trip=null;
 el("#frog")?.classList.remove("travel");
 save();
 setStatus("🐸 回家啦！带回了 "+loot+"，还有 "+bonus+" 🍀。");
}
function checkTrip(){render()}
function lottery(){
 if(state.tickets<1){setStatus("抽奖券不够。旅行回来会获得抽奖券。");return}
 state.tickets--;
 const prizes=[shop[0],shop[2],shop[4],shop[1],shop[3]];
 const prize=prizes[Math.floor(Math.random()*prizes.length)];
 state.bags.push({...prize,fromLottery:true});
 setStatus("🎟️ 抽中了 "+prize.name+"！");
 save();
}
function format(ms){
 let s=Math.ceil(ms/1000);
 if(s<60)return s+"秒";
 let m=Math.floor(s/60),sec=s%60;
 return m+"分"+sec+"秒";
}
function setupMusic(){
 const audio=el("#bgm"),btn=el("#musicBtn");
 if(!audio||!btn)return;
 audio.volume=0.28;
 const update=()=>{btn.textContent=audio.paused?"🔇 音乐":"🔊 音乐";};
 btn.addEventListener("click",async()=>{
   if(audio.paused){try{await audio.play();musicOn=true;localStorage.setItem("travel-frog-music","on")}catch{setStatus("点击一次「音乐」即可播放 BGM。")}}
   else{audio.pause();musicOn=false;localStorage.setItem("travel-frog-music","off")}
   update();
 });
 if(musicOn)document.addEventListener("pointerdown",async()=>{if(audio.paused){try{await audio.play();update()}catch{}}},{once:true});
 update();
}
document.querySelectorAll(".tab").forEach(b=>b.addEventListener("click",()=>renderTab(b.dataset.tab)));
el("#resetBtn").onclick=()=>{if(confirm("确定清空离线存档吗？")){localStorage.removeItem(KEY);state={...defaultState,bags:[],postcards:[],souvenirs:[],log:[]};render();setStatus("存档已重置。")}};
setInterval(()=>{if(state.trip)render()},1000);
window.addEventListener("focus",render);
document.addEventListener("visibilitychange",()=>{if(!document.hidden)render()});
setupMusic();
if("serviceWorker" in navigator)navigator.serviceWorker.register("./sw.js").catch(()=>{});
render();
