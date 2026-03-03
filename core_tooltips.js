/* ============================================================== */
/* ==== 【組件 B：智能 Tooltip - core_tooltips.js】 ==== */
/* ============================================================== */

// 🎯 [核心新增] 將切西瓜邏輯獨立成全域共用工具
window.filterPickText = function(rawText, sportKey) {
    if (!rawText) return '';
    let textToProcess = rawText.replace(/<br\s*[\/]?>/gi, '\n');
    let finalContent = '';

    if (sportKey !== "") {
        const itemNames = {
            "nba_team": "NBA 讓分盤", "nba_total": "NBA 大小分",
            "mlb_ml": "MLB 獨贏(正常)", "mlb_runline": "MLB 讓分盤", "mlb_total": "MLB 大小分", "mlb_ml_high": "MLB 高賠獨贏",
            "nhl_ml": "冰球獨贏(含加時)", "nhl_ml_reg": "冰球獨贏(不含加時)", "nhl_spread_ot": "冰球讓盤(含加時)", "nhl_spread_reg": "冰球讓盤(不含加時)", "nhl_total_ot": "冰球大小(含加時)", "nhl_total_reg": "冰球大小(不含加時)", "khl_team": "俄冰隊伍", "khl_total": "俄冰大小分",
            "soccer_team": "足球隊伍", "soccer_total": "足球大小分", "soccer_ml": "足球獨贏", "soccer_btts": "足球兩隊進球",
            "euro_team": "歐籃隊伍", "euro_total": "歐籃大小", "cba_team": "中籃隊伍", "kbl_team": "韓籃隊伍", "kbl_total": "韓籃大小", "nbl_team": "澳籃隊伍",
            "lol_team": "電競隊伍", "lol_total": "電競大小"
        };
        
        let targetHeader = itemNames[sportKey];
        let allHeaders = Object.values(itemNames);
        let hasAnyHeader = allHeaders.some(h => textToProcess.includes(h));
        
        if (hasAnyHeader && targetHeader && textToProcess.includes(targetHeader)) {
            let lines = textToProcess.split('\n');
            let outputLines = [];
            let isMatchingBlock = false;
            
            for (let line of lines) {
                let textLine = line.trim();
                if (!textLine) continue;
                
                let isAnyHeader = allHeaders.some(h => textLine.includes(h));
                let isTargetHeader = textLine.includes(targetHeader);
                
                if (isTargetHeader) {
                    isMatchingBlock = true;
                    outputLines.push(`<span style="color:#fbbf24; font-weight:bold;">[${textLine}]</span>`);
                } else if (isAnyHeader) {
                    isMatchingBlock = false;
                } else {
                    if (isMatchingBlock) outputLines.push(line);
                }
            }
            if (outputLines.length > 0) finalContent = outputLines.join('<br>');
            else return ''; 
            
        } else if (hasAnyHeader) {
            return '';
        } else {
            finalContent = textToProcess.replace(/\n/g, '<br>');
        }
    } else { 
        finalContent = textToProcess.replace(/\n/g, '<br>'); 
    }
    return finalContent;
};

window.getPickTooltipHtml = function(name) {
    if (typeof todayPicks === 'undefined') return '';
    
    let rawText = "";
    if (Array.isArray(todayPicks)) {
        const found = todayPicks.find(p => p[0] === name);
        if (found) rawText = found[1] || "";
    } else {
        rawText = todayPicks[name] || "";
    }
    
    if (!rawText) return '';

    let sportKey = window.activeSportKey || "";
    let finalContent = window.filterPickText(rawText, sportKey);

    if (!finalContent || !finalContent.trim()) return '';
    
    // 🎯 【關鍵升級 1】建立專屬的「聯合鑰匙」 (名字 + 賽事)，精準比對是否收錄
    let pocketKey = sportKey ? `${name}||${sportKey}` : name;
    let isSaved = window.userPocket.includes(pocketKey);
    
    let btnText = isSaved ? '⭐ 已收錄' : '➕ 收錄口袋';
    let btnClass = isSaved ? 'pocket-add-btn saved' : 'pocket-add-btn';
    
    // 🎯 【關鍵升級 2】將 sportKey 傳送給收錄按鈕，讓它記住當下是在哪個賽事
    return `<div class="pick-tooltip-container"><span class="pick-icon" onclick="event.stopPropagation(); window.toggleMobileTooltip(this);" title="點擊查看今日推薦">💬</span><div class="pick-tooltip"><div class="pick-content">${finalContent}</div><div class="pocket-btn-wrapper"><button class="${btnClass}" onclick="event.stopPropagation(); window.toggleUserPocket('${name}', this, '${sportKey}')">${btnText}</button></div></div></div>`;
};

window.toggleMobileTooltip = function(iconElement) { document.querySelectorAll('.pick-tooltip.show-mobile').forEach(el => { if (el !== iconElement.nextElementSibling) el.classList.remove('show-mobile'); }); iconElement.nextElementSibling.classList.toggle('show-mobile'); };
document.addEventListener('click', (e) => { if(!e.target.closest('.pick-icon') && !e.target.closest('.pick-tooltip')) { document.querySelectorAll('.pick-tooltip.show-mobile').forEach(el => el.classList.remove('show-mobile')); } });