/* ========================================== */
/* ==== 【開發模組：雙軌金鑰驗證 - auth.js】 ==== */
/* ==== (V15.1 7天次防護 + 點擊限制版) ==== */
/* ========================================== */

let isRestrictedMode = false; 
let validClickCount = 0;      
const MAX_CLICKS = 3;         
const FREE_DAYS_LIMIT = 7;    

document.addEventListener('DOMContentLoaded', () => {
    // 1. 檢查是否有已驗證的超級金鑰
    const savedKey = sessionStorage.getItem('verifiedKey');
    if (typeof config !== 'undefined' && savedKey) {
        if (savedKey === atob(config.adminCode) || savedKey === atob(config.memberCode)) {
            window.isAdmin = (savedKey === atob(config.adminCode));
            fullUnlockSystem(); // 這是已經輸入過密碼的「完全解鎖」
            return; 
        }
    }

    // 2. 啟動天次數追蹤
    trackVisitorDays();

    // 3. 🌟 關鍵修正：一進來先幫訪客「開門」看畫面！
    // 不管他是第 1 天還是第 8 天，預設一進來都要能看見主畫面
    window.isAdmin = false;
    openDoorForVisitor(); 
});

// 紀錄與判斷天次數
function trackVisitorDays() {
    const today = new Date().toLocaleDateString('en-CA'); 
    let visitedDays = JSON.parse(localStorage.getItem('qiJuVisitedDays')) || [];

    if (!visitedDays.includes(today)) {
        visitedDays.push(today);
        localStorage.setItem('qiJuVisitedDays', JSON.stringify(visitedDays));
        console.log(`📅 新增登入天次！目前累積：${visitedDays.length} 天`);
    } else {
        console.log(`📅 今日已記錄。目前累積：${visitedDays.length} 天`);
    }

    if (visitedDays.length > FREE_DAYS_LIMIT) {
        isRestrictedMode = true; // 超過 7 天，啟動點擊限制！
        console.log(`🚨 已超過 7 天免費額度！啟動限制模式。`);
    }
}

// 全域點擊監聽 (攔截第 4 次點擊)
document.addEventListener('click', (e) => {
    if (!isRestrictedMode) return;
    if (e.target.closest('#authGate')) return;

    validClickCount++;
    console.log(`🖱️ 限制模式 - 第 ${validClickCount} 次點擊`);

    if (validClickCount > MAX_CLICKS) {
        e.preventDefault();  
        e.stopPropagation(); 
        triggerLockdown();
    }
}, true); 

// 第 4 次點擊觸發：關門放狗 (彈出金鑰視窗)
function triggerLockdown() {
    const authGate = document.getElementById('authGate');
    const authBox = document.querySelector('.auth-box');
    
    if (authGate && authBox) {
        // 動態修改彈窗文案
        const title = authBox.querySelector('h1');
        const subtitle = authBox.querySelector('p');
        if(title) title.innerHTML = "⚠️ 試用額度已滿";
        if(subtitle) subtitle.innerHTML = "您的 7 天免費使用權限已達上限！<br>請截圖此畫面並私訊版大索取今日專屬金鑰。";

        authGate.style.display = 'flex'; // 把視窗叫出來
        authGate.classList.add('scatter-fly-in'); // 加上碎裂飛入動畫
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
            fullUnlockSystem();
        } else if (userInput === MEMBER_KEY) {
            window.isAdmin = false;
            sessionStorage.setItem('verifiedKey', MEMBER_KEY);
            fullUnlockSystem();
        } else {
            errorMsg.style.display = 'block';
            const authBox = document.querySelector('.auth-box');
            if (authBox) {
                authBox.style.transform = 'translateX(10px)';
                setTimeout(() => authBox.style.transform = 'translateX(-10px)', 100);
                setTimeout(() => authBox.style.transform = 'translateX(0)', 200);
            }
        }
    } catch (e) {
        alert("系統密鑰配置錯誤，請聯絡開發端檢查 config.js");
    }
}

// 🌟 新增：專給一般訪客的「純開門」，不解除限制
function openDoorForVisitor() {
    const authGate = document.getElementById('authGate');
    const mainContent = document.getElementById('mainContent');
    
    if (authGate) authGate.style.display = 'none'; // 隱藏金鑰視窗
    if (mainContent) mainContent.style.display = 'block'; // 顯示主畫面

    if (typeof window.init === 'function') {
        window.init(); // 啟動齊聚眾選的資料渲染
    }
}

// 輸入正確密碼後的「完全解鎖」
function fullUnlockSystem() {
    const authGate = document.getElementById('authGate');
    const mainContent = document.getElementById('mainContent');
    
    if (authGate) {
        authGate.classList.remove('scatter-fly-in');
        authGate.style.display = 'none'; 
    }
    if (mainContent) mainContent.style.display = 'block';

    // 完全解除點擊限制
    isRestrictedMode = false;
    validClickCount = 0;

    // 啟動管理員專屬功能
    if (window.isAdmin === true) {
        if (typeof window.initAdminWidget === 'function') window.initAdminWidget();
        if (typeof window.initBackupWidget === 'function') window.initBackupWidget();
    }

    if (typeof window.init === 'function') {
        window.init();
    }
}

// 支援 Enter 鍵
document.addEventListener('keypress', (e) => {
    const authGate = document.getElementById('authGate');
    if (authGate && authGate.style.display !== 'none' && e.key === 'Enter') {
        checkPasscode();
    }
});