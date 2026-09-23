# 旅行青蛙 · Offline Edition

一个不需要后端的网页版本，重点复刻《旅かえる》的「准备 → 出发 → 等待 → 回家 → 明信片/纪念品」循环。

## 当前版本

- 🍀 三叶草收集
- 🛍️ 商店
- 🎒 旅行准备（便当 / 护身符 / 其他用品）
- 🗺️ 多个目的地
- 🐸 旅行倒计时，关闭网页后仍按真实时间继续
- 📷 明信片相册
- 🎟️ 抽奖券与抽奖
- 💾 localStorage 本地存档
- 📱 PWA / Service Worker
- 🌐 无后端、无 CDN、主要逻辑离线运行

## TravelFrog source 素材已完整接入

已按你提供的授权把 `jsmask/TravelFrog` source repo 中可直接用于网页的素材接入：庭院/室内背景、青蛙和伙伴 sprite、信箱、三叶草、菜单/帮助/退出/里屋图标、抽奖台与 5 个抽奖球、加载/开始图、名称/称号/图鉴 UI、提示图以及 `se06.mp3` 音效。菜单按钮还能打开素材库逐项检查。

Cocos Creator 的 `mail.prefab`、`role_book.prefab`、`role_made.prefab`、`role_write.prefab` 不能直接由纯 HTML/JS 执行，所以没有假装“转换”它们；对应网页功能继续由本项目自己的 JS 实现。

## 网络素材

项目加入了 Hit-Point 官方《旅かえる》宣传图作为视觉素材，并在 Service Worker 中尝试缓存该图片，以便首次在线打开后继续离线使用。

官方资料：
https://www.hit-point.co.jp/games/tabikaeru/

Hit-Point 官方页面标明《旅かえる》©2017 Hit-Point；官方 FAQ 说明了「したく（准备）」会影响目的地/路线、旅行可能持续数天，以及回家后可能获得三叶草、抽奖券、照片和各地纪念品等机制。

## 说明

这个仓库是一个独立网页重制项目，不包含原游戏 APK、原始游戏程序或逆向代码。网页中的游戏逻辑为独立实现。

如果之后加入你拥有明确再分发授权的原始 PNG/SVG/音频资源，可以直接放入 `assets/` 并把 CSS/JS 的占位视觉替换掉。
