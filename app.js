/* app.js */

// 1. The font-shrinker you just perfected
export function adjustFontSizes() {
    const titles = document.querySelectorAll('#cars-grid h3');
    titles.forEach(title => {
        let fontSize = 1.0; 
        while (title.scrollHeight > title.offsetHeight && fontSize > 0.5) {
            fontSize -= 0.03;
            title.style.fontSize = fontSize + 'em';
        }
    });
}

// 2. The Global Search Logic
window.handleGlobalSearch = function() {
    const query = document.getElementById('global-search').value.toLowerCase().trim();
    if (query.length > 1) {
        // Redirect to home page with search parameter
        window.location.href = `hotwheels.html?search=${encodeURIComponent(query)}`;
    }
};

// 3. Your Firebase Config (shared across all pages)
export const firebaseConfig = {
    apiKey: "AIzaSyAkdQrNE0jswL4xfAEM4uHtHyzPwn2o3bU",
    authDomain: "maniko-hotwheels.firebaseapp.com",
    projectId: "maniko-hotwheels",
    storageBucket: "maniko-hotwheels.firebasestorage.app",
    messagingSenderId: "534387805003",
    appId: "1:534387805003:web:9b78747f3538b58194b6ce",
    measurementId: "G-V3WYKC0X1Q"
};