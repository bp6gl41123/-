/* ============================================================== */
/* ==== 【組件 E：核心引擎 - core_engine.js】 ==== */
/* ============================================================== */

const DB_KEY = 'DashboardDB_V78_Final'; 
window.dataDB = JSON.parse(localStorage.getItem(DB_KEY));
window.isNegativeMode = false; // 🪄 魔法反向開關

if (!window.dataDB) { window.dataDB = JSON.parse(JSON.stringify(defaultDB)); }

// 🎨 全站核心 CSS 注入
if (!document.getElementById('pickTooltipStyle')) {
    const style = document.createElement('style'); style.id = 'pickTooltipStyle';
    style.innerHTML = `
.pick-tooltip-container { position: relative; display: inline-flex; align-items: center; margin-left: 10px; }
        .pick-icon { font-size: 18px; cursor: pointer; background: #fffbeb; border: 1px solid #fde68a; padding: 4px 12px; border-radius: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); animation: floatPulse 2s infinite ease-in-out; display: inline-flex; align-items: center; justify-content: center; transition: 0.2s; }
        .pick-icon:hover { animation: none; transform: scale(1.08); background: #fef3c7; box-shadow: 0 4px 8px rgba(0,0,0,0.15); }
        @keyframes floatPulse { 0% { transform: translateY(0px); } 50% { transform: translateY(-3px); } 100% { transform: translateY(0px); } }

/* 📱 手機/LINE 版終極防護：徹底解決卡片高低不平的問題 (武裝版) */
        @media (max-width: 768px) {
            /* 對策一：空間剝離。將泡泡變成右上角小紅點 */
            .pick-tooltip-container { position: absolute !important; top: -5px !important; right: -5px !important; margin-left: 0 !important; z-index: 5 !important; }
            .pick-icon { font-size: 13px !important; padding: 2px 6px !important; border: 2px solid #fff !important; box-shadow: 0 4px 10px rgba(0,0,0,0.3) !important; }
            
            /* 對策二：高度鎖死。強制卡片統一高度，並將內容垂直均分 */
            .expert-card, body.mode-neg .expert-card { 
                height: 105px !important; 
                padding: 10px 2px !important;
                display: flex !important;
                flex-direction: column !important;
                justify-content: space-between !important;
                box-sizing: border-box !important;
            }
            
            /* 對策三：彈性名字空間。吸收中間剩餘空間，斷幾行都垂直置中 */
            .expert-card .name { 
                flex-grow: 1 !important; 
                font-size: 13.5px !important; 
                line-height: 1.15 !important; 
                word-break: break-all !important; 
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
            }
        }

.pick-tooltip { 
            visibility: hidden; opacity: 0; position: absolute; bottom: 130%; left: 50%; transform: translateX(-50%); 
            background: linear-gradient(135deg, #1e293b, #0f172a); color: #fbbf24; text-align: left; padding: 14px 18px; 
            border-radius: 12px; border: 1px solid #fbbf24; 
            /* 稍微加寬，讓閱讀更舒適 */
            min-width: 220px; max-width: 280px; white-space: normal; 
            z-index: 10000; font-size: 14px; font-weight: bold; box-shadow: 0 10px 25px rgba(0,0,0,0.5); 
            transition: 0.3s; pointer-events: auto; line-height: 1.6; letter-spacing: 0.5px; 
            /* 🎯 核心防護：限制最高高度，超過自動顯示捲軸，並防止滾動穿透 */
            max-height: 220px; overflow-y: auto; overscroll-behavior: contain; 
        }
        
        /* 🎨 替暗黑泡泡框加上高質感的專屬金色小捲軸 */
        .pick-tooltip::-webkit-scrollbar { width: 6px; }
        .pick-tooltip::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.3); border-radius: 8px; }
        .pick-tooltip::-webkit-scrollbar-thumb { background: #fbbf24; border-radius: 8px; }

        .pick-tooltip::after { content: ""; position: absolute; top: 100%; left: 50%; margin-left: -6px; border-width: 6px; border-style: solid; border-color: #fbbf24 transparent transparent transparent; }

        .pick-tooltip-container:hover .pick-tooltip, .pick-tooltip.show-mobile { visibility: visible; opacity: 1; bottom: 145%; }
        .pk-column:hover { z-index: 10; } 
        .pk-column .pick-tooltip { bottom: auto; top: 130%; }
        .pk-column .pick-tooltip::after { top: auto; bottom: 100%; border-color: transparent transparent #fbbf24 transparent; }
        .pk-column .pick-tooltip-container:hover .pick-tooltip, .pk-column .pick-tooltip.show-mobile { bottom: auto; top: 145%; }

/* 🚀 宇宙飛入特效：從四面八方隨機匯聚 */
        @keyframes scatterFlyIn {
            0% { 
                opacity: 0; 
                transform: translate(var(--rx), var(--ry)) rotate(var(--rr)) scale(0.5); 
            }
            100% { 
                opacity: 1; 
                transform: translate(var(--tx, 0px), var(--ty, 0px)) rotate(var(--rot, 0deg)) scale(1); 
            }
        }

        .expert-card, .podium-card { 
            /* 設定隨機初始位置的變數 (CSS 亂數模擬) */
            --rx: 0px; --ry: 0px; --rr: 0deg;
            animation: scatterFlyIn 0.6s cubic-bezier(0.165, 0.84, 0.44, 1) backwards; 
        }

        /* 為不同順序的卡片設定不同的發射點，達成「四面八方」感 */
        .expert-card:nth-child(4n+1) { --rx: -800px; --ry: -500px; --rr: -120deg; animation-delay: 0.05s; }
        .expert-card:nth-child(4n+2) { --rx: 800px;  --ry: -600px; --rr: 150deg;  animation-delay: 0.1s; }
        .expert-card:nth-child(4n+3) { --rx: -700px; --ry: 700px;  --rr: -90deg;  animation-delay: 0.15s; }
        .expert-card:nth-child(4n+4) { --rx: 900px;  --ry: 400px;  --rr: 180deg;  animation-delay: 0.2s; }
        
        .podium-card:nth-child(1) { --rx: 0px;    --ry: -1000px; --rr: 360deg; }
        .podium-card:nth-child(2) { --rx: -1200px; --ry: 0px;     --rr: -360deg; }
        .podium-card:nth-child(3) { --rx: 1200px;  --ry: 0px;     --rr: 720deg; }

/* 👈 text-align: left 讓按鈕靠左 */
        .pocket-btn-wrapper { margin-top: 10px; border-top: 1px dashed #475569; padding-top: 8px; text-align: left; }
        /* 👈 顏色同步為寶庫專屬的橘色漸層，增加立體陰影 */
        .pocket-add-btn { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; border: none; padding: 6px 14px; border-radius: 6px; font-size: 12px; font-weight: bold; cursor: pointer; transition: 0.2s; box-shadow: 0 2px 5px rgba(0,0,0,0.3); }
        .pocket-add-btn:hover { background: linear-gradient(135deg, #fbbf24, #f59e0b); transform: translateY(-1px); }
        /* 👈 已收錄狀態改為深沉的翡翠綠漸層，代表成功存入 */
        .pocket-add-btn.saved { background: linear-gradient(135deg, #10b981, #059669); color: white; }

        /* 🛑 休眠卡片樣式 */
        .sleep-card { background-color: #f8fafc; border-color: #cbd5e1; }
        .sleep-card .name { color: #94a3b8; }
        .sleep-card .badge { background-color: #e2e8f0; color: #94a3b8; }
        .sleep-card .sleep-text { color: #cbd5e1; }


/* 🪄 專屬反向模式：從白轉黑的翻轉動畫 */
@keyframes flipFromWhite {
            0% {
                opacity: 1; /* 翻轉開始時顯現 */
                /* 翻轉 180 度，且位置也要考慮進去 */
                transform: translate(var(--tx, 0px), var(--ty, 0px)) rotateY(180deg) rotate(var(--rot, 0deg));
                background-color: #ffffff;
                color: transparent;
                border-color: #e2e8f0;
            }
100% {
                opacity: 1; /* 強制結束時可見 */
                /* 翻轉回 0 度，並保持深 U 曲線的位置 */
                transform: translate(var(--tx, 0px), var(--ty, 0px)) rotateY(0deg) rotate(var(--rot, 0deg));
                background-color: #1e293b;
                color: #fca5a5;
                border-color: #450a0a;
            }
        }

        /* 🪄 暗黑/反向魔法模式 */
        body.mode-neg { background-color: #0f172a; color: #f8fafc; transition: background-color 0.5s; }

/* 🪄 魔法模式：卡片改為「白轉黑」翻轉，且取消原本的飛入 */
body.mode-neg .expert-card {
            animation: flipFromWhite 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards !important; 
            transform-style: preserve-3d; perspective: 1000px; backface-visibility: hidden; 
            opacity: 0; background: #1e293b; z-index: 1;
        }
        /* 💡 移除 podium-card 的強制單一動畫，交給 index.html 統一控光 */

        body.mode-neg .podium-card { background: linear-gradient(135deg, #7f1d1d, #450a0a); border-color: #ef4444; }

        .mode-neg .rank-net { color: #f87171 !important; }

        /* 魔法模式下的休眠卡片 (深淵灰) */
        body.mode-neg .sleep-card { background-color: #020617 !important; border-color: #1e293b !important; opacity: 0.7; }
        body.mode-neg .sleep-card .name { color: #475569 !important; }
        body.mode-neg .sleep-card .badge { background-color: #1e293b !important; color: #475569 !important; }
        body.mode-neg .sleep-card .sleep-text { color: #334155 !important; }

/* 🥋 寬鬆魔法腰帶版：卡片大小恢復 100%，增加橫向間距 */
        body.mode-neg #expertGrid { 
            display: grid !important;
            grid-template-columns: repeat(8, 1fr) !important; /* 核心：恢復 8 欄，卡片立即變大 */
            gap: 75px 25px !important; /* 加大間距，絕對不擠 */
            max-width: 1550px !important; 
            margin: 0px auto 80px auto !important; 
            position: relative;
            z-index: 50; 
            padding: 0 30px; 
        }
        
        body.mode-neg .expert-card {
            --tx: 0px; --ty: 0px; --rot: 0deg; 
            padding: 15px 5px !important; /* 恢復正常卡片高度 */
            border-radius: 12px !important; /* 恢復正常圓角 */
            transform: translate(var(--tx), var(--ty)) rotate(var(--rot)); /* 移除 !important，交給動畫接管 */
            transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s !important;
        }

/* 🔥 8 欄位最終校正版：極致深 U 曲線 + 卡片絕對端正 */
        body.mode-neg .expert-card:nth-child(8n + 1) { --tx: 45px;  --ty: -125px; --rot: -1.5deg; }
        body.mode-neg .expert-card:nth-child(8n + 2) { --tx: 25px;  --ty: -65px;  --rot: -0.8deg; }
        body.mode-neg .expert-card:nth-child(8n + 3) { --tx: 10px;  --ty: -20px;  --rot: -0.3deg; }
        body.mode-neg .expert-card:nth-child(8n + 4) { --tx: 0px;   --ty: 0px;    --rot: 0deg;    }
        body.mode-neg .expert-card:nth-child(8n + 5) { --tx: 0px;   --ty: 0px;    --rot: 0deg;    }
        body.mode-neg .expert-card:nth-child(8n + 6) { --tx: -10px; --ty: -20px;  --rot: 0.3deg;  }
        body.mode-neg .expert-card:nth-child(8n + 7) { --tx: -25px; --ty: -65px;  --rot: 0.8deg;  }
        body.mode-neg .expert-card:nth-child(8n + 8) { --tx: -45px; --ty: -125px; --rot: 1.5deg;  }

/* 💡 滑鼠懸停修復：取消旋轉、微微放大、突顯層級，解決疊在一起看不到字的問題 */
        body.mode-neg .expert-card:hover {
            transform: translate(calc(var(--tx) * 0.8), calc(var(--ty) - 20px)) rotate(0deg) scale(1.3) !important;
            z-index: 100 !important;
            box-shadow: 0 15px 35px rgba(220, 38, 38, 0.7) !important;
        }

        /* 🔥 反向魔法專屬「點選」狀態：紅光、浮起、暗紅底，徹底蓋掉原本的藍色 */
        body.mode-neg .expert-card.active {
            transform: translate(calc(var(--tx) * 0.8), calc(var(--ty) - 20px)) rotate(0deg) scale(1.2) !important;
            z-index: 95 !important;
            border: 2.5px solid #ef4444 !important;
            background-color: #450a0a !important;
            box-shadow: 0 0 25px 5px rgba(220, 38, 38, 0.8) !important;
        }
        
        /* 🔥 前三名頒獎台的反向點選狀態 */
        body.mode-neg .podium-card.active {
            border: 3px solid #ef4444 !important;
            background: linear-gradient(135deg, #991b1b, #450a0a) !important;
            box-shadow: 0 0 30px 10px rgba(220, 38, 38, 0.8) !important;
            transform: translateY(-10px) !important;
        }

        .mode-toggle-wrapper { display: flex; justify-content: center; margin-bottom: 20px; gap: 15px; }
        .toggle-btn { padding: 10px 24px; border-radius: 50px; cursor: pointer; font-weight: bold; transition: 0.3s; border: 2px solid #cbd5e1; background: #fff; color: #64748b; }
        .toggle-btn.active-pos { background: #1877f2; color: white; border-color: #1877f2; box-shadow: 0 4px 10px rgba(24,119,242,0.3); }
        .toggle-btn.active-neg { background: #dc2626; color: white; border-color: #dc2626; box-shadow: 0 4px 10px rgba(220,38,38,0.3); }
    `;
    document.head.appendChild(style);
}

window.userPocket = JSON.parse(localStorage.getItem('UserPocketDB')) || [];
window.activeSportKey = "";  
/* 🎯 變更預設首頁過濾器：從 'all' (賽季總榜) 改為 7 (近7場)，提升即時戰力參考價值 */
window.currentHomeFilter = 7;

// 🎯 【修復內鬼】這裡已經同步更新為有 sportKey 的新版邏輯！不會再覆蓋丟失賽事標籤了。
window.toggleUserPocket = function(expertName, btnElement, sportKey) {
    let pocketKey = sportKey ? `${expertName}||${sportKey}` : expertName;
    const idx = window.userPocket.indexOf(pocketKey);
    if (idx > -1) { 
        window.userPocket.splice(idx, 1); 
        btnElement.className = 'pocket-add-btn'; 
        btnElement.innerHTML = '➕ 收錄寶庫'; 
    } else { 
        window.userPocket.push(pocketKey); 
        btnElement.className = 'pocket-add-btn saved'; 
        btnElement.innerHTML = '⭐ 已存寶庫'; 
    }
    localStorage.setItem('UserPocketDB', JSON.stringify(window.userPocket));
    if (typeof window.updatePocketWidget === 'function') window.updatePocketWidget(); 
};

if (typeof dailyUpdates !== 'undefined') {
    dailyUpdates.forEach(([expert, sport, date, wl, net]) => {
        if (!window.dataDB[expert]) window.dataDB[expert] = {};
        if (!window.dataDB[expert][sport]) window.dataDB[expert][sport] = [];
        let isDuplicate = window.dataDB[expert][sport].some(r => r[0] === date && r[1] === wl && r[2] === net);
        if (!isDuplicate) window.dataDB[expert][sport].unshift([date, wl, net]); 
    });
    const currentYear = new Date().getFullYear();
    for (let exp in window.dataDB) { for (let sp in window.dataDB[exp]) { window.dataDB[exp][sp].sort((a, b) => { const parseDate = (dStr) => { let d = new Date(`${currentYear}/${dStr}`); if (d.getMonth() === 11 && new Date().getMonth() <= 2) d.setFullYear(currentYear - 1); return d.getTime(); }; return parseDate(b[0]) - parseDate(a[0]); }); } }
}
localStorage.setItem(DB_KEY, JSON.stringify(window.dataDB));

window.toggleIndexMode = function(mode) {
    window.isNegativeMode = (mode === 'neg');
    if (window.isNegativeMode) document.body.classList.add('mode-neg');
    else document.body.classList.remove('mode-neg');
    window.init();
};

window.init = function() {
    const grid = document.getElementById('expertGrid'); 
    const podiumArea = document.getElementById('podiumArea');
    const targetSport = window.activeSportKey || "nba_team"; 
    let systemLatestDate = window.getSystemLatestDate(targetSport); 
    let rankedList = [];

    for (let name in window.dataDB) {
        let records = window.dataDB[name][targetSport] || []; 
        if (records.length === 0) continue;
        let diffDays = window.getDaysDiff(records[0][0], systemLatestDate); 
        let isActive = diffDays <= 3;
        let sliceRec = window.currentHomeFilter === 'all' ? records : records.slice(0, window.currentHomeFilter);
        let net = sliceRec.reduce((sum, r) => sum + parseInt(r[2] || 0), 0);
        rankedList.push({ name, net, isActive });
    }

    rankedList.sort((a, b) => { 
        if (a.isActive && !b.isActive) return -1; 
        if (!a.isActive && b.isActive) return 1; 
        return window.isNegativeMode ? (a.net - b.net) : (b.net - a.net); 
    });

    if(podiumArea) {
        podiumArea.innerHTML = ''; 
        const top3 = rankedList.slice(0, 3); 
        const order = [1, 0, 2]; 
        order.forEach(i => {
            if (top3[i] && top3[i].isActive) { 
                const exp = top3[i]; 
                const isActiveSelect = window.selectedExperts.includes(exp.name) ? 'active' : '';
                const card = document.createElement('div'); 
                card.className = `podium-card rank-${i + 1} ${isActiveSelect}`;
                card.setAttribute('data-name', exp.name);
                card.style.animationDelay = window.isNegativeMode ? `${(i + 1) * 0.1}s` : '0s';
                card.innerHTML = `<div class="rank-number">RANK ${i + 1}</div><span class="rank-crown">${window.isNegativeMode ? '🪄' : (i===0?'👑':(i===1?'🥈':'🥉'))}</span><div class="name" style="font-size:20px; display:flex; align-items:center; justify-content:center;">${exp.name} ${window.getPickTooltipHtml(exp.name)}</div><span class="rank-net">${exp.net >= 0 ? '+' : ''}${exp.net} <span style="font-size:14px;">注</span></span><div style="font-size:12px; color:#64748b; margin-top:5px;">${itemNames[targetSport] || '紀錄'}</div>`;
                card.onclick = () => window.toggleExpert(exp.name, card); 
                podiumArea.appendChild(card);
            }
        });
    }

    if(grid) {
        grid.innerHTML = ''; 
        const theRest = rankedList.slice(3);
        theRest.forEach((exp, idx) => {
            const card = document.createElement('div'); 
            const isActiveSelect = window.selectedExperts.includes(exp.name) ? 'active' : ''; 
            card.className = `expert-card ${isActiveSelect}`;
            card.setAttribute('data-name', exp.name);
            card.style.animationDelay = window.isNegativeMode ? `${(idx * 0.1) + 0.4}s` : '0s';
            
            if (exp.isActive) {
                card.innerHTML = `<div style="font-size:11px; color:#94a3b8; margin-bottom:5px;">NO.${idx + 4}</div><div class="name" style="display:flex; align-items:center; justify-content:center;">${exp.name} ${window.getPickTooltipHtml(exp.name)}</div><span class="badge" style="color:#1877f2;">淨值 ${exp.net >= 0 ? '+' : ''}${exp.net}</span>`;
            } else {
                card.classList.add('sleep-card');
                card.innerHTML = `<div class="sleep-icon">zZzZ</div><div class="sleep-text" style="font-size:11px; margin-bottom:5px;">無近期數據</div><span class="name" style="display:flex; align-items:center; justify-content:center;">${exp.name}</span><span class="badge">💤 休眠中</span>`;
            }
            card.onclick = () => window.toggleExpert(exp.name, card); 
            grid.appendChild(card);
        });
    }

    let toggleDiv = document.getElementById('modeToggle');
    if (!toggleDiv) {
        toggleDiv = document.createElement('div');
        toggleDiv.id = 'modeToggle';
        toggleDiv.className = 'mode-toggle-wrapper';
        const podium = document.getElementById('podiumArea');
        if(podium) podium.parentNode.insertBefore(toggleDiv, podium);
    }
    if(toggleDiv) {
        toggleDiv.innerHTML = `
            <div class="toggle-btn ${!window.isNegativeMode ? 'active-pos' : ''}" onclick="window.toggleIndexMode('pos')">📈 正向動能排行</div>
            <div class="toggle-btn ${window.isNegativeMode ? 'active-neg' : ''}" onclick="window.toggleIndexMode('neg')">🪄 反轉魔法排行</div>
        `;
    }

const tabs = document.getElementById('tabContainer');
    if (tabs && tabs.innerHTML === '') {
const categories = [ 
            { name: '🏀 美籃 NBA', items: [ { id: 'nba_team', label: 'NBA 讓分盤' }, { id: 'nba_total', label: 'NBA 大小分' }, { id: 'nba_team_total', label: 'NBA 單隊大小' }, { id: 'nba_team_spread', label: 'NBA 單隊讓盤' }, { id: 'nba_1h_total', label: 'NBA 上半大小' } ] }, 
            { name: '⚾ 美棒 MLB', items: [ { id: 'mlb_ml', label: 'MLB 獨贏(正常)' }, { id: 'mlb_runline', label: 'MLB 讓分盤' }, { id: 'mlb_total', label: 'MLB 大小分' }, { id: 'mlb_ml_high', label: 'MLB 高賠獨贏' } ] },
            { name: '🇯🇵 日棒 NPB', items: [ { id: 'npb_runline', label: '日棒讓分' }, { id: 'npb_ml', label: '日棒獨贏' }, { id: 'npb_total', label: '日棒大小' }, { id: 'npb_1h_runline', label: '日棒上半讓分' }, { id: 'npb_1h_ml', label: '日棒上半獨贏' }, { id: 'npb_1h_total', label: '日棒上半大小' } ] },
            { name: '⚽ 足球系列', items: [ { id: 'soccer_team', label: '足球隊伍' }, { id: 'soccer_total', label: '足球大小分' }, { id: 'soccer_ml', label: '足球獨贏' }, { id: 'soccer_btts', label: '足球兩隊進球' }, { id: 'soccer_corner_total', label: '足球角球大小' }, { id: 'soccer_corner_ml', label: '足球角球PK' } ] },
            { name: '🏒 冰球系列', items: [ { id: 'nhl_ml', label: '冰球獨贏(含加時)' }, { id: 'nhl_ml_reg', label: '冰球獨贏(不含加時)' }, { id: 'nhl_spread_ot', label: '冰球讓盤(含加時)' }, { id: 'nhl_spread_reg', label: '冰球讓盤(不含加時)' }, { id: 'nhl_total_ot', label: '冰球大小(含加時)' }, { id: 'nhl_total_reg', label: '冰球大小(不含加時)' }, { id: 'khl_team', label: '俄冰隊伍' }, { id: 'khl_total', label: '俄冰大小分' } ] },
            { name: '🌏 亞洲/歐籃', items: [ { id: 'euro_team', label: '歐籃隊伍' }, { id: 'euro_total', label: '歐籃大小' }, { id: 'euro_1h', label: '歐籃上半' }, { id: 'nbl_team', label: '澳籃隊伍' }, { id: 'nbl_total', label: '澳籃大小' }, { id: 'jp_team', label: '日籃隊伍' }, { id: 'kbl_team', label: '韓籃隊伍' }, { id: 'kbl_total', label: '韓籃大小' }, { id: 'cba_team', label: '中籃隊伍' }, { id: 'cba_total', label: '中籃大小' } ] }, 
            { name: '🎮 電競系列', items: [ { id: 'lol_team', label: '電競隊伍' }, { id: 'lol_total', label: '電競大小' } ] }
        ];
        categories.forEach(cat => {
            const wrapper = document.createElement('div'); wrapper.className = 'dropdown-wrapper';
            wrapper.innerHTML = `<div class="category-btn">${cat.name}</div><div class="dropdown-content"></div>`;
            const content = wrapper.querySelector('.dropdown-content'); cat.items.forEach(item => window.appendTab(item.id, item.label, content)); tabs.appendChild(wrapper);
        });
    }
    if(typeof window.updateTabHighlights === 'function') window.updateTabHighlights();
};

window.appendTab = function(key, label, container) { const btn = document.createElement('label'); btn.className = `sport-tab`; btn.id = `l-${key}`; btn.innerHTML = label; btn.onclick = () => window.selectSport(key, btn); container.appendChild(btn); };
window.selectSport = function(key, el) {
    if (window.activeSportKey === key) { window.activeSportKey = ""; el.classList.remove('active'); } 
    else { window.activeSportKey = key; document.querySelectorAll('#tabContainer .sport-tab').forEach(t => t.classList.remove('active')); el.classList.add('active'); }
    window.init(); if (document.getElementById('details').style.display === 'block') window.renderDisplay();
};
window.toggleExpert = function(n, el) { 
    const i = window.selectedExperts.indexOf(n);
    if(i > -1) { window.selectedExperts.splice(i, 1); document.querySelectorAll(`[data-name="${n}"]`).forEach(c => c.classList.remove('active')); } 
    else { window.selectedExperts.push(n); if(el) el.classList.add('active'); } 
    if (typeof window.updateTabHighlights === 'function') window.updateTabHighlights();
    if (document.getElementById('details').style.display === 'block') window.renderDisplay();
};

window.init();


/* ============================================================== */
/* ==== 補充電線：好手賽事發光特效模組 ==== */
/* ============================================================== */
window.updateTabHighlights = function() {
    const tabs = document.querySelectorAll('#tabContainer .sport-tab');
    const categories = document.querySelectorAll('#tabContainer .dropdown-wrapper');
    
    // 1. 如果沒有選擇任何好手，恢復全部預設狀態 (不亮也不灰)
    if (window.selectedExperts.length === 0) {
        tabs.forEach(t => { t.classList.remove('tab-highlight', 'tab-dimmed'); });
        categories.forEach(c => { 
            const btn = c.querySelector('.category-btn');
            if (btn) btn.classList.remove('tab-highlight', 'tab-dimmed'); 
        });
        return;
    }

    // 2. 收集目前選中的好手，他們「有預測資料」的所有賽事 Key
    let activeKeys = new Set();
    window.selectedExperts.forEach(name => {
        if (window.dataDB[name]) {
            for (let key in window.dataDB[name]) {
                if (window.dataDB[name][key] && window.dataDB[name][key].length > 0) {
                    activeKeys.add(key);
                }
            }
        }
    });

    // 3. 更新各個小標籤的狀態
    tabs.forEach(tab => {
        // 從 tab 的 id (例如 'l-nba_team') 取出賽事 key ('nba_team')
        let sportKey = tab.id.replace('l-', '');
        
        if (activeKeys.has(sportKey)) {
            tab.classList.add('tab-highlight');
            tab.classList.remove('tab-dimmed');
        } else {
            tab.classList.add('tab-dimmed');
            tab.classList.remove('tab-highlight');
        }
    });

    // 4. 更新外層大分類按鈕的狀態 (只要底下有任何一個子項目發光，母按鈕就跟著發光)
    categories.forEach(wrapper => {
        const btn = wrapper.querySelector('.category-btn');
        const hasActiveChild = wrapper.querySelector('.tab-highlight');
        if (btn) {
            if (hasActiveChild) {
                btn.classList.add('tab-highlight');
                btn.classList.remove('tab-dimmed');
            } else {
                btn.classList.add('tab-dimmed');
                btn.classList.remove('tab-highlight');
            }
        }
    });
};