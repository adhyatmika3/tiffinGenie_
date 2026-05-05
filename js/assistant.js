/**
 * TiffinGenie Assistant Engine
 * Context-aware rule-based AI for meal planning and nutrition guidance.
 */

// ─── UI INJECTION ────────────────────────────────────────────────────────────
function injectAssistant() {
    // Check if already injected
    if (document.getElementById("aiAssistantBtn")) return;

    const html = `
        <!-- AI ASSISTANT UI -->
        <div id="aiAssistantBtn" onclick="toggleAIPanel()" style="position:fixed; bottom:30px; right:30px; width:60px; height:60px; background:#ff7aa2; border-radius:50%; display:flex; justify-content:center; align-items:center; cursor:pointer; box-shadow:0 8px 25px rgba(255,122,162,0.4); z-index:10000; transition:0.3s; color:#fff; font-size:28px;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
            <span>🤖</span>
        </div>

        <div id="aiAssistantPanel" style="display:none; position:fixed; bottom:100px; right:30px; width:350px; height:500px; background:#fff; border-radius:24px; box-shadow:0 20px 60px rgba(0,0,0,0.15); z-index:10000; flex-direction:column; overflow:hidden; border:1px solid #f0f0f0; font-family: 'Poppins', sans-serif;">
            <div style="background:#ff7aa2; padding:20px; color:#fff; display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <h4 style="margin:0; font-family:'Fredoka'; font-size:18px;">Genie Assistant</h4>
                    <p style="margin:0; font-size:12px; opacity:0.9;">Ask about your meals & nutrition</p>
                </div>
                <button onclick="toggleAIPanel()" style="background:none; border:none; color:#fff; font-size:24px; cursor:pointer;">×</button>
            </div>
            <div id="aiChatContent" style="flex:1; overflow-y:auto; padding:20px; display:flex; flex-direction:column; gap:15px; background:#fafafa;">
                <div style="background:#fff; padding:12px 16px; border-radius:15px; border-bottom-left-radius:2px; box-shadow:0 2px 5px rgba(0,0,0,0.02); max-width:85%; font-size:14px; color:#374151; border: 1px solid #f0f0f0;">
                    Hello! I'm your Genie. I've analyzed your current plan. How can I help you today?
                </div>
                <div id="aiQuickActions" style="display:flex; flex-wrap:wrap; gap:8px; margin-top:5px;">
                    <button onclick="askGenie('Suggest a quick breakfast')" style="padding:6px 12px; border-radius:20px; border:1px solid #ff7aa2; background:#fff; color:#ff7aa2; font-size:12px; font-weight:600; cursor:pointer;">💡 Suggest breakfast</button>
                    <button onclick="askGenie('Is my plan balanced?')" style="padding:6px 12px; border-radius:20px; border:1px solid #ff7aa2; background:#fff; color:#ff7aa2; font-size:12px; font-weight:600; cursor:pointer;">📊 Check balance</button>
                    <button onclick="askGenie('Fast dinner idea')" style="padding:6px 12px; border-radius:20px; border:1px solid #ff7aa2; background:#fff; color:#ff7aa2; font-size:12px; font-weight:600; cursor:pointer;">⚡ Quick dinner</button>
                </div>
            </div>
            <div style="padding:15px; border-top:1px solid #f0f0f0; display:flex; gap:10px; background: #fff;">
                <input id="aiInput" type="text" placeholder="Ask Genie..." style="flex:1; border:1px solid #e5e7eb; border-radius:12px; padding:10px 15px; font-size:14px; outline:none;" onkeypress="if(event.key==='Enter') askGenie(this.value)">
                <button onclick="askGenie(document.getElementById('aiInput').value)" style="background:#ff7aa2; border:none; color:#fff; padding:10px 15px; border-radius:12px; cursor:pointer; font-weight: bold;">↑</button>
            </div>
        </div>
    `;

    const div = document.createElement('div');
    div.innerHTML = html;
    document.body.appendChild(div);
}

// ─── LOGIC ──────────────────────────────────────────────────────────────────
var assistantState = {
    constraints: [], // e.g. ["eggs", "vegetables"]
    lastType: "dinner" // Default context
};

function toggleAIPanel() {
    var panel = document.getElementById("aiAssistantPanel");
    if (panel.style.display === "none") {
        panel.style.display = "flex";
        var content = document.getElementById("aiChatContent");
        content.scrollTop = content.scrollHeight;
    } else {
        panel.style.display = "none";
    }
}

function addMessage(text, isUser) {
    var content = document.getElementById("aiChatContent");
    var msg = document.createElement("div");
    msg.style.padding = "12px 16px";
    msg.style.borderRadius = "15px";
    msg.style.fontSize = "14px";
    msg.style.maxWidth = "85%";
    msg.style.lineHeight = "1.5";
    
    if (isUser) {
        msg.style.background = "#ff7aa2";
        msg.style.color = "#fff";
        msg.style.alignSelf = "flex-end";
        msg.style.borderBottomRightRadius = "2px";
    } else {
        msg.style.background = "#fff";
        msg.style.color = "#374151";
        msg.style.alignSelf = "flex-start";
        msg.style.borderBottomLeftRadius = "2px";
        msg.style.boxShadow = "0 2px 5px rgba(0,0,0,0.02)";
        msg.style.border = "1px solid #f0f0f0";
    }
    
    msg.innerText = text;
    content.appendChild(msg);
    content.scrollTop = content.scrollHeight;
}

function askGenie(input) {
    if (!input || input.trim() === "") return;
    var query = input.trim();
    document.getElementById("aiInput").value = "";
    addMessage(query, true);
    setTimeout(function() {
        var response = generateAIResponse(query.toLowerCase());
        addMessage(response, false);
    }, 600);
}

function generateAIResponse(query) {
    var profileRaw = localStorage.getItem("userProfile");
    var planRaw    = localStorage.getItem("weeklyPlan");
    var customRaw  = localStorage.getItem("customMeals");
    
    var profile = profileRaw ? JSON.parse(profileRaw) : {};
    var plan    = planRaw ? JSON.parse(planRaw) : null;
    var custom  = customRaw ? JSON.parse(customRaw) : [];
    
    var cuisine = profile.cuisine || "indian_veg";
    var db      = (typeof MEAL_DB !== 'undefined') ? (MEAL_DB[cuisine] || MEAL_DB["indian_veg"]) : null;
    if (!db) return "I'm ready! Just give me a second to sync with your meal database.";

    // 1. GREETING & SMALL TALK DETECTION
    var greetings = ["hello", "hi", "hii", "hey", "hola", "greetings", "good morning", "good evening"];
    var isGreeting = greetings.some(g => query === g || query.startsWith(g + " ") || query.endsWith(" " + g));
    
    if (isGreeting) {
        var name = profile.name ? profile.name : "there";
        return "Hi " + name + "! 👋 How can I help you with your child's meals today? I can suggest recipes, check your plan's balance, or handle dietary constraints.";
    }

    if (query === "how are you") return "I'm doing great! Just busy thinking about healthy recipes. How can I help you?";
    if (query.includes("thank") || query.includes("thanks")) return "You're very welcome! I'm always here to help. 😊";

    // 2. CONSTRAINT DETECTION (e.g., "no eggs" or "don't have rice")
    var newConstraint = null;
    var negatives = ["don't have", "no", "without", "avoid", "not have", "exclude", "don't want"];
    negatives.forEach(function(neg) {
        if (query.includes(neg)) {
            var parts = query.split(neg);
            if (parts.length > 1) {
                var item = parts[1].trim().split(" ")[0].replace(/[^a-zA-Z]/g, "");
                if (item && item.length > 2 && !assistantState.constraints.includes(item)) {
                    assistantState.constraints.push(item);
                    newConstraint = item;
                }
            }
        }
    });

    // 3. INTENT DETECTION
    var isQuick = query.includes("quick") || query.includes("fast") || query.includes("instant") || query.includes("hurry") || query.includes("easy");
    var isHealthy = query.includes("healthy") || query.includes("balanced") || query.includes("nutrition") || query.includes("protein") || query.includes("check");
    var wantsSuggestion = query.includes("suggest") || query.includes("idea") || query.includes("what to") || query.includes("eat") || query.includes("meal") || query.includes("recipe") || query.includes("give me");

    // Detect Meal Type
    var hasSpecificType = false;
    if (query.includes("breakfast")) { assistantState.lastType = "breakfast"; hasSpecificType = true; }
    else if (query.includes("lunch")) { assistantState.lastType = "lunch"; hasSpecificType = true; }
    else if (query.includes("dinner")) { assistantState.lastType = "dinner"; hasSpecificType = true; }
    
    var type = assistantState.lastType;

    // 4. RESPONSE LOGIC

    // Case A: Nutrition / Balance Check
    if (isHealthy && (query.includes("plan") || query.includes("my meals") || query.includes("is my") || query.includes("check"))) {
        if (!plan) return "I need a plan to analyze first! Go ahead and 'Generate' one on the dashboard.";
        var pCount = 0, total = 0;
        Object.keys(plan).forEach(d => {
            ["breakfast", "lunch", "dinner"].forEach(t => {
                if (plan[d][t]) { 
                    total++; 
                    var tags = plan[d][t].tags ? plan[d][t].tags.join("").toLowerCase() : "";
                    if (tags.includes("protein")) pCount++; 
                }
            });
        });
        var pct = total > 0 ? Math.round((pCount / total) * 100) : 0;
        return "I've reviewed your plan. You have " + pct + "% protein-rich meals. " + (pct < 35 ? "It's a bit low—try adding some paneer or dal dishes." : "It looks very well-balanced!");
    }

    // Case B: Meal Suggestion (Explicit, Implicit, or via New Constraint)
    if (wantsSuggestion || hasSpecificType || newConstraint || isQuick) {
        var pool = (db[type] || []).concat(custom.filter(m => m.type === type));
        var filtered = pool.filter(function(meal) {
            var mealText = (meal.name + " " + (meal.tags || []).join(" ")).toLowerCase();
            var isAllowed = true;
            assistantState.constraints.forEach(function(c) { if (mealText.includes(c.toLowerCase())) isAllowed = false; });
            return isAllowed;
        });

        if (isQuick) filtered = filtered.filter(m => (m.tags || []).includes("simple") || (m.tags || []).includes("light"));

        if (filtered.length > 0) {
            filtered.sort(() => Math.random() - 0.5);
            var items = filtered.slice(0, 3).map(m => m.name);
            
            var prefix = "";
            if (newConstraint) {
                prefix = "Got it, no " + newConstraint + "! Let me find alternatives for " + type + ". How about: ";
            } else {
                prefix = "For " + type + ", I'd suggest ";
            }

            var res = prefix + items.join(", ") + ".";
            if (assistantState.constraints.length > 0 && !newConstraint) res += " These are all " + assistantState.constraints.join(" and ") + "-free.";
            return res;
        }

        if (assistantState.constraints.length > 0) {
            return "I'm having trouble finding " + type + " without " + assistantState.constraints.join("/") + ". Should we try a different meal type?";
        }
    }

    // Default Fallback
    return "I'm not sure I understood perfectly. Are you looking for a meal idea (like 'Suggest a quick dinner'), or should I check if your current plan is balanced?";
}

// Automatically inject on load
document.addEventListener("DOMContentLoaded", injectAssistant);
