function injectNavbar() {
    const navbarPlaceholder = document.getElementById("navbar-placeholder");
    if (!navbarPlaceholder) return;

    // Hardcoded Admin Emails for Handover Security
    const ADMIN_EMAILS = [
        'owner@tiffingenie.com',
        'admin@tiffingenie.com',
        'adhyatmika3@gmail.com'
    ];

    const userEmail = localStorage.getItem("userEmail");
    let userRole = localStorage.getItem("userRole");

    // Force Admin role if email matches (Failsafe)
    if (userEmail && ADMIN_EMAILS.includes(userEmail.toLowerCase())) {
        userRole = "admin";
        localStorage.setItem("userRole", "admin");
    }

    console.log("[NAVBAR] Detected Role:", userRole);
    const adminLink = userRole === "admin" ? '<li><a href="admin.html" id="nav-admin" style="color:#6aa9ff; font-weight:700;">⚙️ Admin</a></li>' : '';

    navbarPlaceholder.innerHTML = `
        <nav>
            <div class="nav-container">
                <div class="nav-logo-section">
                    <h2 onclick="window.location.href='index.html'">TiffinGenie</h2>
                </div>
                <ul>
                    <li><a href="index.html" id="nav-home">Home</a></li>
                    <li><a href="about.html" id="nav-about">About Us</a></li>
                    <li><a href="pricing.html" id="nav-pricing">Pricing</a></li>
                    <li><a href="how-it-works.html" id="nav-how">How It Works</a></li>
                    <li><a href="dashboard.html" id="nav-dashboard">Dashboard</a></li>
                    ${adminLink}
                    <li><a href="contact.html" id="nav-contact">Contact</a></li>
                </ul>
                <div id="navUserSection">
                    <div style="display:flex; align-items:center; gap:20px;">
                        <a href="login.html" class="nav-link-secondary">Login</a>
                        <a href="onboarding.html" class="nav-btn nav-btn-primary">Get Started</a>
                    </div>
                </div>
            </div>
        </nav>
    `;

    // Highlight active link
    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    const links = {
        "index.html": "nav-home",
        "about.html": "nav-about",
        "how-it-works.html": "nav-how",
        "pricing.html": "nav-pricing",
        "dashboard.html": "nav-dashboard",
        "admin.html": "nav-admin",
        "recipes.html": "nav-recipes",
        "contact.html": "nav-contact"
    };

    const activeId = links[currentPath];
    if (activeId) {
        const activeLink = document.getElementById(activeId);
        if (activeLink) activeLink.classList.add("active");
    }
}

// Automatically inject immediately
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", injectNavbar);
} else {
    injectNavbar();
}
