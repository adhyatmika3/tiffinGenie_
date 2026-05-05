// Global secureFetch helper to handle Auth tokens automatically
window.secureFetch = async (url, options = {}) => {
    const token = localStorage.getItem("token");
    const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {})
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    const fetchOptions = {
        ...options,
        headers
    };
    try {
        return await fetch(url, fetchOptions);
    } catch (err) {
        console.error("secureFetch Error:", err);
        throw err;
    }
};

let userPanel; // Globally accessible within session.js

// Session Management & Auth State Handler
async function initSession() {
    console.log("[SESSION] Initializing...");
    
    // Wait for Navbar to be injected by navbar.js
    let attempts = 0;
    while (!userPanel && attempts < 20) {
        userPanel = document.getElementById("navUserSection");
        if (!userPanel) {
            await new Promise(r => setTimeout(r, 100));
            attempts++;
        }
    }

    if (!userPanel) {
        console.error("[SESSION] Could not find navUserSection after 20 attempts");
        return;
    }

    // --- NEW STRICT AUTH CHECK ---
    const token = localStorage.getItem("token");
    const userProfileRaw = localStorage.getItem("userProfile");
    const userEmail = localStorage.getItem("userEmail");

    // Clear any potential "parent6" or junk if it's not a real session
    if (!token && !userProfileRaw && !userEmail) {
        console.log("[SESSION] No session found, rendering Guest UI");
        renderGuestUI();
        if (window.updateFooter) window.updateFooter(false);
        return;
    }

    let displayName = "User";
    let isActuallyLoggedIn = false;

    if (userProfileRaw) {
        try {
            const profile = JSON.parse(userProfileRaw);
            // Verify profile belongs to the current session email if possible
            if (!userEmail || profile.email === userEmail) {
                displayName = profile.parentName || profile.childName || profile.email?.split("@")[0] || "User";
                isActuallyLoggedIn = true;
            }
        } catch (e) {
            console.error("[SESSION] Corrupt userProfile found");
        }
    } else if (userEmail) {
        displayName = userEmail.split("@")[0];
        isActuallyLoggedIn = true;
    }

    if (isActuallyLoggedIn) {
        // Try backend validation in background (non-blocking)
        if (token) {
            fetch("http://127.0.0.1:5001/api/auth/me", {
                method: "GET",
                headers: { 'Authorization': `Bearer ${token}` }
            }).then(res => res.json())
            .then(data => {
                if (data && data.role) {
                    const oldRole = localStorage.getItem("userRole");
                    if (oldRole !== data.role) {
                        console.log("[SESSION] Syncing role:", data.role);
                        localStorage.setItem("userRole", data.role);
                        if (typeof injectNavbar === 'function') injectNavbar();
                    }
                }
                if (data && data._id) {
                     renderAuthUI(data.name || displayName);
                }
            }).catch(() => console.warn("[SESSION] Backend unreachable for verification"));
        }

        renderAuthUI(displayName);
        injectMessageModal();
        checkAdminReplies();
        if (window.updateFooter) window.updateFooter(true);
    } else {
        // Cleanup inconsistent state
        handleLogout(false); // Silent logout (don't redirect)
    }

    // Register PWA Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js')
            .then(() => console.log("[PWA] Service Worker Registered"))
            .catch(err => console.error("[PWA] Registration Failed:", err));
    }
}

function renderAuthUI(name) {
    if (!userPanel) return;
    userPanel.innerHTML = `
        <div style="display:flex; align-items:center; gap:15px; position:relative;">
            <!-- Notification Bell -->
            <div style="position: relative;">
                <button onclick="openMessageModal()" style="background:none; border:none; font-size:20px; cursor:pointer; color:#4b5563; display:flex; align-items:center; justify-content:center; padding:5px; border-radius:50%; transition:0.2s;" onmouseover="this.style.background='#f3f4f6'" onmouseout="this.style.background='none'">
                    🔔
                </button>
                <span id="navNotifBadge" style="display:none; position:absolute; top:-2px; right:-2px; background:#ef4444; color:white; border-radius:50%; width:16px; height:16px; font-size:9px; display:flex; justify-content:center; align-items:center; border:2px solid #fff; font-weight:bold;">0</span>
            </div>

            <!-- User Dropdown -->
            <div class="user-dropdown-container" style="position:relative;">
                <button onclick="toggleUserDropdown()" style="display:flex; align-items:center; gap:10px; background:#fff; border:1px solid #e5e7eb; padding:6px 14px; border-radius:50px; cursor:pointer; font-family:'Poppins'; font-size:14px; color:#374151; transition:0.2s; box-shadow:0 2px 5px rgba(0,0,0,0.03);" onmouseover="this.style.borderColor='#ff7aa2'; this.style.background='#fff0f5'">
                    <div style="width:32px; height:32px; background:var(--primary-gradient); border-radius:50%; display:flex; align-items:center; justify-content:center; color:white; font-weight:bold; font-size:14px; box-shadow:0 3px 8px rgba(255,122,162,0.3);">
                        ${name.charAt(0).toUpperCase()}
                    </div>
                    <div style="display:flex; flex-direction:column; align-items:flex-start; line-height:1.2;">
                        <span style="font-size:10px; color:#9ca3af; font-weight:600; text-transform:uppercase; letter-spacing:0.5px;">Parent Account</span>
                        <span style="font-weight:600; color:#111827;">Hi, ${name}</span>
                    </div>
                    <span style="font-size:10px; color:#9ca3af; margin-left:4px;">▼</span>
                </button>
                <div id="navUserDropdown" style="display:none; position:absolute; top:45px; right:0; background:#fff; min-width:220px; border-radius:18px; box-shadow:0 15px 40px rgba(0,0,0,0.12); border:1px solid #f0f0f0; overflow:hidden; z-index:10000; padding:10px 0;">
                    <a href="dashboard.html" class="dropdown-item">📊 My Dashboard</a>
                    <a href="recipes.html" class="dropdown-item">📖 Recipe Library</a>
                    <div style="padding:12px 20px; border-top:1px solid #f9fafb; border-bottom:1px solid #f9fafb; display:flex; align-items:center; justify-content:space-between;">
                        <span style="font-size:13px; color:#4b5563; font-weight:500;">Prep Alerts</span>
                        <label class="switch-small">
                            <input type="checkbox" id="navPrepToggle" onchange="window.togglePrepReminders(this.checked)">
                            <span class="slider-small"></span>
                        </label>
                    </div>
                    <a href="#" onclick="handleLogout()" class="dropdown-item" style="color:#ef4444;">🚪 Logout</a>
                </div>
            </div>
        </div>
        <style>
            .dropdown-item { display:block; padding:12px 20px; font-size:14px; color:#374151; text-decoration:none; transition:0.2s; font-weight:500; }
            .dropdown-item:hover { background:#fff0f5; color:#ff7aa2; }
            .switch-small { position: relative; display: inline-block; width: 34px; height: 18px; }
            .switch-small input { opacity: 0; width: 0; height: 0; }
            .slider-small { position: absolute; cursor: pointer; inset: 0; background-color: #e5e7eb; transition: .4s; border-radius: 34px; }
            .slider-small:before { position: absolute; content: ""; height: 12px; width: 12px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; }
            input:checked + .slider-small { background-color: #ff7aa2; }
            input:checked + .slider-small:before { transform: translateX(16px); }
        </style>
    `;
    setTimeout(() => {
        const rem = localStorage.getItem("prepRemindersEnabled") === "true";
        const toggle = document.getElementById("navPrepToggle");
        if (toggle) toggle.checked = rem;
    }, 100);
}

function renderGuestUI() {
    if (!userPanel) return;
    userPanel.innerHTML = `
        <div style="display:flex; align-items:center; gap:20px;">
            <a href="login.html" class="nav-link-secondary">Login</a>
            <a href="onboarding.html" class="nav-btn nav-btn-primary">Get Started</a>
        </div>
    `;
}

window.toggleUserDropdown = function() {
    const dd = document.getElementById("navUserDropdown");
    if (dd) dd.style.display = dd.style.display === "none" ? "block" : "none";
};

window.addEventListener("click", function(e) {
    if (!e.target.closest(".user-dropdown-container")) {
        const dd = document.getElementById("navUserDropdown");
        if (dd) dd.style.display = "none";
    }
});

window.togglePrepReminders = function(enabled) {
    localStorage.setItem("prepRemindersEnabled", enabled);
    if (enabled && "Notification" in window) {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                new Notification("Smart Alerts Enabled!", {
                    body: "We'll remind you every morning about your child's tiffin plan.",
                    icon: "https://cdn-icons-png.flaticon.com/512/3448/3448316.png"
                });
            }
        });
    }
};

function injectMessageModal() {
    if (document.getElementById("messageModal")) return;
    const html = `
        <div id="messageModal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.45);z-index:99999;justify-content:center;align-items:center; font-family:'Poppins', sans-serif;">
            <div class="modal-box" style="background:#fff;border-radius:22px;padding:30px;width:100%;max-width:500px;margin:20px;box-shadow:0 24px 60px rgba(0,0,0,0.18);max-height:85vh;display:flex;flex-direction:column; animation: modalIn 0.3s ease;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-shrink:0;">
                    <h3 style="font-family:'Fredoka';font-size:26px;margin:0;color:#111827;">📬 Messages from Admin</h3>
                    <button onclick="closeMessageModal()" style="background:none;border:none;font-size:26px;cursor:pointer;color:#9ca3af;line-height:1;padding:0;">×</button>
                </div>
                <div id="messageModalContent" style="overflow-y:auto;padding-right:10px;"></div>
            </div>
        </div>
        <style>@keyframes modalIn { from { opacity:0; transform:scale(0.9); } to { opacity:1; transform:scale(1); } }</style>
    `;
    const div = document.createElement("div");
    div.innerHTML = html;
    document.body.appendChild(div);
}

window.openMessageModal = async function() {
    var profileRaw = localStorage.getItem("userProfile");
    var email = profileRaw ? JSON.parse(profileRaw).email : localStorage.getItem("userEmail");
    if (!email) return;

    var container = document.getElementById("messageModalContent");
    const token = localStorage.getItem("token");

    try {
        const res = await fetch("http://127.0.0.1:5001/api/support/notifications", {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const myReplies = await res.json();
        
        if (myReplies.length === 0) {
            container.innerHTML = "<div style='text-align:center; padding:40px; color:#6b7280;'>No new messages from Admin.</div>";
        } else {
            var html = "";
            myReplies.forEach(r => {
                html += `
                    <div style="background:#f9fafb; padding:20px; border-radius:18px; border:1px solid #f0f0f0; margin-bottom:15px;">
                        <div style="font-size:11px; color:#9ca3af; font-weight:700; text-transform:uppercase; margin-bottom:10px;">Reply to your ticket</div>
                        <div style="margin-bottom:12px; font-size:14px; color:#6b7280; border-left:3px solid #ff7aa2; padding-left:12px;"><strong>Your Inquiry:</strong> "${r.message}"</div>
                        <div style="font-size:15px; color:#111827; line-height:1.5;"><strong>Genie Team:</strong> ${r.adminResponse}</div>
                    </div>
                `;
            });
            container.innerHTML = html;

            // Mark as read on the backend
            await fetch("http://127.0.0.1:5001/api/support/mark-read", {
                method: "POST",
                headers: { 'Authorization': `Bearer ${token}` }
            });
        }
        
        document.getElementById("navNotifBadge").style.display = "none";
        document.getElementById("messageModal").style.display = "flex";
    } catch (err) {
        console.error("Notification Error:", err);
        container.innerHTML = "<div style='text-align:center; padding:40px; color:#ef4444;'>Could not load messages.</div>";
        document.getElementById("messageModal").style.display = "flex";
    }
};

window.closeMessageModal = function() {
    document.getElementById("messageModal").style.display = "none";
};

window.checkAdminReplies = async function() {
    var profileRaw = localStorage.getItem("userProfile");
    var email = profileRaw ? JSON.parse(profileRaw).email : localStorage.getItem("userEmail");
    if (!email) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
        const res = await fetch("http://127.0.0.1:5001/api/support/notifications", {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const myReplies = await res.json();
        
        var badge = document.getElementById("navNotifBadge");
        if (badge && myReplies.length > 0) {
            badge.innerText = myReplies.length;
            badge.style.display = "flex";
        } else if (badge) {
            badge.style.display = "none";
        }
    } catch (err) {
        console.error("Check Replies Error:", err);
    }
};

window.handleLogout = (redirect = true) => {
    console.log("[SESSION] Clearing session...");
    
    // Clear ALL auth-related keys
    const keysToRemove = [
        "token", 
        "user", 
        "userEmail", 
        "userRole",
        "userProfile", 
        "weeklyPlan", 
        "currentChildId", 
        "mealFavorites", 
        "communityRecipes", 
        "customMeals",
        "prepRemindersEnabled",
        "siteFeedbacks",
        "adminAccess"
    ];
    
    keysToRemove.forEach(k => localStorage.removeItem(k));
    sessionStorage.clear(); // Extra safety

    if (redirect) {
        window.location.href = "login.html";
    } else {
        renderGuestUI();
    }
};

window.isProUser = function() {
    var profileRaw = localStorage.getItem("userProfile");
    if (!profileRaw) return false;
    return JSON.parse(profileRaw).isPro === true;
};

window.checkProAccess = function(featureName) {
    if (window.isProUser()) return true;
    document.getElementById("upgradeModalTitle").innerText = featureName;
    document.getElementById("upgradeModal").style.display = "flex";
    return false;
};

function injectUpgradeModal() {
    if (document.getElementById("upgradeModal")) return;
    const html = `
        <div id="upgradeModal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:999999;justify-content:center;align-items:center; font-family:'Poppins', sans-serif; backdrop-filter: blur(8px);">
            <div style="background:#fff;border-radius:30px;padding:50px;width:100%;max-width:500px;margin:20px;box-shadow:0 30px 80px rgba(0,0,0,0.3);text-align:center;">
                <div style="font-size:60px; margin-bottom:20px;">✨</div>
                <h2 style="font-family:'Fredoka'; font-size:32px; margin-bottom:10px; color:#111827;">Upgrade to Pro</h2>
                <p style="color:#6b7280; font-size:16px; margin-bottom:30px; line-height:1.6;"><strong><span id="upgradeModalTitle">This feature</span></strong> is exclusive to our Pro members.</p>
                <button onclick="triggerProUpgrade()" class="btn btn-primary" style="width:100%; padding:18px; border-radius:15px; font-weight:700;">Unlock All Pro Features</button>
                <button onclick="document.getElementById('upgradeModal').style.display='none'" style="background:none; border:none; color:#9ca3af; cursor:pointer; margin-top:15px;">Maybe Later</button>
            </div>
        </div>
    `;
    const div = document.createElement("div");
    div.innerHTML = html;
    document.body.appendChild(div);
}

window.triggerProUpgrade = function() {
    var profileRaw = localStorage.getItem("userProfile");
    if (!profileRaw) { window.location.href = "onboarding.html"; return; }
    var profile = JSON.parse(profileRaw);
    profile.isPro = true;
    localStorage.setItem("userProfile", JSON.stringify(profile));
    alert("Congratulations! You are now a PRO member. ✨");
    window.location.reload();
};

document.addEventListener("DOMContentLoaded", () => {
    initSession();
    injectUpgradeModal();
});
