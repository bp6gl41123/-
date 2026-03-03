/* ============================================================== */
/* ==== 【功能模組：口袋系統 - core_pocket.js】 ==== */
/* ============================================================== */

(function initPocketWidget() {
    if (!document.getElementById('pocketWidgetStyle')) {
        const style = document.createElement('style'); style.id = 'pocketWidgetStyle';
        style.innerHTML = `
            .floating-pocket-btn { position: fixed; top: 50%; right: -8px; transform: translateY(-50%); z-index: 9995; background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 22px 16px 22px 28px; border-radius: 45px 0 0 45px; font-weight: 900; cursor: pointer; box-shadow: -8px 8px 30px rgba(0,0,0,0.5); transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); display: flex; flex-direction: column; align-items: center; gap: 8px; border: 2px solid rgba(255,255,255,0.2); text-shadow: 0 2px 4px rgba(0,0,0,0.3); }
            .floating-pocket-btn:hover { right: 0; background: linear-gradient(135deg, #fbbf24, #f59e0b); padding-right: 22px; transform: translateY(-50%) scale(1.05); }
            .pocket-badge { background: #dc2626; color: white; border-radius: 50%; padding: 3px 10px; font-size: 14px; font-weight: 900; border: 2px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.4); position: relative; top: -5px; }
            .pocket-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.88); backdrop-filter: blur(15px); z-index: 10001; display: none; justify-content: center; align-items: center; opacity: 0; transition: 0.4s ease; }
            .pocket-modal-overlay.show { display: flex; opacity: 1; }
            .pocket-modal-content { background: #f8fafc; width: 92%; max-width: 550px; border-radius: 30px; overflow: hidden; box-shadow: 0 50px 120px rgba(0,0,0,0.8); transform: translateY(50px) scale(0.9); transition: 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
            .pocket-modal-overlay.show .pocket-modal-content { transform: translateY(0) scale(1); }
            .pocket-modal-header { background: linear-gradient(135deg, #1e293b, #0f172a); padding: 25px 35px; display: flex; justify-content: space-between; align-items: center; color: #fbbf24; border-bottom: 5px solid #fbbf24; }
            .pocket-list { max-height: 55vh; overflow-y: auto; padding: 15px 0; margin: 0; list-style: none; }
            .pocket-item { padding: 25px 35px; border-bottom: 1px solid #e2e8f0; animation: pocketItemIn 0.5s ease-out backwards; }
            @keyframes pocketItemIn { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
            .pocket-item-name { font-weight: 900; font-size: 24px; color: #0f172a; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; }
            .pocket-item-text { color: #334155; font-size: 16px; line-height: 1.8; background: white; padding: 20px; border-radius: 20px; border: 1px solid #cbd5e1; box-shadow: inset 0 3px 10px rgba(0,0,0,0.05); font-weight: 500; }
            .pocket-remove-btn { color: #dc2626; font-size: 14px; cursor: pointer; font-weight: bold; background: #fee2e2; padding: 8px 16px; border-radius: 10px; transition: 0.2s; border: 1px solid transparent; }
            .pocket-remove-btn:hover { background: #fca5a5; border-color: #ef4444; }
            .pocket-modal-footer { padding: 30px; text-align: center; background: white; border-top: 1px solid #e2e8f0; }
            .pocket-clear-btn { background: #f1f5f9; color: #64748b; border: 2px solid #cbd5e1; padding: 14px 35px; border-radius: 15px; cursor: pointer; font-weight: 900; transition: 0.3s; font-size: 16px; }
            .pocket-clear-btn:hover { background: #dc2626; color: white; border-color: #dc2626; transform: scale(1.05); }
        `; document.head.appendChild(style);
    }

    const floatBtn = document.createElement('div'); floatBtn.className = 'floating-pocket-btn';
    floatBtn.onclick = () => window.openPocketModal();
    document.body.appendChild(floatBtn);

    const overlay = document.createElement('div'); overlay.className = 'pocket-modal-overlay';
    overlay.innerHTML = `
        <div class="pocket-modal-content">
            <div class="pocket-modal-header">
                <h3 style="margin:0;font-size:24px;letter-spacing:1px;">📥 我的今日精選預測名單</h3>
                <div style="cursor:pointer;font-size:50px;line-height:1;" onclick="closePocketModal()">&times;</div>
            </div>
            <ul class="pocket-list" id="pocketListArea"></ul>
            <div class="pocket-modal-footer">
                <button class="pocket-clear-btn" onclick="clearPocket()">🗑️ 清空所有收錄預測單</button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    window.updatePocketWidget = () => {
        if (window.userPocket.length > 0) { 
            floatBtn.style.display = 'flex'; 
            floatBtn.innerHTML = `<span>📥</span><span style="font-size:14px;margin-top:5px;">預測</span><span style="font-size:14px;">收錄</span><span class="pocket-badge">${window.userPocket.length}</span>`; 
        } else { 
            floatBtn.style.display = 'none'; 
        }
    };

    window.openPocketModal = () => {
        const listArea = document.getElementById('pocketListArea'); listArea.innerHTML = '';
        if (window.userPocket.length === 0) { 
            listArea.innerHTML = '<div style="padding: 100px 20px; text-align: center; color: #94a3b8; font-weight:bold; font-size:20px;">您的預測口袋目前空空如也！<br><small style="font-weight:normal;">快去排行榜點擊「➕ 收錄口袋」吧！</small></div>'; 
        } else {
            window.userPocket.forEach((name, index) => {
                let pickText = (typeof todayPicks !== 'undefined' && todayPicks[name]) ? todayPicks[name].replace(/\n/g, '<br>') : '今日該好手尚未發布任何推薦';
                listArea.innerHTML += `
                <li class="pocket-item" style="animation-delay: ${index * 0.1}s;">
                    <div class="pocket-item-name">${name} <span class="pocket-remove-btn" onclick="window.removePocketItem('${name}')">移除</span></div>
                    <div class="pocket-item-text">${pickText}</div>
                </li>`;
            });
        }
        overlay.classList.add('show');
    };

    window.closePocketModal = () => overlay.classList.remove('show');
    
    window.removePocketItem = (name) => {
        const idx = window.userPocket.indexOf(name);
        if(idx > -1) { 
            window.userPocket.splice(idx, 1); 
            localStorage.setItem('UserPocketDB', JSON.stringify(window.userPocket)); 
            window.updatePocketWidget(); 
            window.openPocketModal(); 
            if (typeof window.renderDisplay === 'function') window.renderDisplay(); 
        }
    };

    window.clearPocket = () => {
        if(!confirm('🚨 確定要清空所有的收錄預測單嗎？')) return;
        window.userPocket = []; 
        localStorage.setItem('UserPocketDB', JSON.stringify(window.userPocket)); 
        window.updatePocketWidget(); 
        window.closePocketModal(); 
        if (typeof window.renderDisplay === 'function') window.renderDisplay();
    };

    window.updatePocketWidget();
})();/* ============================================================== */
/* ==== 【功能模組：口袋系統 - core_pocket.js】 ==== */
/* ============================================================== */

(function initPocketWidget() {
    if (!document.getElementById('pocketWidgetStyle')) {
        const style = document.createElement('style'); style.id = 'pocketWidgetStyle';
        style.innerHTML = `
            .floating-pocket-btn { position: fixed; top: 50%; right: -8px; transform: translateY(-50%); z-index: 9995; background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 22px 16px 22px 28px; border-radius: 45px 0 0 45px; font-weight: 900; cursor: pointer; box-shadow: -8px 8px 30px rgba(0,0,0,0.5); transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); display: flex; flex-direction: column; align-items: center; gap: 8px; border: 2px solid rgba(255,255,255,0.2); text-shadow: 0 2px 4px rgba(0,0,0,0.3); }
            /* ... 中間樣式代碼完全不變 ... */
            .pocket-clear-btn:hover { background: #dc2626; color: white; border-color: #dc2626; transform: scale(1.05); }
        `; document.head.appendChild(style);
    }
    /* ... 其餘浮動按鈕、彈窗渲染、更新邏輯、remove/clear 功能完整原裝移入 ... */
    /* 這裡省略顯示中間代碼，但實際文件中必須完整保留 */
})();
