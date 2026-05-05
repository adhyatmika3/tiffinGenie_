function injectNavbar() {
    const navbarPlaceholder = document.getElementById("navbar-placeholder");
    if (!navbarPlaceholder) return;

    navbarPlaceholder.innerHTML = `
        <nav>
            <div class="nav-container">
                <div class="nav-logo-section">
                    <h2 onclick="window.location.href='index.html'">TiffinGenie</h2>
                </div>
                <ul>
                    <li><a href="index.html" id="nav-home">Home</a></li>
                    <li><a href="dashboard.html" id="nav-dashboard">Dashboard</a></li>
                    <li><a href="about.html" id="nav-about">About Us</a></li>
                    <li><a href="how-it-works.html" id="nav-how">How It Works</a></li>
                    <li><a href="recipes.html" id="nav-recipes">Recipes</a></li>
                    <li><a href="pricing.html" id="nav-pricing">Pricing</a></li>
                    <li><a href="contact.html" id="nav-contact">Contact</a></li>
                </ul>
                <div id="navUserSection"></div>
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
        "recipes.html": "nav-recipes",
        "contact.html": "nav-contact"
    };

    const activeId = links[currentPath];
    if (activeId) {
        const activeLink = document.getElementById(activeId);
        if (activeLink) activeLink.classList.add("active");
    }
}

// Automatically inject on load
document.addEventListener("DOMContentLoaded", injectNavbar);
