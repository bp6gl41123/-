/* ========================================== */
/* ==== 【開發模組：雙軌金鑰驗證 - auth.js】 ==== */
/* ==== (V15.0 7天次防護 + 點擊限制版) ==== */
/* ========================================== */

// 追蹤器狀態變數
let isRestrictedMode = false; // 是否進入限制模式
let validClickCount = 0;      // 記錄點擊次數
const MAX_CLICKS = 3;         // 允許的免費點擊次數
const FREE_DAYS_LIMIT = 7;    // 免費觀看天次數

document.addEventListener('DOMContentLoaded', () => {
    // 1. 檢查是否有已驗證的金鑰 (超級用戶或已解鎖成員直接放行)
    const savedKey = sessionStorage.getItem('verifiedKey');
    if (typeof config !== 'undefined' && savedKey) {
        if (savedKey === atob(config.adminCode) || savedKey === atob(config.memberCode)) {
            window.isAdmin = (savedKey === atob(config.adminCode));
            unlockSystem();
            return; 
        }
    }

    // 2. 啟動天次數追蹤
    trackVisitorDays();
});

function trackVisitorDays() {
    // 取得今天的本機日期字串，例如 "2026-03-06"
    const today = new Date().toLocaleDateString('en-CA'); 
    
    // 從 LocalStorage 拿取歷史紀錄，若無則預設為空陣列
    let visitedDays = JSON.parse(localStorage.getItem('qiJuVisitedDays')) || [];

    // 如果陣列裡沒有今天，代表是今天「第一次」上線，加進去帳本裡！
    if (!visitedDays.includes(today)) {
        visitedDays.push(today);
        localStorage.setItem('qiJuVisitedDays', JSON.stringify(visitedDays));
        console.log(`📅 新增登入天次！目前已累積使用：${visitedDays.length} 天`);
    } else {
        console.log(`📅 今日已記錄。目前累積使用：${visitedDays.length} 天`);
    }

    // 判斷是否超過 7 天
    if (visitedDays.length > FREE_DAYS_LIMIT) {
        isRestrictedMode = true;
        console.log(`🚨 已超過 ${FREE_DAYS_LIMIT} 天免費額度！啟動點擊限制模式。`);
    }
}

// 3. 全域點擊監聽 (Capture 階段，確保比其他點擊事件早觸發)
document.addEventListener('click', (e) => {
    // 如果還沒被限制，或者已經解鎖，直接放行
    if (!isRestrictedMode) return;

    // 如果點擊的是金鑰彈窗本身（輸入密碼、按按鈕），不計算在內，直接放行
    if (e.target.closest('#authGate')) return;

    // 增加有效點擊次數 (純滑動網頁不會算進去)
    validClickCount++;
    console.log(`🖱️ 限制模式 - 第 ${validClickCount} 次點擊`);

    // 第 4 次點擊，強制阻斷並跳出金鑰視窗
    if (validClickCount > MAX_CLICKS) {
        e.preventDefault();  // 阻斷超連結
        e.stopPropagation(); // 阻斷卡片展開或按鈕功能
        triggerLockdown();
    }
}, true); // true 代表優先攔截

// 觸發封鎖彈窗與 Scatter Fly-In 動畫
function triggerLockdown() {
    const authGate = document.getElementById('authGate');
    const authBox = document.querySelector('.auth-box');
    
    if (authGate && authBox) {
        // 動態修改彈窗文案，增加威嚇感與行動呼籲
        const title = authBox.querySelector('h1');
        const subtitle = authBox.querySelector('p');
        if(title) title.innerHTML = "⚠️ 試用額度已滿";
        if(subtitle) subtitle.innerHTML = "您的 7 天免費使用權限已達上限！<br>請截圖此畫面並私訊版大索取今日專屬金鑰。";

        // 加入動畫 class 並顯示
        authGate.classList.add('scatter-fly-in');
    }
}

// 密碼驗證邏輯
function checkPasscode() {
    const userInput = document.getElementById('passcodeInput').value;
    const errorMsg = document.getElementById('errorMsg');
    
    try {
        const ADMIN_KEY = atob(config.adminCode); 
        const MEMBER_KEY = atob(config.memberCode);

        if (userInput === ADMIN_KEY) {
            window.isAdmin = true;
            sessionStorage.setItem('verifiedKey', ADMIN_KEY);
            unlockSystem();
        } else if (userInput === MEMBER_KEY) {
            window.isAdmin = false;
            sessionStorage.setItem('verifiedKey', MEMBER_KEY);
            unlockSystem();
        } else {
            errorMsg.style.display = 'block';
            const authBox = document.querySelector('.auth-box');
            if (authBox) {
                // 密碼錯誤的高級震動特效
                authBox.style.transform = 'translateX(10px)';
                setTimeout(() => authBox.style.transform = 'translateX(-10px)', 100);
                setTimeout(() => authBox.style.transform = 'translateX(0)', 200);
            }
        }
    } catch (e) {
        alert("系統密鑰配置錯誤，請聯絡開發端檢查 config.js");
    }
}

// 解鎖系統並移除限制
function unlockSystem() {
    const authGate = document.getElementById('authGate');
    if (authGate) {
        authGate.classList.remove('scatter-fly-in');
        authGate.style.display = 'none'; // 隱藏視窗
    }

    // 解除點擊限制，讓他可以正常瀏覽
    isRestrictedMode = false;
    validClickCount = 0;

    // 啟動管理員功能
    if (window.isAdmin === true) {
        if (typeof window.initAdminWidget === 'function') window.initAdminWidget();
        if (typeof window.initBackupWidget === 'function') window.initBackupWidget();
    }

    if (typeof window.init === 'function') {
        window.init();
    }
}

// 支援 Enter 鍵輸入密碼
document.addEventListener('keypress', (e) => {
    const authGate = document.getElementById('authGate');
    if (authGate && e.key === 'Enter' && authGate.classList.contains('scatter-fly-in')) {
        checkPasscode();
    }
});