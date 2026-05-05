/* SCROLL REVEAL FUNCTIONALITY */
function scrollReveal() {
  const reveals = document.querySelectorAll(".reveal");
  const cards = document.querySelectorAll(".cards .card");
  const windowHeight = window.innerHeight;

  // Reveal generic .reveal elements
  reveals.forEach(el => {
    if(el.getBoundingClientRect().top < windowHeight - 100){
      el.classList.add("active");
    }
  });

  // Reveal cards with a stagger effect
  cards.forEach((card, index) => {
    if(card.getBoundingClientRect().top < windowHeight - 100){
      setTimeout(() => {
        card.classList.add("active");
      }, index * 200);
    }
  });
}

window.addEventListener("scroll", scrollReveal);
window.addEventListener("load", scrollReveal);

/* CANVAS PARTICLES ENGINE */
const canvas = document.getElementById("bgCanvas");
if (canvas) {
    const ctx = canvas.getContext("2d");

    let particles = [];
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
      constructor(){
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = 2;
        this.dx = (Math.random() - 0.5) * 0.4;
        this.dy = (Math.random() - 0.5) * 0.4;
      }
      update(){
        this.x += this.dx;
        this.y += this.dy;
        
        // Wrap around screen
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
      }
      draw(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,122,162,0.5)";
        ctx.fill();
      }
    }

    for(let i=0; i<25; i++){
      particles.push(new Particle());
    }

    function animate(){
      ctx.clearRect(0,0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animate);
    }

    animate();
}

/* ACTIVE NAV LINK HIGHLIGHTER */
document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Inject styling natively matching the exact pink UI aesthetic 
    // Including grid layout max constraints for Phase 2!
    const style = document.createElement('style');
    style.innerHTML = `
        nav ul a.active-link {
            color: #ff7aa2 !important;
            font-weight: 600 !important;
            border-bottom: 2px solid #ff7aa2;
            padding-bottom: 3px;
            transition: 0.3s;
        }
        .cards {
            display: grid !important;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)) !important;
            max-width: 1200px;
            margin: 0 auto;
        }
    `;
    document.head.appendChild(style);

    // 2. Extract current targeted window path
    let currentPath = window.location.pathname.split('/').pop();
    if (currentPath === "" || currentPath === "/") currentPath = "index.html"; // Normalize index
    
    // 3. Scan Universal Navigation Bars and assign the class natively
    // We set a brief timeout to cleanly attach onto any dynamic session buttons that might generate globally
    setTimeout(() => {
        const navLinks = document.querySelectorAll('nav ul a');
        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            if (linkHref === currentPath) {
                link.classList.add('active-link');
            }
        });
    }, 100); 
});
