/* ============================================================== */
/* ==== 【組件 B：智能 Tooltip - core_tooltips.js】 ==== */
/* ============================================================== */

window.getPickTooltipHtml = function(name) {
    if (typeof todayPicks === 'undefined' || !todayPicks[name]) return '';
    let rawText = todayPicks[name];
    let sportKey = window.activeSportKey || "";
    let finalContent = ""; 
    rawText = rawText.replace(/<br\s*[\/]?>/gi, '\n');
    if (sportKey !== "") {
        let targetKeywords = [];
        if (sportKey.includes('nba')) targetKeywords = ['nba', '籃', '🏀'];
        else if (sportKey.includes('mlb')) targetKeywords = ['mlb', '棒', '⚾'];
        else if (sportKey.includes('soccer')) targetKeywords = ['足', '⚽', '英超', '西甲'];
        else if (sportKey.includes('nhl') || sportKey.includes('khl')) targetKeywords = ['冰', '🏒', 'nhl', 'khl'];
        else if (['euro','nbl','jp','kbl','cba'].some(k => sportKey.includes(k))) targetKeywords = ['籃', '🏀'];
        else if (sportKey.includes('lol')) targetKeywords = ['電競', '🎮', 'lol'];
        let allCategoryRegex = /(nba|mlb|nhl|khl|⚽|🏒|🏀|⚾|🎮|美籃|美棒|足球|冰球|籃|棒|電競)/i;
        if (allCategoryRegex.test(rawText) && targetKeywords.length > 0) {
            let targetRegex = new RegExp("(" + targetKeywords.join('|') + ")", "i");
            let lines = rawText.split('\n');
            let outputLines = [];
            let isMatchingBlock = false;
            for (let line of lines) {
                let textLine = line.trim();
                if (!textLine) continue; 
                let isCategoryHeader = allCategoryRegex.test(textLine);
                let isTargetHeader = targetRegex.test(textLine);
                if (isTargetHeader) { isMatchingBlock = true; outputLines.push(line); } 
                else if (isCategoryHeader) { isMatchingBlock = false; } 
                else { if (isMatchingBlock) outputLines.push(line); }
            }
            if (outputLines.length > 0) finalContent = outputLines.join('<br>');
            else return ''; 
        } else { finalContent = rawText.replace(/\n/g, '<br>'); }
    } else { finalContent = rawText.replace(/\n/g, '<br>'); }
    if (!finalContent.trim()) return '';
    let isSaved = window.userPocket.includes(name);
    let btnText = isSaved ? '⭐ 已收錄' : '➕ 收錄口袋';
    let btnClass = isSaved ? 'pocket-add-btn saved' : 'pocket-add-btn';
    return `<div class="pick-tooltip-container"><span class="pick-icon" onclick="event.stopPropagation(); window.toggleMobileTooltip(this);" title="點擊查看今日推薦">💬</span><div class="pick-tooltip"><div class="pick-content">${finalContent}</div><div class="pocket-btn-wrapper"><button class="${btnClass}" onclick="event.stopPropagation(); window.toggleUserPocket('${name}', this)">${btnText}</button></div></div></div>`;
};

window.toggleMobileTooltip = function(iconElement) { document.querySelectorAll('.pick-tooltip.show-mobile').forEach(el => { if (el !== iconElement.nextElementSibling) el.classList.remove('show-mobile'); }); iconElement.nextElementSibling.classList.toggle('show-mobile'); };
document.addEventListener('click', (e) => { if(!e.target.closest('.pick-icon') && !e.target.closest('.pick-tooltip')) { document.querySelectorAll('.pick-tooltip.show-mobile').forEach(el => el.classList.remove('show-mobile')); } });