const KEY="travel-frog-offline-v1";
const defaultState={clover:80,bags:[],postcards:[],items:[],lastTrip:0,trip:null,log:[]};
let state=load();
const destinations=[
{name:"温暖的田野",emoji:"🌻",cost:20,time:8000,loot:["🍞 面包","🌱 小花"]},
{name:"森林小径",emoji:"🌲",cost:35,time:12000,loot:["🍄 蘑菇","🍂 叶子"]},
{name:"海边小镇",emoji:"🌊",cost:55,time:16000,loot:["🐚 贝壳","🧢 小纪念品"]},
{name:"古老的寺院",emoji:"⛩️",cost:75,time:22000,loot:["🧿 护身符","📿 小念珠"]}
];
const shop=[
{name:"四叶草便当",emoji:"🥪",price:30,kind:"food",desc:"让青蛙带着它出门。"},
{name:"温暖护身符",emoji:"🧿",price:45,kind:"charm",desc:"旅途中会更安心。"},
{name:"手帕",emoji:"🧣",price:25,kind:"cloth",desc:"简单又实用。"},
{name:"地图",emoji:"🗺️",price:60,kind:"map",desc:"帮助青蛙去更远的地方。"}
];
function load(){try{return {...defaultState,...JSON.parse(localStorage.getItem(KEY)||"{}")}}catch{return {...defaultState}}}
function save(){localStorage.setItem(KEY,JSON.stringify(state));render()}
function el(s){return document.querySelector(s)}
function render(){
 el("#clover").textContent=state.clover;el("#bagCount").textContent=state.bags.length;el("#postcards").textContent=state.postcards.length;
 const trip=state.trip;
 if(trip&&Date.now()-trip.started>=trip.time){finishTrip()}
 const tab=document.querySelector(".tab.active")?.dataset.tab||"home";renderTab(tab);
}
function renderTab(tab){
 document.querySelectorAll(".tab").forEach(b=>b.classList.toggle("active",b.dataset.tab===tab));
 const c=el("#content");
 if(tab==="home")c.innerHTML=homeHTML(); if(tab==="shop")c.innerHTML=shopHTML(); if(tab==="bag")c.innerHTML=bagHTML(); if(tab==="album")c.innerHTML=albumHTML();
}
function homeHTML(){
 if(state.trip){const left=Math.max(0,state.trip.time-(Date.now()-state.trip.started));return `<div class="notice">🐸 青蛙正在 <b>${state.trip.destination}</b> 旅行。<br>预计还有 <b>${format(left)}</b>。离线也会继续计时。</div><div class="grid"><div class="card"><h3>旅行中</h3><p>你可以关闭网页。下次打开时会自动检查旅行是否结束。</p><button class="secondary" onclick="checkTrip()">检查旅行</button></div></div>`}
 return `<div class="notice">🐸 今天也要准备一次旅行吗？购买物品后选择目的地即可出发。</div><div class="grid">${destinations.map((d,i)=>`<div class="card"><div class="photo">${d.emoji}</div><h3>${d.name}</h3><p>需要 🍀 ${d.cost} · 旅行时间 ${format(d.time)}</p><button class="primary" onclick="travel(${i})">准备出发</button></div>`).join("")}</div>`
}
function shopHTML(){return `<div class="grid">${shop.map((x,i)=>`<div class="card"><div class="photo">${x.emoji}</div><h3>${x.name}</h3><p>${x.desc}</p><b>🍀 ${x.price}</b><button class="primary ${state.clover<x.price?"disabled":""}" onclick="buy(${i})">购买</button></div>`).join("")}</div>`}
function bagHTML(){return state.bags.length?`<div class="grid">${state.bags.map((x,i)=>`<div class="card"><h3>${x.emoji} ${x.name}</h3><p>${x.desc||"旅行用品"}</p></div>`).join("")}</div>`:'<div class="empty">背包还是空的。去商店准备一点东西吧。</div>'}
function albumHTML(){return state.postcards.length?`<div class="grid">${state.postcards.map(p=>`<div class="card"><div class="photo">${p.emoji}</div><h3>${p.title}</h3><p>${p.text}</p><small>${new Date(p.date).toLocaleString()}</small></div>`).join("")}</div>`:'<div class="empty">还没有明信片。让青蛙出去旅行吧。</div>'}
function buy(i){const x=shop[i];if(state.clover<x.price)return;state.clover-=x.price;state.bags.push(x);el("#status").textContent="买好了！放进背包。";save()}
function travel(i){const d=destinations[i];if(state.trip)return;if(state.clover<d.cost){el("#status").textContent="三叶草不够，再收集一些吧。";return}if(!state.bags.length){el("#status").textContent="至少准备一件旅行用品吧。";return}state.clover-=d.cost;const used=state.bags.shift();state.trip={destination:d.name,emoji:d.emoji,started:Date.now(),time:d.time,used:used.name,loot:d.loot};el("#frog").classList.add("travel");el("#status").textContent="🐸 出发啦！";save()}
function finishTrip(){if(!state.trip)return;const t=state.trip;const loot=t.loot[Math.floor(Math.random()*t.loot.length)];state.items.push(loot);state.postcards.push({title:t.destination+"的明信片",text:"青蛙带回了一份小礼物："+loot+"。",emoji:t.emoji,date:Date.now()});state.clover+=15+Math.floor(Math.random()*20);state.log.unshift("去了"+t.destination);state.trip=null;setTimeout(()=>el("#frog")?.classList.remove("travel"),0);save();el("#status").textContent="🐸 回家啦！还带回了明信片。"}
function checkTrip(){if(state.trip){finishTrip();}else render()}
function format(ms){let s=Math.ceil(ms/1000);if(s<60)return s+"秒";let m=Math.floor(s/60),sec=s%60;return m+"分"+sec+"秒"}
document.querySelectorAll(".tab").forEach(b=>b.addEventListener("click",()=>renderTab(b.dataset.tab)));
el("#resetBtn").onclick=()=>{if(confirm("确定清空这个离线存档吗？")){localStorage.removeItem(KEY);state={...defaultState};render()}};
setInterval(()=>{if(state.trip)render()},1000);
window.addEventListener("focus",render);document.addEventListener("visibilitychange",()=>{if(!document.hidden)render()});
if("serviceWorker" in navigator)navigator.serviceWorker.register("./sw.js").catch(()=>{});
render();