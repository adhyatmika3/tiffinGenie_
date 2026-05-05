function injectFooter(isLoggedIn = false) {
    const body = document.querySelector("body");
    const currentPath = window.location.pathname.toLowerCase();
    const isDashboard = currentPath.includes("dashboard.html");

    // Clean up any existing footers
    document.querySelectorAll("footer").forEach(f => f.remove());

    const footer = document.createElement("footer");
    
    // Logic: Determine if CTA should show
    let topBlockHtml = "";
    
    if (isDashboard) {
        // No CTA on dashboard. No container, no spacing hacks.
        topBlockHtml = ""; 
    } else if (isLoggedIn) {
        topBlockHtml = `
            <div class="footer-cta" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); margin-bottom: 40px;">
                <div>
                    <h3 style="color: white;">Ready to check today's plan?</h3>
                    <p style="color: #9ca3af;">Your dashboard is updated with the latest nutritional insights.</p>
                </div>
                <a href="dashboard.html" class="btn-primary" style="padding: 12px 30px;">Go to Dashboard</a>
            </div>
        `;
    } else {
        topBlockHtml = `
            <div class="footer-cta" style="margin-bottom: 40px;">
                <div>
                    <h3 style="color: white;">Start your child’s healthy journey</h3>
                    <p style="color: rgba(255,255,255,0.8);">Join parents making nutrition smarter and easier every morning.</p>
                </div>
                <a href="onboarding.html" class="btn-primary" style="background: white; color: #ff7aa2; padding: 12px 30px;">Get Started</a>
            </div>
        `;
    }

    footer.innerHTML = `
        <div class="container" style="padding: 0; margin-bottom: 40px;">
            ${topBlockHtml}
        </div>

        <div class="footer-container">
            <div class="footer-box">
                <h2 style="font-family: 'Fredoka'; font-size: 28px; margin-bottom: 12px; color: white;">TiffinGenie</h2>
                <p style="font-size: 14px; line-height: 1.6; color: #9ca3af; margin-bottom: 20px;">
                    Smart AI-powered nutrition for the next generation. Healthy meals, stress-free mornings.
                </p>
                <div class="footer-social">
                    <a href="#" aria-label="Facebook">f</a>
                    <a href="#" aria-label="Twitter">t</a>
                    <a href="#" aria-label="Instagram">i</a>
                </div>
            </div>

            <div class="footer-box">
                <h3>Quick Links</h3>
                <ul>
                    <li><a href="index.html">Home</a></li>
                    <li><a href="about.html">About Us</a></li>
                    <li><a href="how-it-works.html">How It Works</a></li>
                    <li><a href="pricing.html">Pricing</a></li>
                </ul>
            </div>

            <div class="footer-box">
                <h3>Product</h3>
                <ul>
                    <li><a href="dashboard.html">Dashboard</a></li>
                    <li><a href="onboarding.html">Get Started</a></li>
                    <li><a href="login.html">Login</a></li>
                    <li><a href="contact.html">Support</a></li>
                </ul>
            </div>

            <div class="footer-box">
                <h3>Contact</h3>
                <p style="font-size: 14px; color: #9ca3af; margin-bottom: 8px;">📧 hello@tiffingenie.com</p>
                <p style="font-size: 14px; color: #9ca3af;">📍 Mumbai, India</p>
                <div style="margin-top: 15px; font-size: 12px; color: #4b5563;">
                    <span style="color: #00ff88; margin-right: 5px;">●</span> All Systems Operational
                </div>
            </div>
        </div>

        <div class="footer-bottom" style="display:flex; justify-content:space-between; align-items:center; padding: 20px 8%; border-top: 1px solid rgba(255,255,255,0.05);">
            <p>© 2026 TiffinGenie | Smart Nutrition for Kids</p>
            <a href="admin.html" style="font-size: 11px; color: #374151; text-decoration: none; opacity: 0.5; transition: 0.2s;" onmouseover="this.style.opacity='1'; this.style.color='#ff7aa2'" onmouseout="this.style.opacity='0.5'; this.style.color='#374151'">Owner Portal</a>
        </div>
    `;
    body.appendChild(footer);
}

window.updateFooter = (isLoggedIn) => {
    injectFooter(isLoggedIn);
};

document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    injectFooter(!!token);
});
