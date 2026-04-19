/* app.js */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

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

// Initialize Firebase here so 'app' is defined for this file!
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

async function checkAdminRole(uid) {
    const userDoc = await getDoc(doc(db, "users", uid));
    return userDoc.exists() && userDoc.data().role === "admin";
}

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

onAuthStateChanged(auth, async (user) => {
    if (user) {
        updateUIForUser(user);
        const isAdmin = await checkAdminRole(user.uid);
        if (isAdmin) showAdminLinks();
    } else {
        updateUIForVisitor();
    }
});


// 2. The Global Search Logic
window.handleGlobalSearch = function() {
    const query = document.getElementById('global-search').value.toLowerCase().trim();
    if (query.length > 1) {
        // Redirect to home page with search parameter
        window.location.href = `hotwheels.html?search=${encodeURIComponent(query)}`;
    }
};

// --- AUTH UI UPDATERS ---

function updateUIForUser(user) {
    const loginTrigger = document.getElementById('login-trigger');
    const userMenu = document.getElementById('user-menu-container');
    const userName = document.getElementById('user-name');
    const userPic = document.getElementById('user-pic');

    if (loginTrigger) loginTrigger.style.display = 'none';
    if (userMenu) userMenu.style.display = 'block';
    if (userName) userName.innerText = user.displayName || user.email.split('@')[0];
    if (userPic) userPic.src = user.photoURL || 'https://via.placeholder.com/32';
}

function updateUIForVisitor() {
    const loginTrigger = document.getElementById('login-trigger');
    const userMenu = document.getElementById('user-menu-container');

    if (loginTrigger) loginTrigger.style.display = 'block';
    if (userMenu) userMenu.style.display = 'none';
}

function showAdminLinks() {
    const adminPlaceholder = document.getElementById('admin-only-links');
    if (adminPlaceholder) {
        adminPlaceholder.innerHTML = `
            <hr style="border: 0; border-top: 1px solid #eee;">
            <a href="addNewCar.html" style="display: block; padding: 10px; text-decoration: none; color: #FF9800; font-weight: bold; font-family: sans-serif;">
                ➕ Add New Car
            </a>
        `;
    }
}

// Add this so the "Log Out" button in your component works
window.handleLogout = () => {
    signOut(auth).then(() => {
        window.location.reload();
    });
};

// --- GLOBAL UI CONTROLS ---
// We attach these to 'window' so the HTML onclick can find them

window.openAuth = () => {
    const modal = document.getElementById('auth-modal');
    if (modal) modal.style.display = 'flex';
};

window.closeAuth = () => {
    const modal = document.getElementById('auth-modal');
    if (modal) modal.style.display = 'none';
};

// Toggle the User Dropdown
window.toggleUserMenu = (e) => {
    if (e) e.stopPropagation();
    const dd = document.getElementById('user-dropdown');
    if (dd) {
        dd.style.display = dd.style.display === 'none' ? 'block' : 'none';
    }
};

import { 
    signInWithPopup, 
    GoogleAuthProvider, 
    signInWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const googleProvider = new GoogleAuthProvider();

// Google Login Logic
window.handleGoogleLogin = async () => {
    try {
        await signInWithPopup(auth, googleProvider);
        window.closeAuth();
    } catch (e) {
        console.error("Google Login Error:", e);
        alert("Login failed. Check console.");
    }
};

// Email Login Logic
window.handleEmailLogin = async () => {
    const email = document.getElementById('auth-email').value;
    const pass = document.getElementById('auth-password').value;
    try {
        await signInWithEmailAndPassword(auth, email, pass);
        window.closeAuth();
    } catch (e) {
        alert("Error: " + e.message);
    }
};

// --- CLOSE USER DROPDOWN ON CLICK OUTSIDE ---
window.addEventListener('mousedown', (event) => {
    const dropdown = document.getElementById('user-dropdown');
    const userBtn = document.getElementById('user-btn');

    // If the dropdown exists and is currently visible
    if (dropdown && dropdown.style.display === 'block') {
        // Check if the click was NOT on the button and NOT inside the menu
        if (!userBtn.contains(event.target) && !dropdown.contains(event.target)) {
            dropdown.style.display = 'none';
        }
    }
});

import { arrayUnion, arrayRemove, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Centralized Toggle Logic
window.toggleOwnership = async function(type, carId, buttonElement) {
    const user = auth.currentUser;
    if (!user) {
        window.openAuth();
        return;
    }

    const userRef = doc(db, "users", user.uid);
    const isAdding = !buttonElement.classList.contains('active');

    try {
        await setDoc(userRef, {
            [type]: isAdding ? arrayUnion(carId) : arrayRemove(carId)
        }, { merge: true });

        // Update the specific button that was clicked
        window.updateButtonUI(buttonElement, type, isAdding);
    } catch (e) {
        console.error("Collection Error:", e);
    }
};

// Centralized UI Updater
window.updateButtonUI = function(btn, type, isActive) {
    if (!btn) return;
    btn.classList.toggle('active', isActive);

    // Check if it's a "mini" button or a "large" detail button
    const isLarge = btn.id.startsWith('btn-'); 

    if (type === 'collection') {
        if (isLarge) {
            btn.innerHTML = isActive ? "In Collection" : "Add to Collection";
        } else {
            btn.innerHTML = isActive ? "✅" : "➕";
        }
    } else {
        if (isLarge) {
            btn.innerHTML = isActive ? "In Wishlist" : "Add to Wishlist";
        } else {
            btn.innerHTML = isActive ? "❤️" : "🩶";
        }
    }
};

window.checkGridStatuses = async function() {
    const user = auth.currentUser;
    if (!user) return;

    try {
        const userSnap = await getDoc(doc(db, "users", user.uid));
        if (!userSnap.exists()) return;

        const userData = userSnap.data();
        const owned = userData.collection || [];
        const wish = userData.wishlist || [];

        const items = document.querySelectorAll('.car-item');
        items.forEach(item => {
            // Extracts the ID from the URL (e.g., carinfo.html?id=car-123 -> car-123)
            const id = item.getAttribute('href').split('id=')[1];
            const collBtn = item.querySelector('.collection-btn');
            const wishBtn = item.querySelector('.wishlist-btn');

            if (collBtn) window.updateButtonUI(collBtn, 'collection', owned.includes(id));
            if (wishBtn) window.updateButtonUI(wishBtn, 'wishlist', wish.includes(id));
        });
    } catch (e) {
        console.error("Error checking grid statuses:", e);
    }
};

// Automatically open login if the URL says so
if (new URLSearchParams(window.location.search).get('auth') === 'required') {
    setTimeout(() => {
        if (window.openAuth) window.openAuth();
    }, 500);
}