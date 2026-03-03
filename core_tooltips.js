/* ============================================================== */
/* ==== 【組件 B：智能 Tooltip - core_tooltips.js】 ==== */
/* ============================================================== */

window.getPickTooltipHtml = function(name) {
    if (typeof todayPicks === 'undefined') return '';
    
    // 🎯 [大腦同步] 參照舊版 core_engine.js，支援物件與陣列雙格式
    let rawText = "";
    if (Array.isArray(todayPicks)) {
        const found = todayPicks.find(p => p[0] === name);
        if (found) rawText = found[1] || "";
    } else {
        rawText = todayPicks[name] || "";
    }
    
    if (!rawText) return '';

    let sportKey = window.activeSportKey || "";
    let finalContent = ""; 
rawText = rawText.replace(/<br\s*[\/]?>/gi, '\n');
    
    if (sportKey !== "") {
        // 1. 載入您的專屬賽事名稱字典
        const itemNames = {
            "nba_team": "NBA 讓分盤", "nba_total": "NBA 大小分",
            "mlb_ml": "MLB 獨贏(正常)", "mlb_runline": "MLB 讓分盤", "mlb_total": "MLB 大小分", "mlb_ml_high": "MLB 高賠獨贏",
            "nhl_ml": "冰球獨贏(含加時)", "nhl_ml_reg": "冰球獨贏(不含加時)", "nhl_spread_ot": "冰球讓盤(含加時)", "nhl_spread_reg": "冰球讓盤(不含加時)", "nhl_total_ot": "冰球大小(含加時)", "nhl_total_reg": "冰球大小(不含加時)", "khl_team": "俄冰隊伍", "khl_total": "俄冰大小分",
            "soccer_team": "足球隊伍", "soccer_total": "足球大小分", "soccer_ml": "足球獨贏", "soccer_btts": "足球兩隊進球",
            "euro_team": "歐籃隊伍", "euro_total": "歐籃大小", "cba_team": "中籃隊伍", "kbl_team": "韓籃隊伍", "kbl_total": "韓籃大小", "nbl_team": "澳籃隊伍",
            "lol_team": "電競隊伍", "lol_total": "電競大小"
        };
        
        let targetHeader = itemNames[sportKey]; // 抓出目前用戶停在哪個分頁
        let allHeaders = Object.values(itemNames); // 所有的賽事名稱
        
        // 判斷文字中是否有包含「任何」一個您的專屬賽事標題
        let hasAnyHeader = allHeaders.some(h => rawText.includes(h));
        
        if (hasAnyHeader && targetHeader && rawText.includes(targetHeader)) {
            // 🎯 進入精準切西瓜模式
            let lines = rawText.split('\n');
            let outputLines = [];
            let isMatchingBlock = false;
            
            for (let line of lines) {
                let textLine = line.trim();
                if (!textLine) continue;
                
                // 檢查這行是不是某個賽事標題
                let isAnyHeader = allHeaders.some(h => textLine.includes(h));
                let isTargetHeader = textLine.includes(targetHeader);
                
                if (isTargetHeader) {
                    isMatchingBlock = true; // 是目標標題，開始讀取！
                    outputLines.push(`<span style="color:#fbbf24; font-weight:bold;">[${textLine}]</span>`);
                } else if (isAnyHeader) {
                    isMatchingBlock = false; // 遇到別的賽事標題，關閉讀取！
                } else {
                    if (isMatchingBlock) outputLines.push(line); // 把推薦內容放進去
                }
            }
            if (outputLines.length > 0) finalContent = outputLines.join('<br>');
            else return ''; 
            
        } else if (hasAnyHeader) {
            // 文本裡有標題，但「沒有」當前頁面的標題 -> 隱藏泡泡 (不該在這裡出現)
            return '';
        } else {
            // 文本裡什麼標題都沒寫 (通用推薦) -> 全部顯示
            finalContent = rawText.replace(/\n/g, '<br>');
        }
    } else { 
        finalContent = rawText.replace(/\n/g, '<br>'); 
    }

    if (!finalContent.trim()) return '';
    let isSaved = window.userPocket.includes(name);
    let btnText = isSaved ? '⭐ 已收錄' : '➕ 收錄口袋';
    let btnClass = isSaved ? 'pocket-add-btn saved' : 'pocket-add-btn';
    return `<div class="pick-tooltip-container"><span class="pick-icon" onclick="event.stopPropagation(); window.toggleMobileTooltip(this);" title="點擊查看今日推薦">💬</span><div class="pick-tooltip"><div class="pick-content">${finalContent}</div><div class="pocket-btn-wrapper"><button class="${btnClass}" onclick="event.stopPropagation(); window.toggleUserPocket('${name}', this)">${btnText}</button></div></div></div>`;
};

window.toggleMobileTooltip = function(iconElement) { document.querySelectorAll('.pick-tooltip.show-mobile').forEach(el => { if (el !== iconElement.nextElementSibling) el.classList.remove('show-mobile'); }); iconElement.nextElementSibling.classList.toggle('show-mobile'); };
document.addEventListener('click', (e) => { if(!e.target.closest('.pick-icon') && !e.target.closest('.pick-tooltip')) { document.querySelectorAll('.pick-tooltip.show-mobile').forEach(el => el.classList.remove('show-mobile')); } });