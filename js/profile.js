document.addEventListener("DOMContentLoaded", () => {
    console.log("[PROFILE] Initializing...");
    
    const profileBox = document.getElementById('profileContent');
    if (!profileBox) return;

    // Use standardized keys
    const userProfileRaw = localStorage.getItem("userProfile");
    const token = localStorage.getItem("token");

    if (!userProfileRaw) {
        profileBox.innerHTML = `
            <h3>No Profile Found</h3>
            <p>Please log in or set up your child's profile.</p>
            <br/>
            <button class="btn" onclick="window.location.href='login.html'">Login</button>
            <button class="btn" style="background:#6aa9ff;" onclick="window.location.href='onboarding.html'">Setup Profile</button>
        `;
    } else {
        try {
            const profile = JSON.parse(userProfileRaw);
            const allergies = (profile.allergies && profile.allergies.length > 0) ? profile.allergies.join(", ") : "None";
            const sub = localStorage.getItem("userPlan") || "Free";
            
            profileBox.innerHTML = `
                <div style="text-align:left; background:#fff; padding:20px; border-radius:15px; box-shadow:0 4px 15px rgba(0,0,0,0.05);">
                    <h3 style="color:#ff7aa2; margin-bottom:15px; font-family:'Fredoka'; font-size:24px;">${profile.childName || profile.name}</h3>
                    <div style="line-height:1.8; color:#4b5563;">
                        <p><strong>Parent Email:</strong> ${profile.email}</p>
                        <p><strong>Child's Age:</strong> ${profile.age}</p>
                        <p><strong>Dietary Preference:</strong> <span style="text-transform:capitalize;">${profile.diet}</span></p>
                        <p><strong>Allergies:</strong> ${allergies}</p>
                        <p><strong>Preferred Cuisine:</strong> <span style="text-transform:capitalize;">${profile.cuisine || "Indian"}</span></p>
                    </div>
                    <hr style="margin:20px 0; border:0; border-top:1px solid #eee;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <p><strong>Current Plan:</strong> <span style="color:#6aa9ff; font-weight:700;">${sub.toUpperCase()}</span></p>
                        <button class="btn" style="padding:6px 15px; font-size:12px; background:#6aa9ff;" onclick="window.location.href='pricing.html'">Upgrade</button>
                    </div>
                </div>
                <div style="margin-top:30px; display:flex; gap:10px; justify-content:center;">
                    <button class="btn" style="background:#f3f4f6; color:#4b5563;" onclick="window.location.href='onboarding.html'">Edit Profile</button>
                    <button class="btn" id="logoutBtn" style="background:#ef4444;">Logout</button>
                </div>
            `;

            document.getElementById("logoutBtn").addEventListener("click", () => {
                if (window.handleLogout) {
                    window.handleLogout();
                } else {
                    localStorage.clear();
                    window.location.href = "login.html";
                }
            });
        } catch (e) {
            console.error("[PROFILE] Error parsing profile:", e);
            profileBox.innerHTML = "<p>Error loading profile. Please try logging in again.</p>";
        }
    }
});
