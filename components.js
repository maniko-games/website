// components.js
export function injectSharedUI() {
    const headerHTML = `
        <header class="global-header">
            <div class="header-top">
                <a href="hotwheels.html" class="logo">Maniko HW DB</a>
                <div class="search-container">
                    <input type="text" id="global-search" placeholder="Search" oninput="handleGlobalSearch()" autocomplete="off">
                    <div id="search-dropdown"></div>
                </div>
                <div id="auth-section">
                    <button id="login-trigger" onclick="event.stopPropagation(); openAuth();" style="background: #2196F3; color: white; border: none; padding: 8px 15px; border-radius: 20px; cursor: pointer; font-weight: bold;">Login</button>
                    
                    <div id="user-menu-container" style="display: none; position: relative;">
                        <button id="user-btn" onclick="toggleUserMenu(event)" style="background: none; border: none; cursor: pointer; display: flex; align-items: center; gap: 8px;">
                            <img id="user-pic" src="" style="width: 32px; height: 32px; border-radius: 50%; background: #eee;">
                            <span id="user-name" style="font-weight: bold; color: #333;">Profile</span>
                        </button>
                        <div id="user-dropdown" style="display: none; position: absolute; top: 45px; right: 0; background: white; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); width: 180px; padding: 10px; z-index: 1001;">
                            <a href="my-collection.html" style="display: block; padding: 10px; text-decoration: none; color: #333;">🏠 My Collection</a>
                            <a href="my-collection.html?type=wishlist" style="display: block; padding: 10px; text-decoration: none; color: #333;">❤️ My Wishlist</a>
                            <div id="admin-only-links"></div>
                            <hr style="border: 0; border-top: 1px solid #eee;">
                            <button onclick="handleLogout()" style="width: 100%; text-align: left; background: none; border: none; padding: 10px; color: #e74c3c; cursor: pointer;">🚪 Log Out</button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    `;

    const modalHTML = `
        <div id="auth-modal"
            onclick="if(event.target === this) closeAuth()"
            style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 10000; justify-content: center; align-items: center;">
            
            <div style="background: white; padding: 30px; border-radius: 15px; width: 90%; max-width: 400px; position: relative; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.2);">
                <button onclick="closeAuth()" style="position: absolute; top: 10px; right: 15px; background: none; border: none; font-size: 24px; cursor: pointer; color: #999;">&times;</button>
                
                <h2 style="margin-top: 0; font-family: sans-serif;">Welcome Back</h2>
                
                <button onclick="handleGoogleLogin()" style="width: 100%; padding: 12px; margin-bottom: 20px; border: 1px solid #ddd; background: white; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; font-weight: bold; font-family: sans-serif;">
                    <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" width="18" height="18" alt="G"> 
                    Continue with Google
                </button>

                <div style="margin: 15px 0; color: #999; font-size: 0.8em; display: flex; align-items: center; gap: 10px; font-family: sans-serif;">
                    <hr style="flex-grow: 1; border: 0; border-top: 1px solid #eee;"> or <hr style="flex-grow: 1; border: 0; border-top: 1px solid #eee;">
                </div>

                <form onsubmit="event.preventDefault(); handleEmailLogin();">
                    <input 
                        type="email" 
                        id="auth-email" 
                        placeholder="Email" 
                        autocomplete="username" 
                        required 
                        style="width: 100%; padding: 12px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 8px; box-sizing: border-box; font-family: sans-serif;"
                    >
                    <input 
                        type="password" 
                        id="auth-password" 
                        placeholder="Password" 
                        autocomplete="current-password" 
                        required 
                        style="width: 100%; padding: 12px; margin-bottom: 20px; border: 1px solid #ddd; border-radius: 8px; box-sizing: border-box; font-family: sans-serif;"
                    >
                    
                    <button type="submit" style="width: 100%; padding: 12px; background: #2196F3; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; font-family: sans-serif;">Login</button>
                </form>
                
                <p style="font-size: 0.9em; color: #666; margin-top: 20px; font-family: sans-serif;">
                    Don't have an account? <a href="#" onclick="alert('Sign up coming soon!')" style="color: #2196F3; text-decoration: none; font-weight: bold;">Sign Up</a>
                </p>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('afterbegin', headerHTML);
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}