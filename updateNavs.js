const fs = require('fs');
const path = require('path');

const newNav = `<nav style="display:flex; justify-content:space-between; align-items:center; padding:15px 5%; background:white; position:sticky; top:0; z-index:100; box-shadow:0 2px 10px rgba(0,0,0,0.05);">
  <div style="flex:1;">
    <h2 onclick="window.location.href='index.html'" style="font-family:'Fredoka', sans-serif; color:#ff7aa2; cursor:pointer; margin:0; font-size:24px;">TiffinGenie</h2>
  </div>

  <div style="flex:2; display:flex; justify-content:center;">
    <ul style="display:flex; gap:25px; list-style:none; padding:0; margin:0;">
      <li><a href="index.html" style="color:#444; font-weight:500; text-decoration:none;">Home</a></li>
      <li><a href="about.html" style="color:#444; font-weight:500; text-decoration:none;">About Us</a></li>
      <li><a href="pricing.html" style="color:#444; font-weight:500; text-decoration:none;">Pricing</a></li>
      <li><a href="how-it-works.html" style="color:#444; font-weight:500; text-decoration:none;">How It Works</a></li>
      <li><a href="dashboard.html" style="color:#444; font-weight:500; text-decoration:none;">Dashboard</a></li>
      <li><a href="contact.html" style="color:#444; font-weight:500; text-decoration:none;">Contact</a></li>
    </ul>
  </div>

  <div id="navUserSection" style="flex:1; display:flex; justify-content:flex-end; align-items:center; gap:15px; min-width:240px;">
    <!-- JS Session dynamically injects identity states here -->
    <a href="login.html" style="color:#6aa9ff; font-weight:600; text-decoration:none;">Login</a>
    <a href="onboarding.html" class="btn" style="padding:10px 20px; background:linear-gradient(45deg,#ff7aa2,#ff4d88); color:white; border-radius:20px; text-decoration:none; font-weight:600;">Get Started</a>
  </div>
</nav>`;

const htmlFiles = fs.readdirSync(__dirname).filter(f => f.endsWith('.html'));

htmlFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace anything between <nav> and </nav> including multiline
  content = content.replace(/<nav\b[^>]*>[\s\S]*?<\/nav>/, newNav);
  
  fs.writeFileSync(file, content);
  console.log('Updated Navbar inside:', file);
});
