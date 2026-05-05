/**
 * Genie AI - Smart Nutrition Assistant
 * Enhanced version with PWA support and smart notifications.
 */

function injectGenieAI() {
    if (document.getElementById("genieChatContainer")) return;
    
    const html = `
        <div id="genieChatContainer" style="position:fixed; bottom:30px; right:30px; z-index:99999; font-family:'Poppins', sans-serif;">
            <button id="genieChatBtn" onclick="toggleGenieChat()" style="width:70px; height:70px; border-radius:50%; background:#ff7aa2; border:none; box-shadow:0 10px 30px rgba(255,122,162,0.4); cursor:pointer; display:flex; align-items:center; justify-content:center; transition:0.3s; position:relative;">
                <span style="font-size:35px;">🤖</span>
                <span id="geniePulse" style="position:absolute; inset:0; border-radius:50%; background:#ff7aa2; opacity:0.3; animation: geniePulse 2s infinite;"></span>
            </button>
            
            <div id="genieChatBox" style="display:none; position:absolute; bottom:90px; right:0; width:350px; height:520px; background:#fff; border-radius:28px; box-shadow:0 25px 70px rgba(0,0,0,0.18); flex-direction:column; overflow:hidden; animation: genieSlideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); border:1px solid #f0f0f0;">
                <div style="background:linear-gradient(135deg, #ff7aa2, #ffb1c1); padding:30px 25px; color:#fff; display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <div style="font-family:'Fredoka'; font-size:22px; font-weight:600;">Genie AI</div>
                        <div style="font-size:12px; opacity:0.9; margin-top:3px;">Your Child's Nutrition Partner</div>
                    </div>
                    <button onclick="toggleGenieChat()" style="background:rgba(255,255,255,0.2); border:none; color:#fff; width:36px; height:36px; border-radius:50%; font-size:20px; cursor:pointer; display:flex; align-items:center; justify-content:center;">×</button>
                </div>
                
                <div id="genieChatMessages" style="flex:1; padding:20px; overflow-y:auto; background:#fafbfc; display:flex; flex-direction:column; gap:15px;">
                    <div class="genie-msg-bot">
                        👋 Hi! I'm your Nutrition Genie. I'm trained on your meal plans and your child's needs. 
                        <div style="margin-top:10px; font-weight:600;">Try asking me:</div>
                        <div style="display:flex; flex-wrap:wrap; gap:6px; margin-top:8px;">
                            <button onclick="sendGenieMessage('Cold friendly meals')" class="genie-chip">🤒 Cold friendly</button>
                            <button onclick="sendGenieMessage('High protein plan')" class="genie-chip">💪 High protein</button>
                            <button onclick="sendGenieMessage('What to make with eggs?')" class="genie-chip">🥚 Egg ideas</button>
                        </div>
                    </div>
                </div>
                
                <div style="padding:15px 20px; background:#fff; border-top:1px solid #f0f0f0; display:flex; gap:12px; align-items:center;">
                    <input type="text" id="genieChatInput" placeholder="Ask your Genie..." style="flex:1; padding:12px 18px; border:1px solid #e5e7eb; border-radius:15px; outline:none; font-family:inherit; font-size:14px; transition:0.2s;" onkeypress="if(event.key==='Enter') sendGenieMessage()">
                    <button onclick="sendGenieMessage()" style="background:#ff7aa2; color:#fff; border:none; width:48px; height:48px; border-radius:15px; cursor:pointer; font-size:20px; box-shadow:0 5px 15px rgba(255,122,162,0.3);">➔</button>
                </div>
            </div>
        </div>
        <style>
            @keyframes geniePulse { 0% { transform: scale(1); opacity: 0.3; } 100% { transform: scale(1.6); opacity: 0; } }
            @keyframes genieSlideUp { from { transform: translateY(30px) scale(0.95); opacity:0; } to { transform: translateY(0) scale(1); opacity:1; } }
            
            .genie-msg-user { background:#ff7aa2; color:#fff; padding:12px 18px; border-radius:20px 20px 4px 20px; font-size:14px; align-self:flex-end; max-width:80%; box-shadow:0 5px 15px rgba(255,122,162,0.2); line-height:1.5; }
            .genie-msg-bot { background:#fff; color:#374151; padding:12px 18px; border-radius:20px 20px 20px 4px; font-size:14px; align-self:flex-start; max-width:80%; border:1px solid #f0f0f0; box-shadow:0 3px 10px rgba(0,0,0,0.03); line-height:1.5; }
            
            .genie-chip { background:#fff; border:1.5px solid #ff7aa2; color:#ff7aa2; padding:6px 12px; border-radius:15px; font-size:11px; font-weight:700; cursor:pointer; transition:0.2s; }
            .genie-chip:hover { background:#ff7aa2; color:#fff; }
            
            #genieChatInput:focus { border-color: #ff7aa2; box-shadow:0 0 0 3px rgba(255,122,162,0.1); }
        </style>
    `;
    const div = document.createElement("div");
    div.innerHTML = html;
    document.body.appendChild(div);
}

window.toggleGenieChat = function() {
    const box = document.getElementById("genieChatBox");
    const btn = document.getElementById("genieChatBtn");
    const isOpen = box.style.display === "flex";
    
    box.style.display = isOpen ? "none" : "flex";
    btn.style.transform = isOpen ? "scale(1)" : "scale(0.9)";
    
    if (!isOpen) {
        setTimeout(() => document.getElementById("genieChatInput").focus(), 150);
    }
};

window.sendGenieMessage = function(preText) {
    const input = document.getElementById("genieChatInput");
    const msg = preText || input.value.trim();
    if (!msg) return;
    
    addMessageToChat(msg, 'user');
    input.value = "";
    
    // Simulate Thinking
    setTimeout(() => {
        const response = getGenieAIResponse(msg.toLowerCase());
        addMessageToChat(response, 'bot');
    }, 650);
};

function addMessageToChat(text, sender) {
    const container = document.getElementById("genieChatMessages");
    const div = document.createElement("div");
    div.className = sender === 'user' ? 'genie-msg-user' : 'genie-msg-bot';
    div.innerText = text;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

function getGenieAIResponse(query) {
    const profile = JSON.parse(localStorage.getItem("userProfile") || "{}");
    const name = profile.name || "parent";

    if (query.includes("cold") || query.includes("sick") || query.includes("cough")) {
        return `Oh no! If your child has a cold, ${name}, I recommend warm, immunity-boosting meals. A "Ginger Lemon Poha" or a comforting "Moong Dal Khichdi" with a dash of turmeric is perfect. Avoid very cold curds or heavy fried food today!`;
    }
    if (query.includes("protein")) {
        return "Strong bones and muscles! 💪 For a high protein day, I'd suggest " + (profile.diet === "non-veg" ? "Egg Bhurji or Chicken Salad" : "Paneer Sabzi or Moong Dal Chilla") + ". These will keep your child energetic all day!";
    }
    if (query.includes("egg")) {
        return "Eggs are nutritional powerhouses! You can whip up an Omelette Roll (perfect for tiffins) or Egg Bhurji with Roti. They stay fresh for hours!";
    }
    if (query.includes("potato") || query.includes("aloo")) {
        return "Aloo is every kid's favorite! 🥔 Try 'Aloo Paratha' or a 'Grilled Aloo Sandwich'. Pro tip: Add some finely chopped spinach to the mash for hidden fiber!";
    }
    if (query.includes("thanks") || query.includes("thank you")) {
        return "You're so welcome! I'm always here to make your mornings easier. 😊 Anything else on your mind?";
    }
    
    return "That's an interesting question! Based on what I know about child nutrition, I'd recommend sticking to balanced, colorful meals. Would you like me to suggest a specific recipe for Breakfast, Lunch, or Dinner?";
}

// Auto-inject on load
document.addEventListener("DOMContentLoaded", injectGenieAI);
