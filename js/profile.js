document.addEventListener("DOMContentLoaded", () => {
    
    // Resolve dynamically against Relational Array
    const activeEmail = localStorage.getItem("currentUser");
    const usersDB = JSON.parse(localStorage.getItem("usersDB") || "[]");
    const childData = usersDB.find(u => u.email === activeEmail);
    
    const profileBox = document.getElementById('profileContent');

    if (!childData) {
        profileBox.innerHTML = `
            <h3>Session Timeout</h3>
            <p>Please log in securely.</p>
            <br/>
            <button class="btn" onclick="window.location.href='login.html'">Login</button>
        `;
    } else {
        const allergies = childData.allergies.length > 0 ? childData.allergies.join(", ") : "None";
        let sub = localStorage.getItem("userPlan") || "Free";
        
        profileBox.innerHTML = `
            <div style="text-align:left; background:#fff; padding:20px; border-radius:15px;">
                <h3 style="color:#ff7aa2; margin-bottom:10px;">${childData.name}</h3>
                <p><strong>Parent Email:</strong> ${childData.email}</p>
                <p><strong>Age:</strong> ${childData.age}</p>
                <p><strong>Dietary Preference:</strong> <span style="text-transform:capitalize;">${childData.diet}</span></p>
                <p><strong>Allergies:</strong> ${allergies}</p>
                <hr style="margin:15px 0; border:1px solid #eee;">
                <p><strong>Current Plan:</strong> ${sub.toUpperCase()}</p>
            </div>
            <button class="btn" id="logoutBtn" style="background:#444; margin-top:20px;">Secure Logout</button>
        `;

        document.getElementById("logoutBtn").addEventListener("click", () => {
            localStorage.removeItem("currentUser");
            window.location.href = "index.html";
        });
    }
});
