function injectFooter(isLoggedIn = false) {
    const currentPath = window.location.pathname.toLowerCase();
    const isDashboard = currentPath.includes("dashboard.html");
    const isAuthPage = currentPath.includes("login.html") || currentPath.includes("signup.html") || currentPath.includes("onboarding.html");

    // Don't show footer on onboarding/auth pages for clean UX
    if (isAuthPage) return;

    // Clean up any existing footers
    document.querySelectorAll("footer").forEach(f => f.remove());

    const footer = document.createElement("footer");
    
    // Logic: Determine if CTA should show
    let topBlockHtml = "";
    
    if (isDashboard) {
        topBlockHtml = ""; 
    } else {
        const ctaText = isLoggedIn ? "Ready to check today's plan?" : "Start your child’s healthy journey";
        const ctaSub = isLoggedIn ? "Your dashboard is updated with the latest nutritional insights." : "Join parents making nutrition smarter and easier every morning.";
        const btnText = isLoggedIn ? "Go to Dashboard" : "Get Started Free";
        const btnLink = isLoggedIn ? "dashboard.html" : "onboarding.html";

        topBlockHtml = `
            <div class="footer-cta-premium">
                <div class="cta-content">
                    <h3>${ctaText}</h3>
                    <p>${ctaSub}</p>
                </div>
                <a href="${btnLink}" class="btn-footer-pink">${btnText}</a>
            </div>
        `;
    }

    footer.innerHTML = `
        <div class="footer-inner">
            ${topBlockHtml}

            <div class="footer-grid">
                <div class="footer-col">
                    <h2 class="footer-logo">TiffinGenie</h2>
                    <p class="footer-tagline">Smart AI-powered nutrition for the next generation. Healthy meals, stress-free mornings.</p>
                    <div class="footer-social-circles">
                        <a href="#">f</a>
                        <a href="#">t</a>
                        <a href="#">i</a>
                    </div>
                </div>

                <div class="footer-col">
                    <h3 class="footer-heading">QUICK LINKS</h3>
                    <ul class="footer-links">
                        <li><a href="index.html">Home</a></li>
                        <li><a href="about.html">About Us</a></li>
                        <li><a href="how-it-works.html">How It Works</a></li>
                        <li><a href="pricing.html">Pricing</a></li>
                    </ul>
                </div>

                <div class="footer-col">
                    <h3 class="footer-heading">PRODUCT</h3>
                    <ul class="footer-links">
                        <li><a href="dashboard.html">Dashboard</a></li>
                        <li><a href="recipes.html">View Recipes</a></li>
                        <li><a href="login.html">Login</a></li>
                        <li><a href="contact.html">Support</a></li>
                    </ul>
                </div>

                <div class="footer-col">
                    <h3 class="footer-heading">CONTACT</h3>
                    <div class="footer-contact-info">
                        <p>📧 hello@tiffingenie.com</p>
                        <p>📍 Mumbai, India</p>
                        <div class="system-status">
                            <span class="status-dot"></span> All Systems Operational
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="footer-bottom-bar">
            <p>© 2026 TiffinGenie | Built for Modern Parents</p>
            <div style="display:flex; gap:20px; align-items:center;">
                <a href="admin.html" class="portal-link">Owner Portal</a>
            </div>
        </div>

        <style>
            footer { background: #0f172a; color: #f8fafc; padding-top: 60px; margin-top: 80px; }
            .footer-inner { max-width: 1200px; margin: 0 auto; padding: 0 5%; }
            
            .footer-cta-premium {
                background: rgba(255,255,255,0.03);
                border: 1px solid rgba(255,255,255,0.1);
                border-radius: 30px;
                padding: 40px 60px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 60px;
                backdrop-filter: blur(10px);
            }
            .cta-content h3 { font-family: 'Fredoka'; font-size: 32px; margin-bottom: 8px; color: white; }
            .cta-content p { color: #94a3b8; font-size: 16px; }
            
            .btn-footer-pink {
                background: #ff7aa2;
                color: white;
                padding: 14px 35px;
                border-radius: 50px;
                text-decoration: none;
                font-weight: 700;
                transition: 0.3s;
                box-shadow: 0 10px 20px rgba(255,122,162,0.3);
            }
            .btn-footer-pink:hover { transform: translateY(-3px); box-shadow: 0 15px 30px rgba(255,122,162,0.4); }

            .footer-grid { display: grid; grid-template-columns: 1.5fr 1fr 1fr 1.2fr; gap: 40px; padding-bottom: 60px; }
            .footer-logo { font-family: 'Fredoka'; font-size: 32px; color: white; margin-bottom: 15px; }
            .footer-tagline { color: #94a3b8; font-size: 14px; line-height: 1.6; max-width: 280px; }
            
            .footer-heading { color: #ff7aa2; font-size: 14px; font-weight: 800; letter-spacing: 1.5px; margin-bottom: 25px; }
            .footer-links { list-style: none; }
            .footer-links li { margin-bottom: 12px; }
            .footer-links a { color: #cbd5e1; text-decoration: none; transition: 0.2s; font-size: 15px; }
            .footer-links a:hover { color: #ff7aa2; padding-left: 5px; }
            
            .footer-social-circles { display: flex; gap: 15px; margin-top: 25px; }
            .footer-social-circles a {
                width: 40px; height: 40px; background: rgba(255,255,255,0.05); border-radius: 50%;
                display: flex; align-items: center; justify-content: center; color: white; text-decoration: none;
                font-weight: 700; transition: 0.3s; border: 1px solid rgba(255,255,255,0.1);
            }
            .footer-social-circles a:hover { background: #ff7aa2; transform: translateY(-5px); border-color: transparent; }
            
            .footer-contact-info p { color: #cbd5e1; font-size: 15px; margin-bottom: 10px; }
            .system-status { margin-top: 15px; font-size: 13px; color: #64748b; display: flex; align-items: center; gap: 8px; }
            .status-dot { width: 8px; height: 8px; background: #10b981; border-radius: 50%; box-shadow: 0 0 10px #10b981; }
            
            .footer-bottom-bar {
                border-top: 1px solid rgba(255,255,255,0.05); padding: 30px 5%;
                display: flex; justify-content: space-between; align-items: center;
                color: #64748b; font-size: 13px;
            }
            .portal-link { color: #475569; text-decoration: none; transition: 0.2s; }
            .portal-link:hover { color: #ff7aa2; }

            @media (max-width: 968px) {
                .footer-grid { grid-template-columns: 1fr 1fr; }
                .footer-cta-premium { flex-direction: column; text-align: center; gap: 25px; padding: 40px 30px; }
            }
            @media (max-width: 600px) {
                .footer-grid { grid-template-columns: 1fr; text-align: center; }
                .footer-tagline { margin: 0 auto 20px; }
                .footer-social-circles { justify-content: center; }
            }
        </style>
    `;
    const placeholder = document.getElementById("footer-placeholder");
    if (placeholder) {
        placeholder.innerHTML = "";
        placeholder.appendChild(footer);
    } else {
        document.body.appendChild(footer);
    }
}

window.updateFooter = (isLoggedIn) => { injectFooter(isLoggedIn); };
document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    injectFooter(!!token);
});

