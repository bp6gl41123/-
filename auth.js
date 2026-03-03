/* ========================================== */
/* ==== 【開發模組：雙軌金鑰驗證 - auth.js】 ==== */
/* ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    const savedKey = sessionStorage.getItem('verifiedKey');
    
    if (typeof config !== 'undefined' && savedKey) {
        try {
            // 自動恢復權限狀態
            if (savedKey === atob(config.adminCode)) {
                window.isAdmin = true;
                unlockSystem();
            } else if (savedKey === atob(config.memberCode)) {
                window.isAdmin = false;
                unlockSystem();
            }
        } catch (e) {
            console.warn("自動登入失敗，請重新輸入密鑰");
            sessionStorage.removeItem('verifiedKey');
        }
    }
});

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
            // 保留高級震動特效
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

function unlockSystem() {
    const authGate = document.getElementById('authGate');
    const mainContent = document.getElementById('mainContent');
    if (authGate) authGate.style.display = 'none';
    if (mainContent) mainContent.style.display = 'block';
    
    if (typeof window.init === 'function') {
        window.init();
    }
}

// 支援 Enter 鍵
document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && document.getElementById('authGate').style.display !== 'none') {
        checkPasscode();
    }
});