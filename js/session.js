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

// Session Management & Auth State Handler
async function initSession() {
    // Wait for Navbar to be injected by navbar.js
    let userPanel = document.getElementById("navUserSection");
    
    // Poll for navbar injection if not immediately available
    let attempts = 0;
    while (!userPanel && attempts < 10) {
        await new Promise(r => setTimeout(r, 50));
        userPanel = document.getElementById("navUserSection");
        attempts++;
    }

    if (!userPanel) return;

    // Check localStorage first (works without backend)
    const userProfile = localStorage.getItem("userProfile");
    const userEmail = localStorage.getItem("userEmail");
    const token = localStorage.getItem("token");

    if (userProfile || token) {
        // User is logged in (either via backend token or localStorage profile)
        let displayName = "User";

        if (userProfile) {
            try {
                const profile = JSON.parse(userProfile);
                displayName = profile.name || profile.email?.split("@")[0] || "User";
            } catch (e) {}
        } else if (userEmail) {
            displayName = userEmail.split("@")[0];
        }

        // Try backend validation (optional, non-blocking)
        if (token) {
            try {
                const response = await fetch("http://localhost:5000/api/auth/me", {
                    method: "GET",
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    const activeProfile = await response.json();
                    displayName = activeProfile.email?.split("@")[0] || displayName;
                    console.log("[SESSION] Backend verified:", displayName);
                }
            } catch (err) {
                console.warn("[SESSION] Backend unreachable, using localStorage identity");
            }
        }

        // Render authenticated UI
        renderAuthUI(displayName);
        injectMessageModal();
        checkAdminReplies();
        if (window.updateFooter) window.updateFooter(true);
    } else {
        // Guest state
        renderGuestUI();
        if (window.updateFooter) window.updateFooter(false);
    }

    function renderAuthUI(name) {
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
                    <button onclick="toggleUserDropdown()" style="display:flex; align-items:center; gap:8px; background:#fff; border:1px solid #e5e7eb; padding:8px 16px; border-radius:50px; cursor:pointer; font-family:'Poppins'; font-size:14px; color:#374151; transition:0.2s;" onmouseover="this.style.borderColor='#ff7aa2'">
                        <span>👋 Hi, ${name}</span>
                        <span style="font-size:10px;">▼</span>
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
                
                /* Small Toggle for Dropdown */
                .switch-small { position: relative; display: inline-block; width: 34px; height: 18px; }
                .switch-small input { opacity: 0; width: 0; height: 0; }
                .slider-small { position: absolute; cursor: pointer; inset: 0; background-color: #e5e7eb; transition: .4s; border-radius: 34px; }
                .slider-small:before { position: absolute; content: ""; height: 12px; width: 12px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; }
                input:checked + .slider-small { background-color: #ff7aa2; }
                input:checked + .slider-small:before { transform: translateX(16px); }
            </style>
        `;
        
        // Sync toggle state
        setTimeout(() => {
            const rem = localStorage.getItem("prepRemindersEnabled") === "true";
            const toggle = document.getElementById("navPrepToggle");
            if (toggle) toggle.checked = rem;
        }, 100);
    }

    window.toggleUserDropdown = function() {
        const dd = document.getElementById("navUserDropdown");
        if (dd) dd.style.display = dd.style.display === "none" ? "block" : "none";
    };

    // Close dropdown on outside click
    window.addEventListener("click", function(e) {
        if (!e.target.closest(".user-dropdown-container")) {
            const dd = document.getElementById("navUserDropdown");
            if (dd) dd.style.display = "none";
        }
    });

    function renderGuestUI() {
        userPanel.innerHTML = `
            <a href="login.html" class="nav-link-secondary">Login</a>
            <a href="recipes.html" class="nav-btn nav-btn-primary">View Recipes</a>
        `;
    }
}

// ─── GLOBAL NOTIFICATION LOGIC ──────────────────────────────────────────────
function injectMessageModal() {
    if (document.getElementById("messageModal")) return;
    const html = `
        <div id="messageModal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.45);z-index:99999;justify-content:center;align-items:center; font-family:'Poppins', sans-serif;">
            <div class="modal-box" style="background:#fff;border-radius:22px;padding:30px;width:100%;max-width:500px;margin:20px;box-shadow:0 24px 60px rgba(0,0,0,0.18);max-height:85vh;display:flex;flex-direction:column; animation: modalIn 0.3s ease;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-shrink:0;">
                    <h3 style="font-family:'Fredoka';font-size:26px;margin:0;color:#111827;">📬 Messages from Admin</h3>
                    <button onclick="closeMessageModal()" style="background:none;border:none;font-size:26px;cursor:pointer;color:#9ca3af;line-height:1;padding:0;">×</button>
                </div>
                <div id="messageModalContent" style="overflow-y:auto;padding-right:10px;">
                    <!-- Content injected via JS -->
                </div>
            </div>
        </div>
        <style>
            @keyframes modalIn { from { opacity:0; transform:scale(0.9); } to { opacity:1; transform:scale(1); } }
        </style>
    `;
    const div = document.createElement("div");
    div.innerHTML = html;
    document.body.appendChild(div);
}

window.openMessageModal = function() {
    var profileRaw = localStorage.getItem("userProfile");
    var email = profileRaw ? JSON.parse(profileRaw).email : localStorage.getItem("userEmail");
    if (!email) return;
    
    var container = document.getElementById("messageModalContent");
    var feedbacks = JSON.parse(localStorage.getItem("siteFeedbacks") || "[]");
    var myReplies = feedbacks.filter(f => f.email === email && f.adminReply);
    
    if (myReplies.length === 0) {
        container.innerHTML = "<div style='text-align:center; padding:40px; color:#6b7280;'>No new messages from Admin.</div>";
    } else {
        var html = "";
        myReplies.forEach(r => {
            html += `
                <div style="background:#f9fafb; padding:20px; border-radius:18px; border:1px solid #f0f0f0; margin-bottom:15px;">
                    <div style="font-size:11px; color:#9ca3af; font-weight:700; text-transform:uppercase; margin-bottom:10px;">${r.replyDate || 'Recently'}</div>
                    <div style="margin-bottom:12px; font-size:14px; color:#6b7280; border-left:3px solid #ff7aa2; padding-left:12px;">
                        <strong>Your Inquiry:</strong> "${r.subject}"
                    </div>
                    <div style="font-size:15px; color:#111827; line-height:1.5;">
                        <strong>Genie Team:</strong> ${r.adminReply}
                    </div>
                </div>
            `;
        });
        container.innerHTML = html;
    }
    
    document.getElementById("navNotifBadge").style.display = "none";
    localStorage.setItem("notif_lastSeen_" + email, feedbacks.length);
    document.getElementById("messageModal").style.display = "flex";
};

window.closeMessageModal = function() {
    document.getElementById("messageModal").style.display = "none";
};

window.checkAdminReplies = function() {
    var profileRaw = localStorage.getItem("userProfile");
    var email = profileRaw ? JSON.parse(profileRaw).email : localStorage.getItem("userEmail");
    if (!email) return;
    
    var feedbacks = JSON.parse(localStorage.getItem("siteFeedbacks") || "[]");
    var myReplies = feedbacks.filter(f => f.email === email && f.adminReply);
    var lastSeen = localStorage.getItem("notif_lastSeen_" + email) || 0;
    
    var badge = document.getElementById("navNotifBadge");
    if (badge && myReplies.length > 0 && feedbacks.length > parseInt(lastSeen)) {
        badge.innerText = myReplies.length;
        badge.style.display = "flex";
    }
};

// Handle clicks outside modal
window.addEventListener("click", function(e) {
    var mm = document.getElementById("messageModal");
    if (mm && e.target === mm) closeMessageModal();
});

// Global logout function
window.handleLogout = () => {
    console.log("[SESSION] Logging out, clearing all data");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userProfile");
    localStorage.removeItem("weeklyPlan");
    localStorage.removeItem("currentChildId");
    window.location.href = "login.html";
};

document.addEventListener("DOMContentLoaded", initSession);
